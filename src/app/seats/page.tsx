export default function SeatsPage() {
	return (
		<main className="p-6 md:p-10" aria-labelledby="seats-heading">
			<h1 id="seats-heading" className="text-2xl font-semibold">
				좌석 현황 및 예약
			</h1>
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
				실시간 좌석 상태를 확인하고 예약할 수 있습니다.
			</p>
		</main>
	);
}
