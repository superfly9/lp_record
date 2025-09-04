import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient} from '@/lib/supabase/server'

// https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// https://developer.spotify.com/documentation/web-api/reference/get-an-album
interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
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

// https://developer.spotify.com/documentation/web-api/reference/search
interface SpotifySearchResponse {
  albums: {
    items: SpotifyAlbum[];
  };
}

async function getSpotifyAccessToken(): Promise<string | null> {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Spotify API 인증 정보가 없습니다.');
      return null;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Spotify auth error: ${response.status}`);
    }

    const data: SpotifyAuthResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Spotify 인증 오류:', error);
    return null;
  }
}

async function searchSpotifyAlbum(artist: string, album: string, accessToken: string): Promise<SpotifyAlbum | null> {
  try {
    const query = `artist:"${artist}" album:"${album}"`;
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify search error: ${response.status}`);
    }

    const data: SpotifySearchResponse = await response.json();
    
    if (data.albums.items && data.albums.items.length > 0) {
      return data.albums.items[0];
    }
    
    return null;
  } catch (error) {
    console.error('Spotify 앨범 검색 오류:', error);
    return null;
  }
}

async function getSpotifyAlbumTracks(albumId: string, accessToken: string): Promise<Array<{
  track_number: number;
  title: string;
  duration?: string;
  external_id: string;
}> | null> {
  try {
    const url = `https://api.spotify.com/v1/albums/${albumId}`;
    
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


export async function POST(request: NextRequest) {
  try {
    const { lpId } = await request.json();

    if (!lpId) {
      return NextResponse.json(
        { error: 'LP ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: lp, error: lpError } = await supabase
      .from('lps')
      .select('*')
      .eq('id', lpId)
      .single();

    if (lpError || !lp) {
      return NextResponse.json(
        { error: 'LP를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    // Spotify 액세스 토큰 가져오기
    const accessToken = await getSpotifyAccessToken();
    
    if (!accessToken) {
      return NextResponse.json({
        error: 'Spotify API 인증에 실패했습니다.',
      }, { status: 500 });
    }

    // Spotify에서 앨범 검색
    const album = await searchSpotifyAlbum(lp.artist, lp.title, accessToken);
    
    if (!album) {
      return NextResponse.json({
        error: '트랙 정보를 찾을 수 없습니다.',
        searched: { artist: lp.artist, album: lp.title }
      }, { status: 404 });
    }

    // 트랙 목록 가져오기
    const tracks = await getSpotifyAlbumTracks(album.id, accessToken);
    
    if (!tracks || tracks.length === 0) {
      return NextResponse.json({
        error: '트랙 목록을 가져올 수 없습니다.',
      }, { status: 404 });
    }

    const tracksToInsert = tracks.map(track => ({
      ...track,
      lp_id: lpId,
    }));

    const { data: insertedTracks, error: insertError } = await supabase
      .from('tracks')
      .insert(tracksToInsert)
      .select();

    if (insertError) {
      console.error('트랙 저장 오류:', insertError);
      return NextResponse.json(
        { error: '트랙 정보 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tracks: insertedTracks,
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