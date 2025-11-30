const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

export const register = async (payload: RegisterData) => {
  const response = await apiCall<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.success && response.data.token) {
    setToken(response.data.token);
  }

  return response;
};

export const login = async (payload: LoginData) => {
  const response = await apiCall<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.success && response.data.token) {
    setToken(response.data.token);
  }

  return response;
};

export const getCurrentUser = async () => apiCall<UserResponse>("/auth/me", { method: "GET" });

export const logout = () => removeToken();

