import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      console.log("useAuth - Checking token:", token ? "Found" : "Missing");
      if (!token) {
        console.warn("useAuth - No authentication token found");
        throw new Error('No token');
      }
      
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("useAuth - Response status:", response.status);
      if (!response.ok) {
        console.error("useAuth - Authentication failed, removing token");
        localStorage.removeItem('authToken');
        throw new Error('Unauthorized');
      }
      
      const userData = await response.json();
      console.log("useAuth - User data received:", userData?.email);
      return userData;
    },
    retry: false,
  });

  const login = (token: string, userData: any) => {
    localStorage.setItem('authToken', token);
    queryClient.setQueryData(["/api/auth/user"], userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    queryClient.setQueryData(["/api/auth/user"], null);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
