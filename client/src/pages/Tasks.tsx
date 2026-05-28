import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Sparkles, Key, Wrench, LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Property, Task } from "@shared/schema";

export default function Tasks() {
  const { data: tasks = [], isLoading } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const propMap = new Map(properties.map((p) => [p.id, p]));
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = tasks.filter((t) => {
    const matchesQ = (t.notes ?? "").toLowerCase().includes(q.toLowerCase()) || (t.assigneeName ?? "").toLowerCase().includes(q.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const { toast } = useToast();
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/tasks/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Mission mise à jour" });
    },
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Missions</h1>
          <p className="text-sm text-muted-foreground mt-1">{tasks.length} missions · {tasks.filter((t) => t.status === "pending").length} à faire</p>
        </div>
        <AddTaskDialog properties={properties} />
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-card-border">
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-muted rounded-md px-3 py-1.5">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="bg-transparent outline-none flex-1 text-sm" data-testid="input-search-tasks" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm" data-testid="select-status-tasks">
            <option value="all">Tous statuts</option>
            <option value="pending">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="late">En retard</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Bien</th>
                <th className="px-5 py-3 font-semibold">Prestataire</th>
                <th className="px-5 py-3 font-semibold">Date / heure</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold">Notes</th>
                <th className="px-5 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading && <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Chargement…</td></tr>}
              {filtered.map((t) => {
                const p = propMap.get(t.propertyId);
                return (
                  <tr key={t.id} className="hover-elevate" data-testid={`row-task-${t.id}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {taskIcon(t.type)}
                        <span className="font-medium">{taskLabel(t.type)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p?.name}</td>
                    <td className="px-5 py-3">{t.assigneeName ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">{t.scheduledAt}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3 text-muted-foreground max-w-[280px] truncate">{t.notes}</td>
                    <td className="px-5 py-3 text-right">
                      {t.status !== "completed" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: t.id, status: "completed" })} data-testid={`button-complete-${t.id}`}>Valider</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">Aucune mission trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function AddTaskDialog({ properties }: { properties: Property[] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ propertyId: properties[0]?.id ?? 1, type: "menage", scheduledAt: "", assigneeName: "", notes: "" });
  const { toast } = useToast();
  const create = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/tasks", { ...form, status: "pending" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Mission créée" });
      setOpen(false);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="button-new-task"><Plus className="size-4 mr-1.5" />Nouvelle mission</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvelle mission</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Type</Label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="menage">Ménage</option><option value="check-in">Check-in</option><option value="maintenance">Maintenance</option><option value="depart">Départ</option>
            </select>
          </div>
          <div className="space-y-2"><Label>Bien</Label>
            <select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: Number(e.target.value) })} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
              {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Date & heure</Label><Input value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} placeholder="2026-05-29 10:00" /></div>
          <div className="space-y-2"><Label>Prestataire</Label><Input value={form.assigneeName} onChange={(e) => setForm({ ...form, assigneeName: e.target.value })} placeholder="Carmen Lopez" /></div>
          <div className="space-y-2"><Label>Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button onClick={() => create.mutate()} disabled={create.isPending} data-testid="button-create-task">{create.isPending ? "Création…" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function taskIcon(type: string) {
  switch (type) {
    case "menage": return <Sparkles className="size-4 text-emerald-500" />;
    case "check-in": return <Key className="size-4 text-blue-500" />;
    case "maintenance": return <Wrench className="size-4 text-amber-500" />;
    case "depart": return <LogOut className="size-4 text-red-500" />;
    default: return null;
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
