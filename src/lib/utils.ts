export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount);
};

export const formatCompactCurrency = (amount: number | undefined) => {
  if (amount === undefined || isNaN(amount)) return "Rp 0";
  if (Math.abs(amount) >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)} M`;
  if (Math.abs(amount) >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} jt`;
  if (Math.abs(amount) >= 1000) return `Rp ${(amount / 1000).toFixed(0)}k`;
  return formatCurrency(amount);
};

export const getPercentage = (part: number, total: number) => {
  if (!total || total === 0) return 0;
  return Math.min(Math.round((part / total) * 100), 100);
};

export const getMemberNameSafe = (team: any, id: string, defaultName = "Anggota") => {
  if (id === 'shared' || id === 'all') return "Keluarga";
  if (!team || !team.members) return defaultName;
  const member = team.members.find((m: any) => m.id === id);
  return member ? member.name : defaultName;
};

export const getDaysDiff = (dateString: string) => {
  const targetDate = new Date(dateString);
  const today = new Date("2026-05-04");
  const diffTime = Math.abs(targetDate.getTime() - today.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
