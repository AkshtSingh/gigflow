import type { ApiEnvelope, AuthResponse, Lead, LeadFilters, LeadSummary, PaginatedLeadsResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type RequestOptions = RequestInit & {
  token?: string | null;
};

const getAuthToken = (): string | null => localStorage.getItem('smart-leads-token');

const buildQuery = (filters?: Partial<LeadFilters>): string => {
  if (!filters) {
    return '';
  }

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : '';
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = options.token ?? getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Request failed');
  }

  return payload?.data ?? (undefined as T);
};

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      token: null
    }),
  register: async (name: string, email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      token: null
    })
};

export const leadsApi = {
  summary: async (): Promise<LeadSummary> => request<LeadSummary>('/api/leads/summary'),
  list: async (filters: LeadFilters): Promise<PaginatedLeadsResponse> =>
    request<PaginatedLeadsResponse>(`/api/leads${buildQuery(filters)}`),
  create: async (payload: Omit<Lead, '_id' | 'owner' | 'createdAt' | 'updatedAt'>): Promise<Lead> =>
    request<Lead>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  update: async (leadId: string, payload: Partial<Omit<Lead, '_id' | 'owner' | 'createdAt' | 'updatedAt'>>): Promise<Lead> =>
    request<Lead>(`/api/leads/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  remove: async (leadId: string): Promise<void> =>
    request<void>(`/api/leads/${leadId}`, {
      method: 'DELETE'
    }),
  getById: async (leadId: string): Promise<Lead> => request<Lead>(`/api/leads/${leadId}`)
};

export const exportApi = {
  csv: async (filters?: Partial<LeadFilters>) => {
    const token = getAuthToken();
    const query = buildQuery(filters);
    const response = await fetch(`${API_URL}/api/leads/export${query}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message ?? 'Export failed');
    }

    return response.text();
  }
};

