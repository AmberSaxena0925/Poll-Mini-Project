export interface Poll {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}