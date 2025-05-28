interface ReadOnlyUser {
  id: string;
  name: string;
  username: string;
}

interface User extends ReadOnlyUser {
  phone?: string;
  password: string;
  avatar?: string;
  lastSeen: Date;
  createdAt: Date;
}

type AuthContextType = {
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refreshUser: () => void;
  invalidateUser: () => void;
};