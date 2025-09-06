-- 트랙 테이블 생성
-- LP 앨범의 개별 트랙 정보를 저장하는 테이블

CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lp_id UUID NOT NULL REFERENCES lps(id) ON DELETE CASCADE,
  track_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  duration TEXT, -- 예: "3:42", "4:15" 등
  external_id TEXT, -- 외부 API (Spotify, MusicBrainz 등)에서의 ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 한 앨범 내에서 트랙 번호는 고유해야 함
  CONSTRAINT unique_track_number_per_lp UNIQUE (lp_id, track_number)
);

-- 인덱스 생성
CREATE INDEX idx_tracks_lp_id ON tracks(lp_id);
CREATE INDEX idx_tracks_track_number ON tracks(lp_id, track_number);
CREATE INDEX idx_tracks_external_id ON tracks(external_id) WHERE external_id IS NOT NULL;

-- updated_at 자동 업데이트 트리거 추가
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS 정책
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- 트랙 조회 - 모든 사용자가 가능
CREATE POLICY "트랙 조회 - 모든 사용자" ON tracks
  FOR SELECT USING (true);

-- 트랙 관리 - 관리자만 가능 (외부 API에서 데이터를 가져와 저장할 때 사용)
CREATE POLICY "트랙 관리 - 관리자만" ON tracks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );