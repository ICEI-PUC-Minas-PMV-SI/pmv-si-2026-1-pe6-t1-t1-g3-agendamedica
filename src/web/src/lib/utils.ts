// Tiny helpers shared across components

export function classNames(...xs: (string | undefined | null | false)[]): string {
  return xs.filter(Boolean).join(' ')
}

// Portuguese month abbreviations
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

export function fmtDate(iso: string): { mo: string; d: string; dow: string; hm: string } {
  const d = new Date(iso)
  return {
    mo: MESES[d.getMonth()],
    d: String(d.getDate()).padStart(2, '0'),
    dow: DIAS[d.getDay()],
    hm: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  }
}

export function relTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)} min`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  RESCHEDULED: 'Remarcada',
}

export const STATUS_CLASS: Record<string, string> = {
  PENDING: 'chip-pending',
  CONFIRMED: 'chip-confirmed',
  CANCELLED: 'chip-cancelled',
  RESCHEDULED: 'chip-rescheduled',
}
