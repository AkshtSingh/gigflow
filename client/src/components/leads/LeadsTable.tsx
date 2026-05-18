import { Button } from '../ui/Button';
import type { Lead } from '../../types/api';

type LeadsTableProps = {
  leads: Lead[];
  loading: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

const statusTone: Record<Lead['status'], string> = {
  New: 'bg-sky-100 text-sky-700',
  Contacted: 'bg-amber-100 text-amber-800',
  Qualified: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-rose-100 text-rose-700'
};

export const LeadsTable = ({ leads, loading, onView, onEdit, onDelete }: LeadsTableProps) => {
  if (loading) {
    return (
      <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant shadow-soft">
        Loading leads...
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="rounded-md border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-surface-container-high text-outline">
          <span className="material-symbols-outlined">group_off</span>
        </div>
        <div className="mt-4 text-lg font-semibold text-primary">No leads found</div>
        <p className="mt-2 text-sm text-on-surface-variant">Try another filter or create a new lead to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant text-left">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Lead</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Status</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Source</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Created</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-surface-container-low/80">
                <td className="px-5 py-4">
                  <div className="cursor-pointer" onClick={() => onView(lead)}>
                    <div className="font-semibold text-primary">{lead.name}</div>
                    <div className="text-sm text-on-surface-variant">{lead.email}</div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${statusTone[lead.status]}`}>{lead.status}</span>
                </td>
                <td className="px-5 py-4 text-sm text-on-surface-variant">{lead.source}</td>
                <td className="px-5 py-4 text-sm text-on-surface-variant">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" type="button" onClick={() => onView(lead)}>
                      View
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => onEdit(lead)}>
                      Edit
                    </Button>
                    <Button variant="danger" type="button" onClick={() => onDelete(lead)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
