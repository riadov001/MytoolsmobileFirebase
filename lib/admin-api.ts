import { fetch as expoFetch } from "expo/fetch";
import { Platform } from "react-native";
import { router } from "expo-router";

const getApiBase = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
  }
  return "https://saas.mytoolsgroup.eu";
};

const API_BASE = getApiBase();

let accessToken: string | null = null;
let refreshTokenValue: string | null = null;
let onTokenExpired: (() => void) | null = null;

export function setAdminTokens(access: string | null, refresh: string | null) {
  accessToken = access;
  refreshTokenValue = refresh;
}

export function getAdminAccessToken() {
  return accessToken;
}

export function setOnTokenExpired(cb: () => void) {
  onTokenExpired = cb;
}

interface AdminApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function adminApiCall<T = any>(
  endpoint: string,
  options: AdminApiOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const fetchHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };

  if (accessToken) {
    fetchHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const url = `${API_BASE}${endpoint}`;

  const fetchOptions: any = {
    method,
    headers: fetchHeaders,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await expoFetch(url, fetchOptions);

  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      fetchHeaders["Authorization"] = `Bearer ${accessToken}`;
      const retryRes = await expoFetch(url, { ...fetchOptions, headers: fetchHeaders });
      if (!retryRes.ok) {
        const errMsg = await parseError(retryRes);
        throw new Error(errMsg);
      }
      return parseResponse<T>(retryRes);
    }
    if (onTokenExpired) onTokenExpired();
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  if (res.status === 403) {
    throw new Error("Accès refusé. Vous n'avez pas les permissions nécessaires.");
  }

  if (!res.ok) {
    const errMsg = await parseError(res);
    throw new Error(errMsg);
  }

  return parseResponse<T>(res);
}

async function tryRefreshToken(): Promise<boolean> {
  if (!refreshTokenValue) return false;
  try {
    const res = await expoFetch(`${API_BASE}/api/mobile/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.accessToken) {
        accessToken = data.accessToken;
        if (data.refreshToken) refreshTokenValue = data.refreshToken;
        return true;
      }
    }
  } catch {}
  return false;
}

async function parseError(res: Response): Promise<string> {
  let errorMessage = `Erreur ${res.status}`;
  try {
    const text = await res.text();
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      if (text) errorMessage = text.substring(0, 200);
    }
  } catch {}
  return errorMessage;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text || text.trim() === "") return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function adminLogin(email: string, password: string) {
  const res = await expoFetch(`${API_BASE}/api/mobile/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errMsg = await parseError(res);
    throw new Error(errMsg);
  }

  const data = await res.json();
  if (data.accessToken) {
    accessToken = data.accessToken;
    refreshTokenValue = data.refreshToken || null;
  }
  return data;
}

export const adminAnalytics = {
  get: () => adminApiCall<any>("/api/mobile/admin/analytics"),
};

export const adminQuotes = {
  getAll: () => adminApiCall<any[]>("/api/mobile/admin/quotes"),
  getById: (id: string) => adminApiCall<any>(`/api/mobile/quotes/${id}`),
  create: (data: any) => adminApiCall<any>("/api/mobile/admin/quotes", { method: "POST", body: data }),
  update: (id: string, data: any) => adminApiCall<any>(`/api/mobile/admin/quotes/${id}`, { method: "PATCH", body: data }),
  updateStatus: (id: string, status: string) => adminApiCall<any>(`/api/mobile/admin/quotes/${id}/status`, { method: "PATCH", body: { status } }),
  delete: (id: string) => adminApiCall<any>(`/api/mobile/admin/quotes/${id}`, { method: "DELETE" }),
};

export const adminInvoices = {
  getAll: () => adminApiCall<any[]>("/api/mobile/admin/invoices"),
  getById: (id: string) => adminApiCall<any>(`/api/mobile/invoices/${id}`),
  create: (data: any) => adminApiCall<any>("/api/mobile/admin/invoices", { method: "POST", body: data }),
  update: (id: string, data: any) => adminApiCall<any>(`/api/mobile/admin/invoices/${id}`, { method: "PATCH", body: data }),
  delete: (id: string) => adminApiCall<any>(`/api/mobile/admin/invoices/${id}`, { method: "DELETE" }),
};

export const adminReservations = {
  getAll: () => adminApiCall<any[]>("/api/mobile/admin/reservations"),
  getById: (id: string) => adminApiCall<any>(`/api/mobile/reservations/${id}`),
  create: (data: any) => adminApiCall<any>("/api/mobile/admin/reservations", { method: "POST", body: data }),
  update: (id: string, data: any) => adminApiCall<any>(`/api/mobile/admin/reservations/${id}`, { method: "PATCH", body: data }),
  updateStatus: (id: string, status: string) => adminApiCall<any>(`/api/mobile/admin/reservations/${id}/status`, { method: "PATCH", body: { status } }),
  delete: (id: string) => adminApiCall<any>(`/api/mobile/admin/reservations/${id}`, { method: "DELETE" }),
};

export const adminClients = {
  getAll: () => adminApiCall<any[]>("/api/mobile/admin/clients"),
  getById: (id: string) => adminApiCall<any>(`/api/mobile/admin/clients/${id}`),
  create: (data: any) => adminApiCall<any>("/api/mobile/admin/clients", { method: "POST", body: data }),
  update: (id: string, data: any) => adminApiCall<any>(`/api/mobile/admin/clients/${id}`, { method: "PATCH", body: data }),
  delete: (id: string) => adminApiCall<any>(`/api/mobile/admin/clients/${id}`, { method: "DELETE" }),
};

export const adminProfile = {
  get: () => adminApiCall<any>("/api/mobile/profile"),
  update: (data: any) => adminApiCall<any>("/api/mobile/profile", { method: "PATCH", body: data }),
};

export const adminNotifications = {
  getAll: () => adminApiCall<any[]>("/api/mobile/notifications"),
  getUnreadCount: () => adminApiCall<{ count: number }>("/api/mobile/notifications/unread-count"),
  markRead: (id: string) => adminApiCall<any>(`/api/mobile/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => adminApiCall<any>("/api/mobile/notifications/mark-all-read", { method: "POST" }),
};
