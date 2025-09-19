import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BasicSeat,
  PeopleOption,
  TimeOption,
  PEOPLE_OPTIONS,
  TIME_OPTIONS,
} from "../seat-constants";

interface SeatSelectionDialogProps {
  isOpen: boolean;
  seat: BasicSeat | null;
  selectedPeople: PeopleOption;
  selectedTime: TimeOption;
  guestName: string;
  guestContact: string;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onOpenChange: (open: boolean) => void;
  onSelectPeople: (people: PeopleOption) => void;
  onSelectTime: (time: TimeOption) => void;
  onGuestNameChange: (value: string) => void;
  onGuestContactChange: (value: string) => void;
  onConfirm: () => void;
}

export function SeatSelectionDialog({
  isOpen,
  seat,
  selectedPeople,
  selectedTime,
  guestName,
  guestContact,
  isSubmitting,
  errorMessage,
  onOpenChange,
  onSelectPeople,
  onSelectTime,
  onGuestNameChange,
  onGuestContactChange,
  onConfirm,
}: SeatSelectionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-label="좌석 예약">
        <DialogHeader>
          <DialogTitle>좌석 예약</DialogTitle>
          <DialogDescription>선택한 좌석과 인원/시간을 확인하세요.</DialogDescription>
        </DialogHeader>

        {seat && (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">좌석</span>
              <div className="mt-1 text-base font-medium">{seat.name}</div>
            </div>

            <div>
              <span className="text-sm text-gray-500">인원</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {PEOPLE_OPTIONS.map((people) => (
                  <Button
                    key={people}
                    variant={selectedPeople === people ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectPeople(people)}
                  >
                    {people}인
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">시간</span>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {TIME_OPTIONS.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectTime(time)}
                  >
                    {time}:00
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">예약자 이름</span>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                placeholder="이름"
                value={guestName}
                onChange={(event) => onGuestNameChange(event.target.value)}
              />
            </div>

            <div>
              <span className="text-sm text-gray-500">연락처</span>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                placeholder="전화번호 또는 이메일"
                value={guestContact}
                onChange={(event) => onGuestContactChange(event.target.value)}
              />
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            ) : null}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!seat || !guestName.trim() || !guestContact.trim() || isSubmitting}
          >
            {isSubmitting ? "예약 중..." : "확인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
