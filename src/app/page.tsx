import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Seat } from "@/lib/types";

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const { count: lpCount, error: lpError } = await supabase
    .from("lps")
    .select("*", { count: "exact", head: true });

  // 좌석 현황 조회 - status만 필요하므로 선택적으로 조회
  const { data: seatsData, error: seatsError } = await supabase
    .from("seats")
    .select("status");

  const statusMapping = {
    available: "available",
    occupied: "occupied",
    reserved: "reserved",
    out_of_service: "outOfService",
  } as const;

  const seatStats = {
    available: 0,
    occupied: 0,
    reserved: 0,
    outOfService: 0,
  };

  seatsData?.forEach((seat: Pick<Seat, "status">) => {
    const mappedKey = statusMapping[seat.status];
    if (mappedKey) {
      seatStats[mappedKey] += 1;
    }
  });

  // 에러 처리
  if (lpError) {
    console.error("LP count fetch error:", lpError);
  }
  if (seatsError) {
    console.error("Seats fetch error:", seatsError);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">LP Record</h1>
        <p className="text-xl text-muted-foreground">
          LP 관리 & 좌석 예약 서비스
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">LP 컬렉션</h2>
          <p className="text-muted-foreground mb-4">
            보유 중인 LP 목록을 확인하고 검색할 수 있습니다.
          </p>
          <div className="text-3xl font-bold text-primary mb-2">
            {lpCount ?? 0}
          </div>
          <p className="text-sm text-muted-foreground">총 LP 개수</p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">좌석 현황</h2>
          <p className="text-muted-foreground mb-4">
            실시간 좌석 현황과 예약 상태를 확인할 수 있습니다.
          </p>
          <div className="flex gap-4 mb-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {seatStats.available}
              </div>
              <p className="text-xs text-muted-foreground">이용 가능</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {seatStats.occupied + seatStats.reserved}
              </div>
              <p className="text-xs text-muted-foreground">사용 중</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
