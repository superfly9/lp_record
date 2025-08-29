# LP 관리 · 좌석 예약 웹앱

Next.js(App Router) + TypeScript + Tailwind 기반의 LP 컬렉션/좌석 예약 웹앱입니다.

## 빠른 실행
```bash
# 설치
npm i
# 또는
yarn

# 개발 서버 실행
npm run dev
# 또는
yarn dev

# http://localhost:3000 접속
```

## 주요 기능(초기)
- LP 목록/검색 보기
- 좌석 현황 확인 및 예약
- 이용 안내 페이지
- 어드민(기본 스캐폴딩 예정)

## 개발 원칙
- Supabase: 간단 CRUD/조회는 직접 호출, 복잡/보안 로직은 Route API 사용
- SSR 우선, Tailwind + shadcn/ui
- 가독성, 접근성, DRY 원칙 준수
