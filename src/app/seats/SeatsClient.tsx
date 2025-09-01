"use client";

import { useCallback, useMemo, useState } from "react";
import { Seat } from "@/lib/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type BasicSeat = Pick<Seat, "id" | "name" | "status">;

const PEOPLE_OPTIONS = [1, 2] as const;
const TIME_OPTIONS = [11, 12, 13, 14, 15, 16, 17, 18] as const;

const getStatusColorClass = (status: BasicSeat["status"]) => {
	switch (status) {
		case "available":
			return "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200";
		case "reserved":
			return "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200";
		case "occupied":
			return "bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200";
		case "out_of_service":
			return "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300";
		default:
			return "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300";
	}
};

const SofaSeatButton = ({ seat, onClick }: { seat: BasicSeat; onClick: (seat: BasicSeat) => void }) => {
	const isAvailable = seat.status === "available";

	const handleClick = useCallback(() => {
		if (!isAvailable) return;
		onClick(seat);
	}, [isAvailable, onClick, seat]);

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={!isAvailable}
			aria-disabled={!isAvailable}
			aria-label={`${seat.name} 좌석 ${isAvailable ? "선택" : "선택 불가"}`}
			className={`relative w-24 h-16 mx-auto transition-all duration-200 ${
				isAvailable ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-70"
			} ${getStatusColorClass(seat.status)} border-2 rounded-lg shadow-md flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black`}
		>
			<div className="relative w-full h-full">
				<div className="absolute bottom-0 left-0 right-0 h-3 bg-current opacity-30 rounded-t-md"></div>
				<div className="absolute top-0 left-1 right-1 h-8 bg-current opacity-20 rounded-b-md"></div>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-xs font-semibold">{seat.name}</span>
				</div>
			</div>
		</button>
	);
};

const SofaRow = ({ seats, onClick }: { seats: BasicSeat[]; onClick: (seat: BasicSeat) => void }) => {
	return (
		<div className="flex justify-center items-center gap-8 mb-6">
			{seats.map((seat) => (
				<SofaSeatButton key={seat.id} seat={seat} onClick={onClick} />
			))}
		</div>
	);
};

export default function SeatsClient({ seats }: { seats: BasicSeat[] }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedSeat, setSelectedSeat] = useState<BasicSeat | null>(null);
	const [selectedPeople, setSelectedPeople] = useState<number>(1);
	const [selectedTime, setSelectedTime] = useState<number>(11);

	const groupedRows = useMemo(() => {
		const rows: BasicSeat[][] = [];
		for (let i = 0; i < seats.length; i += 3) rows.push(seats.slice(i, i + 3));
		return rows;
	}, [seats]);

	const handleSeatClick = useCallback((seat: BasicSeat) => {
		if (seat.status !== "available") return;
		setSelectedSeat(seat);
		setSelectedPeople(1);
		setSelectedTime(11);
		setIsDialogOpen(true);
	}, []);

	const handleDialogOpenChange = useCallback((open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			setSelectedSeat(null);
			setSelectedPeople(1);
			setSelectedTime(11);
		}
	}, []);

	const handlePeopleChange = useCallback((people: number) => {
		if (!PEOPLE_OPTIONS.includes(people as 1 | 2)) return;
		setSelectedPeople(people);
	}, []);

	const handleTimeChange = useCallback((time: number) => {
		if (!TIME_OPTIONS.includes(time as (typeof TIME_OPTIONS)[number])) return;
		setSelectedTime(time);
	}, []);

	const handleConfirm = useCallback(() => {
		if (!selectedSeat) return;
		const isValidPeople = PEOPLE_OPTIONS.includes(selectedPeople as 1 | 2);
		const isValidTime = TIME_OPTIONS.includes(selectedTime as (typeof TIME_OPTIONS)[number]);
		if (!isValidPeople || !isValidTime) return;

		// 추후 Supabase 예약 저장 로직 연결
		handleDialogOpenChange(false);
	}, [handleDialogOpenChange, selectedPeople, selectedSeat, selectedTime]);

	return (
		<section>
			<div className="max-w-4xl mx-auto">
				{groupedRows.map((row, index) => (
					<SofaRow key={index} seats={row} onClick={handleSeatClick} />
				))}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
				<DialogContent aria-label="좌석 예약">
					<DialogHeader>
						<DialogTitle>좌석 예약</DialogTitle>
						<DialogDescription>선택한 좌석과 인원/시간을 확인하세요.</DialogDescription>
					</DialogHeader>

					{selectedSeat && (
						<div className="space-y-4">
							<div>
								<span className="text-sm text-gray-500">좌석</span>
								<div className="mt-1 text-base font-medium">{selectedSeat.name}</div>
							</div>

							<div>
								<span className="text-sm text-gray-500">인원</span>
								<div className="mt-2 grid grid-cols-2 gap-2">
									{PEOPLE_OPTIONS.map((people) => (
										<button
											key={people}
											type="button"
											aria-pressed={selectedPeople === people}
											aria-label={`${people}인 선택`}
											className={`h-9 rounded-md border px-3 text-sm ${
												selectedPeople === people
													? "border-black bg-black text-white"
													: "border-gray-300 bg-white dark:bg-gray-900"
											}`}
											onClick={() => handlePeopleChange(people)}
										>
											{people}인
										</button>
									))}
								</div>
							</div>

							<div>
								<span className="text-sm text-gray-500">시간</span>
								<div className="mt-2 grid grid-cols-4 gap-2">
									{TIME_OPTIONS.map((time) => (
										<button
											key={time}
											type="button"
											aria-pressed={selectedTime === time}
											aria-label={`${time}시 선택`}
											className={`h-9 rounded-md border px-3 text-sm ${
												selectedTime === time
													? "border-black bg-black text-white"
													: "border-gray-300 bg-white dark:bg-gray-900"
											}`}
											onClick={() => handleTimeChange(time)}
										>
											{time}:00
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						<button
							type="button"
							aria-label="취소"
							className="h-9 rounded-md border border-gray-300 bg-white px-4 text-sm dark:bg-gray-900"
							onClick={() => handleDialogOpenChange(false)}
						>
							취소
						</button>
						<button
							type="button"
							aria-label="예약 확정"
							className="h-9 rounded-md bg-black px-4 text-sm text-white"
							onClick={handleConfirm}
						>
							확인
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
}


