import { NextRequest, NextResponse } from "next/server";
import getSpotifyAccessToken from "@/app/api/util/token";

interface SpotifyImage { url: string; height: number | null; width: number | null }
interface SpotifyArtistBrief { id: string; name: string; external_urls?: { spotify?: string }; uri?: string }
interface SpotifyAlbumItem {
  id: string;
  name: string;
  album_type?: string;
  album_group?: string;
  total_tracks?: number;
  release_date?: string;
  release_date_precision?: string;
  images: SpotifyImage[];
  artists: SpotifyArtistBrief[];
  external_urls?: { spotify?: string };
  uri?: string;
}

interface SpotifySearchAlbumsResponse {
  albums: {
    items: SpotifyAlbumItem[];
  }
}

export async function GET(request: NextRequest) {
  try {
    const MAX_LIMIT = 20;
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get('artist')?.trim();
    const album = searchParams.get('album')?.trim();
    const limitParam = searchParams.get('limit');
    const market = searchParams.get('market') || 'KR';
    const limit = Math.min(limitParam ? Number(limitParam) : MAX_LIMIT);

    if (!artist && !album) {
      return NextResponse.json({ error: 'artist 또는 album 중 하나는 필요합니다.' }, { status: 400 });
    }

    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Spotify API 인증 실패' }, { status: 500 });
    }

    const q = [
      album ? `album:"${album}"` : null,
      artist ? `artist:"${artist}"` : null,
    ].filter(Boolean).join(' ');

    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.set('q', q);
    url.searchParams.set('type', 'album');
    url.searchParams.set('limit', String(limit));
    if (market) url.searchParams.set('market', market);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Spotify search error: ${response.status}` }, { status: 502 });
    }

    const data: SpotifySearchAlbumsResponse = await response.json();
    const items = data.albums?.items || [];

    const results = items.map((it) => ({
      id: it.id,
      name: it.name,
      album_type: it.album_type,
      album_group: it.album_group,
      total_tracks: it.total_tracks,
      release_date: it.release_date,
      release_date_precision: it.release_date_precision,
      images: it.images,
      artists: it.artists?.map(a => ({ id: a.id, name: a.name, external_urls: a.external_urls, uri: a.uri })) ?? [],
      external_urls: it.external_urls,
      uri: it.uri,
    }));

    return NextResponse.json({ results, count: results.length, market: market ?? null });
  } catch (err) {
    console.error('spotify search-album error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

