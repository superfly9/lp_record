export interface Profile {
  id: string;
  display_name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface LP {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  year?: number;
  cover_url?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // 조인된 데이터
  tracks?: Track[];
}

export interface Track {
  id: string;
  lp_id: string;
  track_number: number;
  title: string;
  duration?: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Seat {
  id: string;
  name: string;
  status: 'available' | 'reserved' | 'occupied' | 'out_of_service';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  seat_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: 'active' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // 조인된 데이터
  seat?: Seat;
  profile?: Profile;
}