export type User = {
  // id: string;
  // username: string;
  // name: string;
  // image: string;
  // bio: string;
  // avatar_url: string;
  area: string | null
  avatar_url: string | null
  bio: string | null
  country: string | null
  county: string | null
  created_at: string | null
  first_name: string | null
  full_name: string | null
  id: string
  last_name: string | null
  post_code: string | null
  updated_at: string | null
  username: string | null
  website: string | null
};

export type Post = {
  id: string;
  created_at: string;
  content: string;

  user_id: string;
  user: User;

  parent_id: string | null;
  parent: Post | null;

  replies: Post[];
};