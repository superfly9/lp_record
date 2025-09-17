import { NextRequest, NextResponse } from "next/server";
import { createSupabaseFullAccessClient } from '@/lib/supabase/server'
import getSpotifyAccessToken from "@/app/api/util/token";

interface SpotifyAlbumSearchItem { id: string; name: string }
interface SpotifySearchResponse { albums: { items: SpotifyAlbumSearchItem[] } }
interface SpotifyTracksResponse {
  items: Array<{
    id: string;
    name: string;
    track_number: number;
    duration_ms: number;
  }>;
}

async function searchSpotifyAlbum(artist: string, album: string, accessToken: string): Promise<string | null> {
  const query = [`album:"${album}"`, `artist:"${artist}"`].join(' ');
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=1`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!resp.ok) return null;
  const data: SpotifySearchResponse = await resp.json();
  return data.albums?.items?.[0]?.id ?? null;
}

async function getSpotifyAlbumTracks(albumId: string, accessToken: string) {
  const url = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!resp.ok) return null;
  const data: SpotifyTracksResponse = await resp.json();
  const items = data.items || [];
  return items.map((t) => ({
    track_number: t.track_number,
    title: t.name,
    duration: formatDuration(t.duration_ms),
    external_id: t.id,
  }));
}

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    const lpId = request.nextUrl.searchParams.get('lpId');
    if (!lpId) {
      return NextResponse.json({ error: 'LP ID가 필요합니다.' }, { status: 400 });
    }

    const supabase = await createSupabaseFullAccessClient();
    const { data: lp } = await supabase.from('lps').select('*').eq('id', lpId).single();
    if (!lp) {
      return NextResponse.json({ error: 'LP를 찾을 수 없습니다.' }, { status: 404 });
    }

    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Spotify API 인증에 실패했습니다.' }, { status: 500 });
    }

    let albumId: string | null = lp.spotify_album_id ?? null;

    if (!albumId) {
      albumId = await searchSpotifyAlbum(lp.artist, lp.title, accessToken);
      if (albumId) {
        const { error: updateError } = await supabase
          .from('lps')
          .update({ spotify_album_id: albumId })
          .eq('id', lpId);
    
        if (updateError) {
          return NextResponse.json(
            { error: `Spotify 앨범 ID 업데이트 실패: ${updateError.message}` },
            { status: 500 },
          );
        }
      }
    }

    const tracks = await getSpotifyAlbumTracks(albumId!, accessToken);
    if (!tracks || tracks.length === 0) {
      return NextResponse.json({ error: '트랙 목록을 가져올 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, tracks, cached: false });
  } catch (error) {
    console.error('트랙 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
