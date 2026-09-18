import { Badge } from '@/components/ui/badge';
import type { AppointmentStatus } from '@/types';

const statusMap: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'brand' | 'success' | 'warning' | 'muted' }
> = {
  pending: { label: 'Aguardando', variant: 'warning' },
  confirmed: { label: 'Confirmado', variant: 'brand' },
  in_progress: { label: 'Em atendimento', variant: 'success' },
  completed: { label: 'Finalizado', variant: 'muted' },
  cancelled: { label: 'Cancelado', variant: 'default' },
  no_show: { label: 'Não compareceu', variant: 'default' },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export const appointmentStatusLabel = (status: AppointmentStatus) => statusMap[status].label;
