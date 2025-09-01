export const SEAT_STATUS_MAPPING = {
    available: "available",
    occupied: "occupied",
    reserved: "reserved",
    out_of_service: "outOfService",
  } as const;

  export const SEAT_STATUS_MAPPING_KR = {
    available: "사용 가능",
    occupied: "사용중",
    reserved: "예약 중",
    out_of_service: "수리 중",
  } as const;