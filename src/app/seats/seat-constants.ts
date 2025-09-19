import { Seat } from "@/lib/types";

export type BasicSeat = Pick<Seat, "id" | "name" | "status">;

export const PEOPLE_OPTIONS = [1, 2] as const;
export const TIME_OPTIONS = [11, 12, 13, 14, 15, 16, 17, 18] as const;

export type PeopleOption = (typeof PEOPLE_OPTIONS)[number];
export type TimeOption = (typeof TIME_OPTIONS)[number];

export const DEFAULT_PEOPLE: PeopleOption = PEOPLE_OPTIONS[0];
export const DEFAULT_TIME: TimeOption = TIME_OPTIONS[0];
export const ROW_SIZE = 3;

export const STATUS_COLOR_CLASS: Record<BasicSeat["status"], string> = {
  available:
    "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200",
  reserved:
    "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200",
  occupied:
    "bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200",
  out_of_service:
    "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300",
};
