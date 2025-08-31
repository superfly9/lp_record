# LP 관리 & 좌석 예약 프로젝트

## 프로젝트 개요
- 목적: 보유 LP 목록 관리, 좌석 예약/현황 제공, 이용 안내 및 관리자 운영
- 우선순위: 쉬운 유지보수, 가독성 높은 코드, 비개발자도 관리 가능한 어드민

## 기술 스택
- Next.js 15 (App Router) + TypeScript
- 스타일: Tailwind CSS 기본. 서버 사이드 렌더링(SSR) 호환
- UI: shadcn/ui (Headless + 접근성 우선)
- 데이터: Supabase (PostgreSQL) - DB + 자동 REST API/Realtime
- 렌더링: 기본은 서버 컴포넌트. 상태/이벤트 필요시만 클라이언트 컴포넌트

## API 사용 원칙 (하이브리드)
- **단순 CRUD/조회/리스트**: 클라이언트/서버 컴포넌트에서 Supabase 직접 호출
- **복잡/보안/외부 연동**: Next.js Route API (`/app/api/**/route.ts`)에서 처리

## 페이지 구조
- `/` 홈: LP 하이라이트 + 좌석 현황 요약
- `/lps` LP 목록/검색/필터/상세
- `/seats` 좌석 현황/예약/실시간 업데이트
- `/guide` 이용 안내/규칙/FAQ
- `/admin` 어드민 (역할 기반 접근 제어)

## 데이터 모델
- `profiles`: { id(uuid=auth.uid), display_name, role('admin'|'user'), created_at }
- `lps`: { id, title, artist, genre, year, cover_url, condition, notes, created_at, updated_at }
- `seats`: { id, name, status('available'|'reserved'|'occupied'|'out_of_service'), notes }
- `reservations`: { id, seat_id, user_id(uuid), start_time, end_time, status('active'|'cancelled'|'completed'), notes, created_at }

## RLS 정책
- `lps`: SELECT 모두 허용, INSERT/UPDATE/DELETE는 role='admin'만
- `seats`: SELECT 모두 허용, 변경은 admin만
- `reservations`: INSERT(본인), SELECT(본인+admin전체), UPDATE/DELETE(본인예약+admin)

## 코딩 규칙
- 이름: 의미있는 식별자, 축약어 지양, 이벤트 핸들러는 `handle*` 접두어
- 함수: `const fnName = () => {}` 형태, 타입 정의 적극 활용
- 제어 흐름: Early Return 우선, 깊은 중첩 회피
- 접근성: `tabIndex`, `aria-*`, 키보드 핸들링 포함
- 컴포넌트: 작은 단위 분리, DRY 원칙
- 스타일: Tailwind 유틸리티 우선, 반복 패턴은 컴포넌트/variants로 추출

## 환경변수
- 공개: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 서버 전용: `SUPABASE_SERVICE_ROLE_KEY`

## 체크리스트
- [ ] RLS 정책 작성/테스트 완료
- [ ] 예약 중복/시간 검증 Route API 구현
- [ ] Realtime 구독으로 좌석/예약 UI 실시간 반영
- [ ] 어드민 UI에서 LP/좌석/예약 관리 가능
- [ ] 환경변수/시크릿 설정 및 배포 환경 검증