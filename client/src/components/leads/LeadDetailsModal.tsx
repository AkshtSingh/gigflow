import { Modal } from '../ui/Modal';
import type { Lead } from '../../types/api';

type LeadDetailsModalProps = {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
};

export const LeadDetailsModal = ({ lead, open, onClose }: LeadDetailsModalProps) => {
  if (!lead) {
    return null;
  }

  return (
    <Modal open={open} title="Lead Details" onClose={onClose}>
      <div className="grid gap-4 text-sm">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Name</div>
          <div className="mt-1 text-base font-semibold text-primary">{lead.name}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Email</div>
          <div className="mt-1 text-base text-primary">{lead.email}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Status</div>
            <div className="mt-1 inline-flex rounded-md bg-secondary-fixed px-3 py-1 text-sm font-semibold text-on-secondary-fixed">{lead.status}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Source</div>
            <div className="mt-1 inline-flex rounded-md bg-surface-container-high px-3 py-1 text-sm font-semibold text-primary">{lead.source}</div>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Created</div>
          <div className="mt-1 text-base text-primary">{new Date(lead.createdAt).toLocaleString()}</div>
        </div>
      </div>
    </Modal>
  );
};