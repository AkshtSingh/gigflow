import type { LeadFilters as LeadFiltersType, LeadSource, LeadStatus } from '../../types/api';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { FormField, FormSelect } from '../ui/FormField';

type LeadFiltersProps = {
  filters: LeadFiltersType;
  onChange: (next: LeadFiltersType) => void;
  onReset: () => void;
};

const statuses: Array<{ label: string; value: LeadStatus | '' }> = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Lost', value: 'Lost' }
];

const sources: Array<{ label: string; value: LeadSource | '' }> = [
  { label: 'All Sources', value: '' },
  { label: 'Website', value: 'Website' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Referral', value: 'Referral' }
];

export const LeadFilters = ({ filters, onChange, onReset }: LeadFiltersProps) => {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== (filters.search ?? '')) {
        onChange({ ...filters, search: searchInput || undefined, page: 1 });
      }
    }, 400);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const update = (patch: Partial<LeadFiltersType>) => onChange({ ...filters, ...patch });

  return (
    <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <FormField
            label="Search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or email"
          />
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
          <FormSelect label="Status" value={filters.status ?? ''} onChange={(event) => update({ status: (event.target.value || undefined) as LeadStatus | undefined, page: 1 })}>
            {statuses.map((status) => (
              <option key={status.label} value={status.value}>
                {status.label}
              </option>
            ))}
          </FormSelect>
          <FormSelect label="Source" value={filters.source ?? ''} onChange={(event) => update({ source: (event.target.value || undefined) as LeadSource | undefined, page: 1 })}>
            {sources.map((source) => (
              <option key={source.label} value={source.value}>
                {source.label}
              </option>
            ))}
          </FormSelect>
          <FormSelect label="Sort" value={filters.sort} onChange={(event) => update({ sort: event.target.value as LeadFiltersType['sort'], page: 1 })}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </FormSelect>
        </div>
        <Button variant="secondary" onClick={onReset} type="button">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
