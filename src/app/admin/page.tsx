export default function AdminPage() {
	return (
		<main className="p-6 md:p-10" aria-labelledby="admin-heading">
			<h1 id="admin-heading" className="text-2xl font-semibold">
				관리자 페이지
			</h1>
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
				LP, 좌석, 예약을 관리합니다. 관리자 권한이 필요합니다.
			</p>
		</main>
	);
}
