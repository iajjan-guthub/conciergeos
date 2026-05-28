import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Star, AlertCircle, Home, Sparkles, Key, CheckCircle2, ArrowUpRight, Calendar, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Property, Booking, Task } from "@shared/schema";

type Stats = {
  occupancyRate: number;
  revPAR: number;
  avgRating: number;
  activeIncidents: number;
  todayArrivals: Booking[];
  pendingTasks: Task[];
  totalRevenue: number;
};

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({ queryKey: ["/api/dashboard/stats"] });
  const { data: properties } = useQuery<Property[]>({ queryKey: ["/api/properties"] });

  const propMap = new Map((properties ?? []).map((p) => [p.id, p]));

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-page-title">Vue d'ensemble</h1>
          <p className="text-sm text-muted-foreground mt-1">Mercredi 28 mai 2026 · Bonjour Marie</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="button-export"><Wallet className="size-4 mr-1.5" />Export</Button>
          <Button size="sm" data-testid="button-new-booking"><Calendar className="size-4 mr-1.5" />Nouvelle résa</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard
              label="Taux d'occupation"
              value={`${stats?.occupancyRate ?? 0}%`}
              delta="+8.2% vs mois dernier"
              trend="up"
              icon={<Home className="size-4" />}
            />
            <KpiCard
              label="RevPAR"
              value={`${stats?.revPAR ?? 0}€`}
              delta="+12,40€ vs mois dernier"
              trend="up"
              icon={<TrendingUp className="size-4" />}
            />
            <KpiCard
              label="Note moyenne"
              value={`${stats?.avgRating ?? 0}`}
              delta="83 avis ce mois"
              trend="neutral"
              icon={<Star className="size-4 fill-current" />}
            />
            <KpiCard
              label="Incidents actifs"
              value={`${stats?.activeIncidents ?? 0}`}
              delta="1 urgent"
              trend="down"
              icon={<AlertCircle className="size-4" />}
              accent={stats?.activeIncidents ? "text-destructive" : ""}
            />
          </>
        )}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        {/* Arrivées */}
        <div className="lg:col-span-2 rounded-xl border border-card-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
            <div>
              <h2 className="font-semibold">Arrivées aujourd'hui</h2>
              <p className="text-xs text-muted-foreground">2 voyageurs attendus</p>
            </div>
            <Link href="/bookings"><Button variant="ghost" size="sm" data-testid="link-all-bookings">Voir tout <ArrowUpRight className="size-3.5 ml-1" /></Button></Link>
          </div>
          <div className="divide-y divide-card-border">
            {(stats?.todayArrivals ?? []).map((b) => {
              const p = propMap.get(b.propertyId);
              return (
                <div key={b.id} className="px-5 py-4 flex items-center gap-4 hover-elevate" data-testid={`row-arrival-${b.id}`}>
                  <div className="size-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm">
                    {b.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{b.guestName}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {p?.name ?? "—"} · {p?.city} · {b.guests} voyageurs
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                      <Sparkles className="size-3.5" /> Ménage OK
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                      <Key className="size-3.5" /> Code {b.accessCode}
                    </div>
                  </div>
                  <StatusBadge status={b.channel} />
                </div>
              );
            })}
            {(!stats?.todayArrivals || stats.todayArrivals.length === 0) && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Aucune arrivée aujourd'hui</div>
            )}
          </div>
        </div>

        {/* Tâches en attente */}
        <div className="rounded-xl border border-card-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
            <div>
              <h2 className="font-semibold">Tâches en attente</h2>
              <p className="text-xs text-muted-foreground">{stats?.pendingTasks?.length ?? 0} mission(s)</p>
            </div>
            <Link href="/tasks"><Button variant="ghost" size="sm" data-testid="link-all-tasks">Voir tout</Button></Link>
          </div>
          <div className="divide-y divide-card-border max-h-[380px] overflow-y-auto">
            {(stats?.pendingTasks ?? []).map((t) => {
              const p = propMap.get(t.propertyId);
              return (
                <div key={t.id} className="px-5 py-3 flex items-start gap-3 hover-elevate" data-testid={`row-task-${t.id}`}>
                  <div className={`size-2 rounded-full mt-1.5 ${taskColor(t.type)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize">{taskLabel(t.type)}</div>
                    <div className="text-xs text-muted-foreground truncate">{p?.name} · {t.assigneeName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.scheduledAt}</div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Incident alert */}
      <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/5 p-5 flex items-start gap-4">
        <div className="size-10 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center flex-shrink-0">
          <AlertCircle className="size-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Incident urgent</h3>
            <StatusBadge status="urgent" />
          </div>
          <p className="text-sm mt-1">Fuite d'eau salle de bain — Villa Les Pins, signalée par Olivia Martin il y a 12 minutes.</p>
          <p className="text-xs text-muted-foreground mt-1">Plombier non encore assigné · Coût estimé non renseigné</p>
        </div>
        <div className="flex gap-2">
          <Link href="/incidents"><Button size="sm" variant="outline" data-testid="button-view-incident">Voir</Button></Link>
          <Button size="sm" variant="destructive" data-testid="button-assign-incident">Assigner</Button>
        </div>
      </div>

      {/* Properties summary */}
      <div className="mt-6 rounded-xl border border-card-border bg-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
          <h2 className="font-semibold">Performance des biens</h2>
          <Link href="/properties"><Button variant="ghost" size="sm" data-testid="link-all-properties">Tous les biens <ArrowUpRight className="size-3.5 ml-1" /></Button></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-card-border">
          {(properties ?? []).map((p) => (
            <div key={p.id} className="bg-card p-5" data-testid={`card-property-summary-${p.id}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.city} · {p.type}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Occupation</div>
                  <div className="text-lg font-semibold">{Math.round(p.occupancyRate * 100)}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenus</div>
                  <div className="text-lg font-semibold">{p.monthlyRevenue.toLocaleString("fr-FR")}€</div>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${p.occupancyRate * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function KpiCard({ label, value, delta, trend, icon, accent }: { label: string; value: string; delta: string; trend: "up" | "down" | "neutral"; icon: React.ReactNode; accent?: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className={accent ?? "text-muted-foreground"}>{icon}</span>
      </div>
      <div className={`text-2xl font-semibold tracking-tight mt-2 ${accent ?? ""}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        {trend === "up" ? <TrendingUp className="size-3 text-emerald-500" /> : trend === "down" ? <TrendingDown className="size-3 text-red-500" /> : null}
        {delta}
      </div>
    </div>
  );
}

function taskColor(type: string) {
  switch (type) {
    case "menage": return "bg-emerald-500";
    case "check-in": return "bg-blue-500";
    case "maintenance": return "bg-amber-500";
    case "depart": return "bg-red-500";
    default: return "bg-muted-foreground";
  }
}
function taskLabel(type: string) {
  switch (type) {
    case "menage": return "Ménage";
    case "check-in": return "Check-in";
    case "maintenance": return "Maintenance";
    case "depart": return "Départ";
    default: return type;
  }
}
