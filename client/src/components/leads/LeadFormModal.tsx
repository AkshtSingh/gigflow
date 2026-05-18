import { useEffect, useState } from 'react';

import { Button } from '../ui/Button';
import { FormField, FormSelect } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import type { Lead, LeadSource, LeadStatus } from '../../types/api';

type LeadFormModalProps = {
  open: boolean;
  lead?: Lead | null;
  onClose: () => void;
  onSave: (payload: { name: string; email: string; status: LeadStatus; source: LeadSource }) => Promise<void>;
};

const defaultValues = {
  name: '',
  email: '',
  status: 'New' as LeadStatus,
  source: 'Website' as LeadSource
};

export const LeadFormModal = ({ open, lead, onClose, onSave }: LeadFormModalProps) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setValues({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source
      });
      setErrors({});
      return;
    }

    setValues(defaultValues);
    setErrors({});
  }, [lead, open]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (values.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters';
    }

    if (!values.email.trim() || !values.email.includes('@')) {
      nextErrors.email = 'Enter a valid email address';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(values);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={lead ? 'Edit Lead' : 'Create Lead'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Lead'}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <FormField label="Name" value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} error={errors.name} />
        <FormField label="Email" type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} error={errors.email} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect label="Status" value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as LeadStatus }))}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </FormSelect>
          <FormSelect label="Source" value={values.source} onChange={(event) => setValues((current) => ({ ...current, source: event.target.value as LeadSource }))}>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </FormSelect>
        </div>
      </div>
    </Modal>
  );
};