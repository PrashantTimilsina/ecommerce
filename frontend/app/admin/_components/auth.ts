"use client";

const AUTH_KEY = "clz_admin_auth";

export type AdminSession = {
  email: string;
  name: string;
  loggedInAt: string;
};

export function loginAsAdmin(
  email: string,
  password: string,
): AdminSession | null {
  if (email === "admin@shop.co" && password === "admin123") {
    const session: AdminSession = {
      email,
      name: "Shop.co Admin",
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY);
}
