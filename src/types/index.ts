export interface TrashOrder {
  id: string;
  rider_id: string;
  latitude: number;
  longitude: number;
  location_name: string;
  score: number;
  difficulty_label: string;
  pickup_tags: string[];
  delivery_tags: string[];
  order_value_tags: string[];
  created_at: string;
}

export interface Ranking {
  id: string;
  location_name: string;
  address: string;
  score: number;
  difficulty_label: string;
  tags: string[];
  rank: number;
  period: 'daily' | 'weekly';
  created_at: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  avatar_url: string;
  total_marks: number;
  credit_score: number;
  rank_percent: number;
  is_elite: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
