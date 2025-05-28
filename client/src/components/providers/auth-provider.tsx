import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  type ReactNode,
} from "@tanstack/react-router";
import { useAuthStore } from "@/lib/store/auth-store";
import { LoaderPinwheel } from "lucide-react";

const SERVER_URL = "http://localhost:3000"; // your backend

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const store = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Fetch current user
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(`${SERVER_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        const isAuthError = res.status === 401 || res.status === 403;
        if (isAuthError) {
          store.setUser(null);
          return null;
        }
        throw new Error(`Failed to fetch user: ${res.statusText}`);
      }

      const json = await res.json();
      return json.user; // 👈 Your backend wraps it as { user, ... }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const userFromStore = useAuthStore((state) => state.user);

  useEffect(() => {
    if ((user?.id ?? null) !== (userFromStore?.id ?? null)) {
      store.setUser(user ?? null);
    }
  }, [user, userFromStore, store]);

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = ["/auth/login", "/auth/register"].includes(
        location.pathname
      );

      if (
        user &&
        store.isAuthenticated &&
        isAuthPage &&
        location.pathname !== "/messages"
      ) {
        navigate({ to: "/messages" });
      } else if (!user && !isAuthPage && location.pathname !== "/auth/login") {
        navigate({ to: "/auth/login" });
      }
    }
  }, [user, store.isAuthenticated, location.pathname, navigate, isLoading]);

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: !!store.isAuthenticated,
    isLoading,
    isError,
    error: error ?? null,
    refreshUser: refetch,
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderPinwheel className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
