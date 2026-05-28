import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Search, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Incident, Property } from "@shared/schema";

export default function Incidents() {
  const { data: incidents = [], isLoading } = useQuery<Incident[]>({ queryKey: ["/api/incidents"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const propMap = new Map(properties.map((p) => [p.id, p]));
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("all");
  const [selected, setSelected] = useState<Incident | null>(null);

  const filtered = incidents.filter((i) => {
    const matchesQ = i.title.toLowerCase().includes(q.toLowerCase()) || (i.description ?? "").toLowerCase().includes(q.toLowerCase());
    const matchesSev = severity === "all" || i.severity === severity;
    return matchesQ && matchesSev;
  });

  const urgentCount = incidents.filter((i) => i.severity === "urgent" && i.status !== "resolved").length;

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Incidents</h1>
          <p className="text-sm text-muted-foreground mt-1">{incidents.length} signalements · {urgentCount} urgent(s)</p>
        </div>
        <Button size="sm" data-testid="button-new-incident"><AlertTriangle className="size-4 mr-1.5" />Signaler un incident</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <SeverityCard label="Urgent" count={incidents.filter((i) => i.severity === "urgent").length} accent="text-red-500" bg="bg-red-500/10 border-red-500/30" />
        <SeverityCard label="Important" count={incidents.filter((i) => i.severity === "important").length} accent="text-orange-500" bg="bg-orange-500/10 border-orange-500/30" />
        <SeverityCard label="Normal" count={incidents.filter((i) => i.severity === "normal").length} accent="text-muted-foreground" bg="bg-card border-card-border" />
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-card-border">
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-muted rounded-md px-3 py-1.5">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="bg-transparent outline-none flex-1 text-sm" data-testid="input-search-incidents" />
          </div>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm" data-testid="select-severity">
            <option value="all">Toutes sévérités</option>
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
              <tr>
                <th className="px-5 py-3">Sévérité</th>
                <th className="px-5 py-3">Titre</th>
                <th className="px-5 py-3">Bien</th>
                <th className="px-5 py-3">Signalé par</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Coût</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading && <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Chargement…</td></tr>}
              {filtered.map((i) => {
                const p = propMap.get(i.propertyId);
                return (
                  <tr key={i.id} className="hover-elevate cursor-pointer" onClick={() => setSelected(i)} data-testid={`row-incident-${i.id}`}>
                    <td className="px-5 py-3"><StatusBadge status={i.severity} /></td>
                    <td className="px-5 py-3 font-medium">{i.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p?.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{i.reportedBy ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">{i.createdAt}</td>
                    <td className="px-5 py-3"><StatusBadge status={i.status} /></td>
                    <td className="px-5 py-3 text-right tabular-nums">{i.cost ? `${i.cost}€` : "—"}</td>
                  </tr>
                );
              })}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">Aucun incident</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="size-5 text-destructive" /> {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2"><StatusBadge status={selected.severity} /><StatusBadge status={selected.status} /></div>
                <div className="text-muted-foreground">{selected.description}</div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-card-border">
                  <div><div className="text-xs text-muted-foreground">Bien</div><div className="font-medium">{propMap.get(selected.propertyId)?.name}</div></div>
                  <div><div className="text-xs text-muted-foreground">Signalé par</div><div className="font-medium">{selected.reportedBy}</div></div>
                  <div><div className="text-xs text-muted-foreground">Date</div><div className="font-medium">{selected.createdAt}</div></div>
                  <div><div className="text-xs text-muted-foreground">Coût estimé</div><div className="font-medium">{selected.cost ? `${selected.cost}€` : "Non renseigné"}</div></div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Assigner</Button>
                <Button>Marquer résolu</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function SeverityCard({ label, count, accent, bg }: { label: string; count: number; accent: string; bg: string }) {
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${accent}`}>{count}</div>
    </div>
  );
}
