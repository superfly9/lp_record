-- 초기 데이터 시드: K-pop LP 및 좌석 정보
-- 2024/2025년 인기 K-pop 앨범들

-- LP 데이터 삽입
INSERT INTO lps (title, artist, genre, year, condition, notes) VALUES
-- 2024년 앨범들
('GOLDEN', 'Jung Kook', 'K-pop', 2024, 'excellent', 'BTS 정국 솔로 앨범'),
('rockSTAR', 'LISA', 'K-pop', 2024, 'excellent', 'BLACKPINK 리사 솔로'),
('Muse', 'JIMIN', 'K-pop', 2024, 'excellent', 'BTS 지민 솔로 앨범'),
('HAPPINESS', 'Red Velvet', 'K-pop', 2024, 'excellent', '레드벨벳 정규 앨범'),
('ATE', 'Stray Kids', 'K-pop', 2024, 'excellent', '스트레이 키즈 정규'),
('ETERNAL', 'aespa', 'K-pop', 2024, 'excellent', '에스파 2집'),
('Right Now', 'NewJeans', 'K-pop', 2024, 'excellent', '뉴진스 싱글'),
('DRIP', 'BABYMONSTER', 'K-pop', 2024, 'excellent', 'YG 신인 그룹'),

-- 2025년 예상/최신 앨범들
('FACE THE SUN (Repackage)', 'SEVENTEEN', 'K-pop', 2025, 'excellent', '세븐틴 리패키지'),
('IM NAYEON', 'NAYEON', 'K-pop', 2025, 'excellent', 'TWICE 나연 솔로'),
('BORN PINK (Special Edition)', 'BLACKPINK', 'K-pop', 2025, 'excellent', '블랙핑크 스페셜 에디션'),
('PROOF (Collector Edition)', 'BTS', 'K-pop', 2025, 'excellent', 'BTS 앤솔로지'),
('GIRLS', '(G)I-DLE', 'K-pop', 2025, 'excellent', '여자아이들 정규'),
('CIRCUS', 'Stray Kids', 'K-pop', 2025, 'excellent', '스트레이 키즈 신작'),
('MY WORLD', 'aespa', 'K-pop', 2025, 'excellent', '에스파 3집'),
('LOVE DIVE (LP Ver.)', 'IVE', 'K-pop', 2025, 'excellent', 'IVE 특별 LP 버전');

-- 좌석 데이터 삽입 (20석)
INSERT INTO seats (name, status, notes) VALUES
('A5', 'available', '코너 좌석'),
('B5', 'available', '중앙 구역'),
('C5', 'available', '후면 좌석'),
('D1', 'available', '조용한 구역'),
('D2', 'available', '조용한 구역'),
('D3', 'available', '조용한 구역'),
('D4', 'available', '조용한 구역'),
('D5', 'available', '조용한 구역');