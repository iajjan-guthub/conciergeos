import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ChevronLeft, ChevronRight, Sparkles, Key, Wrench, LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import type { Property, Task } from "@shared/schema";

export default function Planning() {
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  function tasksForCell(propertyId: number, day: Date) {
    const s = day.toISOString().slice(0, 10);
    return tasks.filter((t) => t.propertyId === propertyId && t.scheduledAt.startsWith(s));
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Planning opérationnel</h1>
          <p className="text-sm text-muted-foreground mt-1">Vue semaine · Toutes les missions par bien</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset - 1)} data-testid="button-prev-week"><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)} data-testid="button-today">Cette semaine</Button>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset + 1)} data-testid="button-next-week"><ChevronRight className="size-4" /></Button>
          <Button size="sm" data-testid="button-add-mission"><Plus className="size-4 mr-1.5" />Mission</Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <LegendItem color="bg-emerald-500" icon={<Sparkles className="size-3" />} label="Ménage" />
        <LegendItem color="bg-blue-500" icon={<Key className="size-3" />} label="Check-in" />
        <LegendItem color="bg-amber-500" icon={<Wrench className="size-3" />} label="Maintenance" />
        <LegendItem color="bg-red-500" icon={<LogOut className="size-3" />} label="Départ" />
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="border-b border-card-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-semibold w-48">Bien</th>
              {days.map((d, i) => {
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <th key={i} className={`px-3 py-3 text-center font-semibold text-xs ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    <div className="uppercase tracking-wider">{dayNames[i]}</div>
                    <div className={`mt-0.5 text-base ${isToday ? "text-primary" : "text-foreground"}`}>{d.getDate()}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.city}</div>
                </td>
                {days.map((d, i) => {
                  const cellTasks = tasksForCell(p.id, d);
                  return (
                    <td key={i} className="px-2 py-2 align-top border-l border-card-border">
                      <div className="space-y-1 min-h-[60px]">
                        {cellTasks.map((t) => (
                          <div
                            key={t.id}
                            className={`rounded-md px-2 py-1.5 text-xs flex items-center gap-1.5 ${taskBg(t.type)}`}
                            data-testid={`cell-task-${t.id}`}
                          >
                            {taskIcon(t.type)}
                            <span className="truncate flex-1">{t.assigneeName?.split(" ")[0]}</span>
                            <span className="opacity-70 text-[10px]">{t.scheduledAt.slice(11, 16)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

function LegendItem({ color, icon, label }: { color: string; icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-card-border bg-card">
      <span className={`size-2 rounded-full ${color}`} />
      {icon}
      <span>{label}</span>
    </div>
  );
}

function taskBg(type: string) {
  switch (type) {
    case "menage": return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30";
    case "check-in": return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30";
    case "maintenance": return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30";
    case "depart": return "bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30";
    default: return "bg-muted text-muted-foreground";
  }
}
function taskIcon(type: string) {
  switch (type) {
    case "menage": return <Sparkles className="size-3 flex-shrink-0" />;
    case "check-in": return <Key className="size-3 flex-shrink-0" />;
    case "maintenance": return <Wrench className="size-3 flex-shrink-0" />;
    case "depart": return <LogOut className="size-3 flex-shrink-0" />;
    default: return null;
  }
}
