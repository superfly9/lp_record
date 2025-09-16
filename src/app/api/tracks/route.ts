import { NextRequest, NextResponse } from "next/server";
import { createSupabaseFullAccessClient } from '@/lib/supabase/server'
import getSpotifyAccessToken from "@/app/api/util/token";
interface SpotifyArtist {
  items: Array<{
    id: string;
    images: Array<{ url: string; height: number; width: number }>;
  }>;
  name: string;
  type: 'artist';
}

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<SpotifyArtist>;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: {
    items: Array<{
      id: string;
      name: string;
      track_number: number;
      duration_ms: number;
    }>;
  };
}


async function getSpotifyAlbumTracks(albumId: string, accessToken: string): Promise<Array<{
  track_number: number;
  title: string;
  duration?: string;
  external_id: string;
}> | null> {
  try {
    const url = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify album error: ${response.status}`);
    }

    const data: SpotifyAlbum = await response.json();
    
    if (!data.tracks || !data.tracks.items) {
      return null;
    }

    return data.tracks.items.map((track) => ({
      track_number: track.track_number,
      title: track.name,
      duration: formatDuration(track.duration_ms),
      external_id: track.id,
    }));
  } catch (error) {
    console.error('Spotify 트랙 정보 조회 오류:', error);
    return null;
  }
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
      return NextResponse.json(
        { error: 'LP ID가 필요합니다.' },
        { status: 400 }
      );
    }
    // Spotify 액세스 토큰 가져오기
    const accessToken = await getSpotifyAccessToken();
    
    if (!accessToken) {
      return NextResponse.json({
        error: 'Spotify API 인증에 실패했습니다.',
      }, { status: 500 });
    }
    
    // 트랙 목록 가져오기
    const tracks = await getSpotifyAlbumTracks(lpId, accessToken);
    if (!tracks || tracks.length === 0) {
      return NextResponse.json({
        error: '트랙 목록을 가져올 수 없습니다.',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tracks,
      cached: false,
    });

  } catch (error) {
    console.error('트랙 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
