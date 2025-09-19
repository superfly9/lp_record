"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BasicSeat,
  DEFAULT_PEOPLE,
  DEFAULT_TIME,
  PeopleOption,
  TimeOption,
  PEOPLE_OPTIONS,
  TIME_OPTIONS,
  ROW_SIZE,
} from "./seat-constants";
import { SofaRow } from "./components/SofaRow";
import { SeatSelectionDialog } from "./components/SeatSelectionDialog";

const chunkSeats = (seats: BasicSeat[]) => {
  const rows: BasicSeat[][] = [];
  for (let index = 0; index < seats.length; index += ROW_SIZE) {
    rows.push(seats.slice(index, index + ROW_SIZE));
  }
  return rows;
};

export default function SeatsClient({ seats }: { seats: BasicSeat[] }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<BasicSeat | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<PeopleOption>(DEFAULT_PEOPLE);
  const [selectedTime, setSelectedTime] = useState<TimeOption>(DEFAULT_TIME);
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const groupedRows = useMemo(() => chunkSeats(seats), [seats]);

  const resetSelection = useCallback(() => {
    setSelectedSeat(null);
    setSelectedPeople(DEFAULT_PEOPLE);
    setSelectedTime(DEFAULT_TIME);
    setGuestName("");
    setGuestContact("");
    setDialogError(null);
    setIsSubmitting(false);
  }, []);

  const handleSeatClick = useCallback((seat: BasicSeat) => {
    if (seat.status !== "available") return;
    setSelectedSeat(seat);
    setSelectedPeople(DEFAULT_PEOPLE);
    setSelectedTime(DEFAULT_TIME);
    setGuestName("");
    setGuestContact("");
    setDialogError(null);
    setIsDialogOpen(true);
  }, []);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) resetSelection();
    },
    [resetSelection],
  );

  const handlePeopleChange = useCallback((people: PeopleOption) => {
    if (!PEOPLE_OPTIONS.includes(people)) return;
    setSelectedPeople(people);
  }, []);

  const handleTimeChange = useCallback((time: TimeOption) => {
    if (!TIME_OPTIONS.includes(time)) return;
    setSelectedTime(time);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedSeat) return;
    if (!PEOPLE_OPTIONS.includes(selectedPeople)) return;
    if (!TIME_OPTIONS.includes(selectedTime)) return;
    if (!guestName.trim() || !guestContact.trim()) {
      setDialogError("예약자 이름과 연락처를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setDialogError(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          startHour: selectedTime,
          durationHours: selectedPeople,
          guestName,
          guestContact,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "예약에 실패했습니다.");
      }

      handleDialogOpenChange(false);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "예약에 실패했습니다.";
      setDialogError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [guestContact, guestName, handleDialogOpenChange, router, selectedPeople, selectedSeat, selectedTime]);

  return (
    <section>
      <div className="max-w-4xl mx-auto">
        {groupedRows.map((row, index) => (
          <SofaRow key={index} seats={row} onSeatClick={handleSeatClick} />
        ))}
      </div>

      <SeatSelectionDialog
        isOpen={isDialogOpen}
        seat={selectedSeat}
        selectedPeople={selectedPeople}
        selectedTime={selectedTime}
        guestName={guestName}
        guestContact={guestContact}
        isSubmitting={isSubmitting}
        errorMessage={dialogError}
        onOpenChange={handleDialogOpenChange}
        onSelectPeople={handlePeopleChange}
        onSelectTime={handleTimeChange}
        onGuestNameChange={setGuestName}
        onGuestContactChange={setGuestContact}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
