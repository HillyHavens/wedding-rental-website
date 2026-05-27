'use client';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const TOKEN_KEY = 'bbb_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export interface ApiError {
  status: number;
  message: string;
  body: unknown;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE}/api${path}`, { ...init, headers });
  const text = await res.text();
  const body = text ? safeParse(text) : null;

  if (!res.ok) {
    const message = extractMessage(body) ?? `HTTP ${res.status}`;
    const err: ApiError = { status: res.status, message, body };
    throw err;
  }
  return body as T;
}

/** Upload a file with optional extra string fields (multipart/form-data). */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const token = getToken();
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  // Do NOT set Content-Type — browser must set it with the multipart boundary

  const res = await fetch(`${BASE}/api${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const text = await res.text();
  const body = text ? safeParse(text) : null;

  if (!res.ok) {
    const message = extractMessage(body) ?? `HTTP ${res.status}`;
    const err: ApiError = { status: res.status, message, body };
    throw err;
  }
  return body as T;
}

/** Base URL for resolving API-hosted assets (uploaded images). */
export const assetBase = BASE;

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

function extractMessage(body: unknown): string | null {
  if (body && typeof body === 'object') {
    const b = body as Record<string, unknown>;
    if (typeof b.message === 'string') return b.message;
    if (Array.isArray(b.message)) return b.message.join(', ');
  }
  return null;
}
