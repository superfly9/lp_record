import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

const ADMIN_ROLE = "admin";

const toIsoTime = (hour: number) => {
  const base = new Date();
  base.setMilliseconds(0);
  base.setSeconds(0);
  base.setMinutes(0);
  base.setHours(hour, 0, 0, 0);
  return base.toISOString();
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      seatId,
      startHour,
      durationHours,
      guestName,
      guestContact,
    } = body ?? {};

    if (!seatId || typeof startHour !== "number" || !guestName || !guestContact) {
      return NextResponse.json({ error: "seatId, startHour, guestName, guestContact는 필수입니다." }, { status: 400 });
    }

    const sanitizedName = String(guestName).trim();
    const sanitizedContact = String(guestContact).trim();

    if (!sanitizedName || !sanitizedContact) {
      return NextResponse.json({ error: "예약자 이름과 연락처를 입력해 주세요." }, { status: 400 });
    }

    const supabase = createSupabaseServiceRoleClient();

    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", ADMIN_ROLE)
      .limit(1)
      .maybeSingle();

    if (adminError || !adminProfile) {
      return NextResponse.json({ error: "관리자 정보를 확인할 수 없습니다." }, { status: 500 });
    }

    const startTime = toIsoTime(startHour);
    const hours = typeof durationHours === "number" && durationHours > 0 ? durationHours : 1;
    const endTime = toIsoTime(startHour + hours);

    const basePayload = {
      seat_id: seatId,
      start_time: startTime,
      end_time: endTime,
      status: "active" as const,
      user_id: adminProfile.id,
      guest_name: sanitizedName,
      guest_contact: sanitizedContact,
      people_count: hours,
    };

    const { data: existing, error: existingError } = await supabase
      .from("reservations")
      .select("id")
      .eq("seat_id", seatId)
      .eq("start_time", startTime)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from("reservations")
        .update(basePayload)
        .eq("id", existing.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase
        .from("reservations")
        .insert(basePayload);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    const { error: seatUpdateError } = await supabase
      .from("seats")
      .update({ status: "reserved" })
      .eq("id", seatId);

    if (seatUpdateError) {
      return NextResponse.json({ error: seatUpdateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("reservations POST error", error);
    return NextResponse.json({ error: "예약 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
