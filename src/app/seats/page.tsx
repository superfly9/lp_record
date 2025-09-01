import { createSupabaseServerClient } from "@/lib/supabase/server";
import SeatsClient from "./SeatsClient";
import { Seat } from "@/lib/types";

export default async function SeatsPage() {
	const supabase = await createSupabaseServerClient();

	const {data, error} = await supabase.from("seats").select("id,name,status");

	if (error) {
		console.error("좌석 조회 오류:", error);
	}

	return (
		<main className="p-6 md:p-10" aria-labelledby="seats-heading">
			<h1 id="seats-heading" className="text-2xl font-semibold mb-4">
				좌석 현황 및 예약
			</h1>
			<p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
				실시간 좌석 상태를 확인하고 예약할 수 있습니다.
			</p>

			<div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
				<h2 className="text-xl font-bold mb-3">좌석 상태</h2>
				<div className="grid grid-cols-4 gap-4 text-sm md:text-lg md:font-medium">
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 bg-green-100 border border-green-300 rounded"></div>
						<span>이용 가능</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
						<span>예약됨</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 bg-red-100 border border-red-300 rounded"></div>
						<span>사용 중</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 bg-gray-100 border border-gray-300 rounded"></div>
						<span>점검 중</span>
					</div>
				</div>
			</div>

			{/* 쇼파 모양 좌석 + 모달 (클라이언트) */}
			{Array.isArray(data) && data.length > 0 && (
				<SeatsClient seats={data as Pick<Seat, "id" | "name" | "status">[]} />
			)}

			{/* 좌석이 없는 경우 */}
			{(!data || data.length === 0) && (
				<div className="text-center py-12 text-gray-500 dark:text-gray-400">
					등록된 좌석이 없습니다.
				</div>
			)}
		</main>
	);
}
