export default function GuidePage() {
	return (
		<main className="p-6 md:p-10" aria-labelledby="guide-heading">
			<h1 id="guide-heading" className="text-2xl font-semibold">
				이용 안내
			</h1>
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
				이용 규칙과 예약 방법을 확인하세요.
			</p>
			<div className="mt-4">
				<h2 className="text-xl font-bold mb-3">이용 규칙</h2>
				<ul>
					<li className="text-lg font-bold text-gray-600 dark:text-gray-300">
						1.한 번에 최대 3개의 LP판을 이용할 수 있습니다.
					</li>
					<li className="text-lg font-bold text-gray-600 dark:text-gray-300">
						2.현재는 무료입니다.(가오픈)
					</li>
				</ul>
			</div>
			<div className="mt-4">
				<h2 className="text-xl font-bold mb-3">예약 방법</h2>
				<ul>
					<li className="text-lg font-bold text-gray-600 dark:text-gray-300">
						1.좌석을 선택해주세요.
					</li>
					<li className="text-lg font-bold text-gray-600 dark:text-gray-300">
						2.화면에 뜨는 창에서 인원/시간을 선택후 예약 버튼을 클릭하면 &apos;예약하기&apos; 버튼을 눌러주세요.
					</li>
				</ul>
			</div>
		</main>
	);
}
