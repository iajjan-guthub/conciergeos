import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Line, LineChart } from "recharts";
import { TrendingUp, Wallet, Home, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

type Analytics = {
  monthly: { month: string; revenue: number; occupancy: number; bookings: number }[];
  kpis: { totalRevenue: number; avgOccupancy: number; revPAR: number; adr: number };
  propertyPerformance: { id: number; name: string; city: string; revenue: number; occupancy: number }[];
};

export default function Analytics() {
  const { data, isLoading } = useQuery<Analytics>({ queryKey: ["/api/analytics"] });

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Pilotage de la performance · 7 derniers mois</p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-export-analytics">Exporter le rapport</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={<Wallet className="size-4" />} label="CA global (7 mois)" value={`${(data?.kpis.totalRevenue ?? 0).toLocaleString("fr-FR")}€`} delta="+22.4% vs précédent" />
        <KpiCard icon={<Home className="size-4" />} label="Occupation moyenne" value={`${data?.kpis.avgOccupancy ?? 0}%`} delta="+6.2 pts" />
        <KpiCard icon={<TrendingUp className="size-4" />} label="RevPAR" value={`${data?.kpis.revPAR ?? 0}€`} delta="+11.8%" />
        <KpiCard icon={<Users className="size-4" />} label="ADR" value={`${data?.kpis.adr ?? 0}€`} delta="+4.5%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-xl border border-card-border bg-card p-5">
          <h3 className="font-semibold mb-1">Revenus mensuels</h3>
          <p className="text-xs text-muted-foreground mb-4">Chiffre d'affaires brut · Évolution mensuelle</p>
          <div className="h-[280px]">
            {isLoading ? (
              <div className="h-full bg-muted/40 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthly ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card-border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--card-border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => [`${v.toLocaleString("fr-FR")}€`, "Revenus"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-5">
          <h3 className="font-semibold mb-1">Taux d'occupation</h3>
          <p className="text-xs text-muted-foreground mb-4">Évolution mensuelle (%)</p>
          <div className="h-[280px]">
            {!isLoading && data && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card-border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--card-border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => [`${v}%`, "Occupation"]}
                  />
                  <Line dataKey="occupancy" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border">
          <h3 className="font-semibold">Performance par bien</h3>
          <p className="text-xs text-muted-foreground">Comparatif sur la période</p>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
            <tr>
              <th className="px-5 py-3">Bien</th>
              <th className="px-5 py-3">Ville</th>
              <th className="px-5 py-3 text-right">Revenus</th>
              <th className="px-5 py-3">Occupation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {(data?.propertyPerformance ?? []).map((p) => (
              <tr key={p.id} data-testid={`row-perf-${p.id}`}>
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.city}</td>
                <td className="px-5 py-3 text-right tabular-nums font-medium">{p.revenue.toLocaleString("fr-FR")}€</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${p.occupancy}%` }} />
                    </div>
                    <span className="text-xs tabular-nums">{p.occupancy}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

function KpiCard({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span>{icon}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight mt-2">{value}</div>
      <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><TrendingUp className="size-3" />{delta}</div>
    </div>
  );
}
