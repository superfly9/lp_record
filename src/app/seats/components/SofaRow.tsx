import { BasicSeat } from "../seat-constants";
import { SofaSeatButton } from "./SofaSeatButton";

interface SofaRowProps {
  seats: BasicSeat[];
  onSeatClick: (seat: BasicSeat) => void;
}

export function SofaRow({ seats, onSeatClick }: SofaRowProps) {
  return (
    <div className="flex justify-center items-center gap-8 mb-6">
      {seats.map((seat) => (
        <SofaSeatButton key={seat.id} seat={seat} onClick={onSeatClick} />
      ))}
    </div>
  );
}
