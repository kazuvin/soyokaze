export type User = {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
  synced: boolean;
  last_modified: string;
};

export type CreateUserData = Omit<User, 'id' | 'created_at' | 'updated_at' | 'synced' | 'last_modified'>;

export type UpdateUserData = Partial<Pick<User, 'name' | 'email' | 'avatar_url'>>;

export type DatabaseError = {
  message: string;
  code?: string;
};