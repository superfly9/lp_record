import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BasicSeat, STATUS_COLOR_CLASS } from "../seat-constants";

interface SofaSeatButtonProps {
  seat: BasicSeat;
  onClick: (seat: BasicSeat) => void;
}

export function SofaSeatButton({ seat, onClick }: SofaSeatButtonProps) {
  const isAvailable = seat.status === "available";

  const handleClick = useCallback(() => {
    if (!isAvailable) return;
    onClick(seat);
  }, [isAvailable, onClick, seat]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={!isAvailable}
      className={`relative w-24 h-16 mx-auto transition-all duration-200 p-0 ${
        isAvailable ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-70"
      } ${STATUS_COLOR_CLASS[seat.status] ?? STATUS_COLOR_CLASS.out_of_service} border-2 rounded-lg shadow-md focus-visible:ring-offset-2 focus-visible:ring-black`}
    >
      <div className="relative w-full h-full">
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-current opacity-30 rounded-t-md" />
        <div className="absolute top-0 left-1 right-1 h-8 bg-current opacity-20 rounded-b-md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold">{seat.name}</span>
        </div>
      </div>
    </Button>
  );
}
