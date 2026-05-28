import { useQuery } from "@tanstack/react-query";
import { Download, TrendingUp, Wallet, CircleDollarSign, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import type { Invoice, Property } from "@shared/schema";

export default function Finances() {
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({ queryKey: ["/api/invoices"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });

  const monthInvoices = invoices.filter((i) => i.period.includes("Mai"));
  const totalRevenue = monthInvoices.reduce((s, i) => s + i.grossRevenue, 0);
  const totalCommission = monthInvoices.reduce((s, i) => s + i.commission, 0);
  const totalNet = monthInvoices.reduce((s, i) => s + i.netAmount, 0);
  const pendingPayouts = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.netAmount, 0);

  function exportCSV() {
    const headers = ["Propriétaire", "Période", "Brut", "Commission", "Net", "Statut"];
    const rows = invoices.map((i) => [i.ownerName, i.period, i.grossRevenue, i.commission, i.netAmount, i.status]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "factures-conciergeos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Finances</h1>
          <p className="text-sm text-muted-foreground mt-1">Suivi des revenus, commissions et reversements</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} data-testid="button-export-csv"><Download className="size-4 mr-1.5" />Export CSV</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={<Wallet className="size-4" />} label="Revenus mai" value={`${totalRevenue.toLocaleString("fr-FR")}€`} delta="+12.3%" />
        <KpiCard icon={<CircleDollarSign className="size-4" />} label="Commissions" value={`${totalCommission.toLocaleString("fr-FR")}€`} delta="15% du brut" />
        <KpiCard icon={<TrendingUp className="size-4" />} label="Net propriétaires" value={`${totalNet.toLocaleString("fr-FR")}€`} delta="Versé / À verser" />
        <KpiCard icon={<Send className="size-4" />} label="En attente" value={`${pendingPayouts.toLocaleString("fr-FR")}€`} delta="2 reversements" accent="text-amber-500" />
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Factures & décomptes</h2>
            <p className="text-xs text-muted-foreground">{invoices.length} factures · {invoices.filter((i) => i.status === "pending").length} en attente</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-semibold">Propriétaire</th>
                <th className="px-5 py-3 font-semibold">Période</th>
                <th className="px-5 py-3 font-semibold text-right">Brut</th>
                <th className="px-5 py-3 font-semibold text-right">Commission</th>
                <th className="px-5 py-3 font-semibold text-right">Net</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading && <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Chargement…</td></tr>}
              {invoices.map((i) => (
                <tr key={i.id} className="hover-elevate" data-testid={`row-invoice-${i.id}`}>
                  <td className="px-5 py-3 font-medium">{i.ownerName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{i.period}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{i.grossRevenue.toLocaleString("fr-FR")}€</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">-{i.commission.toLocaleString("fr-FR")}€</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-primary">{i.netAmount.toLocaleString("fr-FR")}€</td>
                  <td className="px-5 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" data-testid={`button-download-invoice-${i.id}`}><Download className="size-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/40 border-t border-card-border">
              <tr className="font-semibold">
                <td className="px-5 py-3" colSpan={2}>Total mois en cours</td>
                <td className="px-5 py-3 text-right tabular-nums">{totalRevenue.toLocaleString("fr-FR")}€</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">-{totalCommission.toLocaleString("fr-FR")}€</td>
                <td className="px-5 py-3 text-right tabular-nums text-primary">{totalNet.toLocaleString("fr-FR")}€</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-5">
        <h3 className="font-semibold mb-4">Performance par bien · Mai 2026</h3>
        <div className="space-y-3">
          {properties.map((p) => {
            const max = Math.max(...properties.map((x) => x.monthlyRevenue));
            return (
              <div key={p.id} className="grid grid-cols-[1fr_2fr_auto] gap-4 items-center text-sm">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.city}</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(p.monthlyRevenue / max) * 100}%` }} />
                </div>
                <div className="font-medium tabular-nums">{p.monthlyRevenue.toLocaleString("fr-FR")}€</div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function KpiCard({ icon, label, value, delta, accent }: { icon: React.ReactNode; label: string; value: string; delta: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className={accent ?? ""}>{icon}</span>
      </div>
      <div className={`text-2xl font-semibold tracking-tight mt-2 ${accent ?? ""}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{delta}</div>
    </div>
  );
}
