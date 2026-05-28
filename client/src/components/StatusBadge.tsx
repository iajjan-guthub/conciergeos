import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  completed: "bg-muted text-muted-foreground border-border",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  in_progress: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  late: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  open: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  urgent: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/40",
  important: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  normal: "bg-muted text-muted-foreground border-border",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  airbnb: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  booking: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  direct: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
  email: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  sms: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
};

const labels: Record<string, string> = {
  active: "En cours",
  confirmed: "Confirmée",
  completed: "Terminée",
  pending: "À faire",
  in_progress: "En cours",
  cancelled: "Annulée",
  late: "En retard",
  open: "Ouvert",
  resolved: "Résolu",
  urgent: "Urgent",
  important: "Important",
  normal: "Normal",
  paid: "Payée",
  airbnb: "Airbnb",
  booking: "Booking",
  direct: "Direct",
  email: "Email",
  sms: "SMS",
};

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        styles[status] ?? styles.normal,
        className
      )}
      data-testid={`badge-status-${status}`}
    >
      {label ?? labels[status] ?? status}
    </span>
  );
}
