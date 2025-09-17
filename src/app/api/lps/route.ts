import { NextRequest, NextResponse } from "next/server";
import { createSupabaseFullAccessClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, artist, cover_url, genre, year, condition = 'good', notes, spotify_album_id } = body || {};

    if (!title || !artist) {
      return NextResponse.json({ error: 'title과 artist는 필수입니다.' }, { status: 400 });
    }

    const supabase = await createSupabaseFullAccessClient();
    const { data, error } = await supabase
      .from('lps')
      .insert([{ title, artist, cover_url, genre, year, condition, notes, spotify_album_id }])
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'LP 생성 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lp: data });
  } catch (err) {
    console.error('lps POST error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
