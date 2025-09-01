import { SEAT_STATUS_MAPPING_KR } from "@/constant/seat-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Seat } from "@/lib/types";

export default async function SeatsPage() {
	const supabase = await createSupabaseServerClient();

	const {data, error} = await supabase.from("seats").select("id,name,status");

	if (error) {
		console.error("좌석 조회 오류:", error);
	}

	return (
		<main className="p-6 md:p-10" aria-labelledby="seats-heading">
			<h1 id="seats-heading" className="text-2xl font-semibold">
				좌석 현황 및 예약
			</h1>
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
				실시간 좌석 상태를 확인하고 예약할 수 있습니다.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data?.map((seat:Pick<Seat, "id" | "name" | "status">) => (
					<div key={seat.id}>{seat.name} - {SEAT_STATUS_MAPPING_KR[seat.status]}</div>
				))}
			</div>
		</main>
	);
}
