type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  icon: string;
  tone?: 'positive' | 'negative' | 'neutral';
};

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  positive: 'text-emerald-700',
  negative: 'text-red-700',
  neutral: 'text-on-surface-variant'
};

export const StatCard = ({ label, value, change, icon, tone = 'neutral' }: StatCardProps) => (
  <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-5 shadow-soft">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{label}</span>
      <span className="material-symbols-outlined text-[20px] text-outline">{icon}</span>
    </div>
    <div className="mt-3 text-3xl font-bold tracking-tight text-primary">{value}</div>
    {change ? <div className={`mt-2 flex items-center gap-1 text-sm font-medium ${toneClasses[tone]}`}>{change}</div> : null}
  </div>
);
