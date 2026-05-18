export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const leadSources = ['Website', 'Instagram', 'Referral'] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'sales';
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type Lead = {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadFilters = {
  page: number;
  limit: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: 'latest' | 'oldest';
};

export type PaginatedLeadsResponse = {
  data: Lead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    sort: 'latest' | 'oldest';
    filters: {
      status: LeadStatus | null;
      source: LeadSource | null;
      search: string | null;
    };
  };
};

export type LeadSummary = {
  totalLeads: number;
  recentCount: number;
  statusCounts: Array<{ status: LeadStatus; count: number }>;
  sourceCounts: Array<{ source: LeadSource; count: number }>;
};