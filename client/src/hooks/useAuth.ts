import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  admin: {
    id: number;
    username: string;
    email: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  login: (token: string, admin: any) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      login: (token, admin) => {
        set({ token, admin, isAuthenticated: true });
        // Set token in API requests
        localStorage.setItem("admin-token", token);
      },
      logout: () => {
        set({ token: null, admin: null, isAuthenticated: false });
        localStorage.removeItem("admin-token");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

// Helper to get token for API requests
export const getAuthToken = () => {
  return localStorage.getItem("admin-token");
};
