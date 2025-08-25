// utils/format.ts
export const formatMoney = (v?: number, currency = 'KES') => {
  if (typeof v !== 'number') return '-';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);
};

export const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
};
