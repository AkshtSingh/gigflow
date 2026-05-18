import { useEffect, useMemo, useState } from 'react';

import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { LeadDetailsModal } from '../components/leads/LeadDetailsModal';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { LeadsTable } from '../components/leads/LeadsTable';
import { leadsApi, exportApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import type { Lead, LeadFilters as LeadFiltersType, LeadSource, LeadStatus, LeadSummary } from '../types/api';

const defaultFilters: LeadFiltersType = {
  page: 1,
  limit: 10,
  sort: 'latest'
};

const formatStatusChange = (count: number, label: string) => `${count} ${label}`;

export const DashboardPage = () => {
  const [filters, setFilters] = useState<LeadFiltersType>(defaultFilters);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<LeadSummary | null>(null);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, hasNextPage: false, hasPreviousPage: false });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);

  const loadData = async () => {
    setBusy(true);
    setError('');

    try {
      const [leadPage, leadSummary] = await Promise.all([leadsApi.list(filters), leadsApi.summary()]);
      setLeads(leadPage.data);
      setMeta(leadPage.meta);
      setSummary(leadSummary);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setBusy(false);
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    void loadData();
  }, [filters.page, filters.limit, filters.status, filters.source, filters.search, filters.sort]);

  const statusMap = useMemo<Record<LeadStatus, number>>(() => {
    const counts: Record<LeadStatus, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0
    };

    summary?.statusCounts.forEach(({ status, count }) => {
      counts[status] = count;
    });

    return counts;
  }, [summary]);

  const sourceMap = useMemo<Record<LeadSource, number>>(() => {
    const counts: Record<LeadSource, number> = {
      Website: 0,
      Instagram: 0,
      Referral: 0
    };

    summary?.sourceCounts.forEach(({ source, count }) => {
      counts[source] = count;
    });

    return counts;
  }, [summary]);

  const resetFilters = () => setFilters(defaultFilters);

  const saveLead = async (payload: { name: string; email: string; status: LeadStatus; source: LeadSource }) => {
    if (editLead) {
      await leadsApi.update(editLead._id, payload);
      setEditLead(null);
    } else {
      await leadsApi.create(payload);
      setCreateOpen(false);
    }

    await loadData();
  };

  const deleteLead = async (lead: Lead) => {
    const confirmDelete = window.confirm(`Delete ${lead.name}?`);
    if (!confirmDelete) {
      return;
    }

    await leadsApi.remove(lead._id);
    await loadData();
  };

  return (
    <AppShell>
      <div className="grid gap-6">
        <section className="grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
          <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-6 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">Overview</div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary">Reporting and lead operations in one place</h2>
                <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                  Search, filter, sort, and manage leads using a backend-driven table with authenticated access and pagination.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {user?.role === 'admin' ? (
                  <Button variant="ghost" onClick={async () => {
                    try {
                      const csv = await exportApi.csv(filters);
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'leads_export_all.csv';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Export failed');
                    }
                  }}>
                    Export All (CSV)
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={async () => {
                    try {
                      const csv = await exportApi.csv(filters);
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'leads_export_my.csv';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Export failed');
                    }
                  }}>
                    Export My Leads
                  </Button>
                )}


                <Button onClick={() => setCreateOpen(true)}>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  New Lead
                </Button>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-6 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">Total</div>
            <div className="mt-2 text-4xl font-bold tracking-tight text-primary">{summary?.totalLeads ?? 0}</div>
            <div className="mt-3 text-sm text-on-surface-variant">{formatStatusChange(summary?.recentCount ?? 0, 'created in the last 7 days')}</div>
          </div>
        </section>

        {error ? <div className="rounded-md border border-error bg-error-container px-4 py-3 text-sm text-error">{error}</div> : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Leads" value={String(summary?.totalLeads ?? 0)} change={formatStatusChange(statusMap.New, 'new')} icon="group" tone="neutral" />
          <StatCard label="Qualified" value={String(statusMap.Qualified)} change={formatStatusChange(statusMap.Contacted, 'contacted')} icon="swap_horiz" tone="positive" />
          <StatCard label="Website" value={String(sourceMap.Website)} change={formatStatusChange(sourceMap.Instagram, 'from Instagram')} icon="language" tone="neutral" />
          <StatCard label="Referral" value={String(sourceMap.Referral)} change={formatStatusChange(summary?.recentCount ?? 0, 'recent leads')} icon="call_made" tone="positive" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="grid gap-6">
            <LeadFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
            <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-4 shadow-soft">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">Leads</div>
                  <h3 className="text-xl font-bold text-primary">Filtered list</h3>
                </div>
                <div className="text-sm text-on-surface-variant">
                  Page {meta.page} of {meta.totalPages}
                </div>
              </div>
              <LeadsTable leads={leads} loading={busy || loading} onView={setDetailsLead} onEdit={setEditLead} onDelete={deleteLead} />
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="text-sm text-on-surface-variant">
                  Showing {leads.length} of {meta.total} records
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setFilters((current) => ({ ...current, page: Math.max(1, current.page - 1) }))} disabled={!meta.hasPreviousPage}>
                    Previous
                  </Button>
                  <Button variant="ghost" onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))} disabled={!meta.hasNextPage}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <aside className="grid gap-6">
            <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Lead source mix</h3>
                <span className="material-symbols-outlined text-outline">donut_large</span>
              </div>
              <div className="mt-5 flex items-center justify-center">
                <div className="relative h-52 w-52 rounded-full" style={{ background: 'conic-gradient(#1e293b 0% 45%, #6063ee 45% 75%, #a38c6a 75% 100%)' }}>
                  <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-surface-container-lowest">
                    <div className="text-2xl font-bold text-primary">{summary?.totalLeads ?? 0}</div>
                    <div className="text-xs text-on-surface-variant">Total leads</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                {summary?.sourceCounts.map((entry) => (
                  <div key={entry.source} className="flex items-center justify-between">
                    <span className="text-on-surface-variant">{entry.source}</span>
                    <span className="font-semibold text-primary">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-5 shadow-soft">
              <h3 className="text-lg font-semibold text-primary">Status snapshot</h3>
              <div className="mt-4 space-y-3">
                {summary?.statusCounts.map((entry) => (
                  <div key={entry.status} className="flex items-center justify-between rounded-md bg-surface-container-low px-4 py-3">
                    <span className="text-sm text-on-surface-variant">{entry.status}</span>
                    <span className="text-sm font-semibold text-primary">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      <LeadFormModal open={createOpen} onClose={() => setCreateOpen(false)} onSave={saveLead} />
      <LeadFormModal open={Boolean(editLead)} lead={editLead} onClose={() => setEditLead(null)} onSave={saveLead} />
      <LeadDetailsModal open={Boolean(detailsLead)} lead={detailsLead} onClose={() => setDetailsLead(null)} />
    </AppShell>
  );
};
