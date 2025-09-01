# LP 관리 · 좌석 예약 웹앱

Next.js(App Router) + TypeScript + Tailwind 기반의 LP 컬렉션/좌석 예약 웹앱입니다.

## 주요 기능(초기)
- LP 목록/검색 보기
- 좌석 현황 확인 및 예약
- 이용 안내 페이지
- 어드민(기본 스캐폴딩 예정)

## 개발 원칙
- Supabase: 간단 CRUD/조회는 직접 호출, 복잡/보안 로직은 Route API 사용
- SSR 우선, Tailwind + shadcn/ui
- 가독성, 접근성, DRY 원칙 준수


## DB관련
RDBMS므로 join으로 다른 테이블 참고 가능

 1. profiles 테이블 (사용자 정보)

  | id (UUID)           | display_name | role  | created_at        |
  |---------------------|--------------|-------|-------------------|
  | user-123-abc        | 김철수       | user  | 2024-01-01 10:00  |
  | admin-456-def       | 관리자       | admin | 2024-01-01 09:00  |

  2. lps 테이블 (LP 정보)

  | id      | title        | artist    | genre | year | condition |
  |---------|--------------|-----------|-------|------|-----------|
  | lp-001  | Abbey Road   | Beatles   | Rock  | 1969 | excellent |
  | lp-002  | Kind of Blue | Miles     | Jazz  | 1959 | good      |

  3. seats 테이블 (좌석 정보)

  | id      | name | status    | notes        |
  |---------|------|-----------|--------------|
  | seat-01 | A1   | available | 창가 자리    |
  | seat-02 | A2   | occupied  | 현재 사용중  |

  4. reservations 테이블 (예약 정보)

  | id   | seat_id | user_id | start_time | end_time | status |
  |------|---------|---------|------------|----------|--------|
  | res1 | seat-01 | user123 | 14:00      | 16:00    | active |


  Primary Key (기본키): 각 행을 고유하게 식별하는 열 (id 컬럼)
  Foreign Key (외래키): 다른 테이블을 참조하는 열 (user_id는 profiles.id를 참조)
  RLS (Row Level Security): 사용자별로 접근 권한을 제어하는 보안 정책

  예를 들어, 일반 사용자는 자신의 예약만 보고, 관리자는 모든 예약을 볼 수 있게 설정


  
  ## supabase 설정
  https://supabase.com/docs/guides/auth/server-side/nextjs