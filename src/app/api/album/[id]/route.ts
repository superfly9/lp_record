import { NextRequest, NextResponse } from "next/server";
import getSpotifyAccessToken from "@/app/api/util/token";

export async function GET(request: NextRequest, { params }: RouteContext<'/api/album/[id]'>) {
  const accessToken = await getSpotifyAccessToken();
  const { id } = await params;

  if (!id || !/^[A-Za-z0-9]{10,30}$/.test(id)) {
    return NextResponse.json({ error: '유효한 Spotify 앨범 ID가 아닙니다.' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API 오류: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' }, { status: 500 });
  }
}
