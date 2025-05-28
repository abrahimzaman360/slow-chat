"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth-store";
import { LoaderPinwheel } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SERVER_URL } from "../constants";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const store = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
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
      const isAuthPage = ["/auth/login", "/auth/register", "/"].includes(
        pathname
      );

      if (
        user &&
        store.isAuthenticated &&
        isAuthPage &&
        pathname !== "/messages"
      ) {
        router.push("/messages", {
          scroll: false,
        });
        ({ to: "/messages" });
      } else if (!user && !isAuthPage && pathname !== "/auth/login") {
        router.push("/auth/login", {
          scroll: false,
        });
      }
    }
  }, [user, store.isAuthenticated, pathname, router, isLoading]);

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: !!store.isAuthenticated,
    isLoading,
    isError,
    error: error ?? null,
    refreshUser: refetch,
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    logout: () => {
      store.setUser(null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/", {
        scroll: false,
      });
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderPinwheel className="h-8 w-8 animate-spin" />
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
