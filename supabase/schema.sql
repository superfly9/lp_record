-- LP Record 데이터베이스 스키마

-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LP 테이블
CREATE TABLE lps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT,
  year INTEGER,
  cover_url TEXT,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 좌석 테이블
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied', 'out_of_service')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 예약 테이블
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 시간 제약 조건
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
  -- 시간 중복 방지는 애플리케이션 레벨에서 처리
);

-- 인덱스 생성
CREATE INDEX idx_lps_artist ON lps(artist);
CREATE INDEX idx_lps_genre ON lps(genre);
CREATE INDEX idx_lps_year ON lps(year);
CREATE INDEX idx_seats_status ON seats(status);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_seat_id ON reservations(seat_id);
CREATE INDEX idx_reservations_time ON reservations(start_time, end_time);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_lps_updated_at BEFORE UPDATE ON lps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seats_updated_at BEFORE UPDATE ON seats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책

-- profiles 테이블 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "프로필 조회 - 모든 사용자" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "프로필 생성 - 본인만" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "프로필 수정 - 본인만" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- lps 테이블 RLS
ALTER TABLE lps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "LP 조회 - 모든 사용자" ON lps
  FOR SELECT USING (true);

CREATE POLICY "LP 관리 - 관리자만" ON lps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- seats 테이블 RLS
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "좌석 조회 - 모든 사용자" ON seats
  FOR SELECT USING (true);

CREATE POLICY "좌석 관리 - 관리자만" ON seats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- reservations 테이블 RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "예약 조회 - 본인 또는 관리자" ON reservations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "예약 생성 - 로그인 사용자" ON reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "예약 수정 - 본인 또는 관리자" ON reservations
  FOR UPDATE USING (
    (auth.uid() = user_id AND start_time > NOW()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "예약 삭제 - 본인 또는 관리자" ON reservations
  FOR DELETE USING (
    (auth.uid() = user_id AND start_time > NOW()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Realtime 활성화
ALTER publication supabase_realtime ADD TABLE seats;
ALTER publication supabase_realtime ADD TABLE reservations;

-- 초기 데이터 (예시)
INSERT INTO seats (name) VALUES 
  ('A1'), ('A2'), ('A3'), ('A4'),
  ('B1'), ('B2'), ('B3'), ('B4'),
  ('C1'), ('C2'), ('C3'), ('C4');