import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Calendar, Download, MessageSquare, AlertCircle, Wifi, Car, Tv, Coffee, Key, MapPin, Phone, CheckCircle2, Camera, ArrowRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Property, Booking, Task, Incident } from "@shared/schema";

// ============= OWNER PORTAL =============
export function OwnerPortal() {
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const { data: bookings = [] } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });
  const { data: incidents = [] } = useQuery<Incident[]>({ queryKey: ["/api/incidents"] });

  // Filter to first owner's data
  const ownerProperties = properties.filter((p) => p.ownerId === 1);
  const ownerPropertyIds = new Set(ownerProperties.map((p) => p.id));
  const ownerBookings = bookings.filter((b) => ownerPropertyIds.has(b.propertyId));
  const ownerIncidents = incidents.filter((i) => ownerPropertyIds.has(i.propertyId));

  const totalRevenue = ownerProperties.reduce((s, p) => s + p.monthlyRevenue, 0);
  const upcomingBookings = ownerBookings.filter((b) => b.status === "confirmed" || b.status === "active");

  return (
    <AppShell>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-card-border bg-card text-xs text-muted-foreground">
          Portail propriétaire · Jean Dupont
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Bonjour Jean, voici votre actualité</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue propriétaire simplifiée · Vos biens, revenus et réservations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Vos biens" value={`${ownerProperties.length}`} />
        <Kpi label="Revenus mois" value={`${totalRevenue.toLocaleString("fr-FR")}€`} />
        <Kpi label="Réservations à venir" value={`${upcomingBookings.length}`} />
        <Kpi label="Note moyenne" value="4.9 ★" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-card-border bg-card">
          <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
            <h2 className="font-semibold">Réservations à venir</h2>
            <Button variant="ghost" size="sm" data-testid="button-block-dates"><Calendar className="size-4 mr-1.5" />Bloquer des dates</Button>
          </div>
          <div className="divide-y divide-card-border">
            {upcomingBookings.map((b) => {
              const p = ownerProperties.find((x) => x.id === b.propertyId);
              return (
                <div key={b.id} className="px-5 py-3 flex items-center gap-3" data-testid={`row-owner-booking-${b.id}`}>
                  <div className="size-9 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                    {b.guestName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{b.guestName}</div>
                    <div className="text-xs text-muted-foreground">{p?.name} · {b.checkIn} → {b.checkOut} · {b.guests} pers</div>
                  </div>
                  <div className="text-sm font-medium tabular-nums">{b.totalPrice.toLocaleString("fr-FR")}€</div>
                  <StatusBadge status={b.status} />
                </div>
              );
            })}
            {upcomingBookings.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Aucune réservation à venir</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-card-border bg-card">
          <div className="px-5 py-4 border-b border-card-border">
            <h2 className="font-semibold">Documents</h2>
            <p className="text-xs text-muted-foreground">Factures et décomptes</p>
          </div>
          <div className="p-2">
            {["Décompte Mai 2026.pdf", "Décompte Avril 2026.pdf", "Mandat de gestion.pdf"].map((doc) => (
              <button key={doc} className="w-full text-left px-3 py-2 rounded-md hover-elevate flex items-center gap-3" data-testid={`button-document-${doc.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Download className="size-4" /></div>
                <span className="text-sm flex-1">{doc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-card-border bg-card">
        <div className="px-5 py-4 border-b border-card-border">
          <h2 className="font-semibold">Vos biens</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-card-border">
          {ownerProperties.map((p) => (
            <div key={p.id} className="bg-card p-5" data-testid={`card-owner-property-${p.id}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.city}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Occupation</div><div className="font-semibold mt-0.5">{Math.round(p.occupancyRate * 100)}%</div></div>
                <div><div className="text-xs text-muted-foreground">Revenus</div><div className="font-semibold mt-0.5">{p.monthlyRevenue.toLocaleString("fr-FR")}€</div></div>
                <div><div className="text-xs text-muted-foreground">Note</div><div className="font-semibold mt-0.5">4.8 ★</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {ownerIncidents.length > 0 && (
        <div className="mt-6 rounded-xl border border-card-border bg-card">
          <div className="px-5 py-4 border-b border-card-border">
            <h2 className="font-semibold">Tickets & incidents</h2>
          </div>
          <div className="divide-y divide-card-border">
            {ownerIncidents.map((i) => (
              <div key={i.id} className="px-5 py-3 flex items-center gap-3">
                <AlertCircle className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{i.title}</div>
                  <div className="text-xs text-muted-foreground">{i.createdAt}</div>
                </div>
                <StatusBadge status={i.severity} />
                <StatusBadge status={i.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

// ============= GUEST PORTAL (mobile-first) =============
export function GuestPortal() {
  const [, params] = useRoute("/guest/:token");
  const { data: bookings = [] } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const booking = bookings[0]; // Demo: show first active booking
  const property = booking ? properties.find((p) => p.id === booking.propertyId) : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-card-border bg-card">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Logo />
          <Link href="/"><a className="text-xs text-muted-foreground" data-testid="link-back-home">Retour</a></Link>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4 pb-20">
        {booking && property && (
          <>
            <div className="rounded-xl border border-card-border bg-card p-5">
              <div className="text-xs text-muted-foreground">Bienvenue à</div>
              <div className="text-xl font-semibold mt-1">{property.name}</div>
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="size-3.5" /> {property.address}, {property.city}</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Arrivée</div>
                  <div className="font-semibold mt-0.5">{booking.checkIn}</div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Départ</div>
                  <div className="font-semibold mt-0.5">{booking.checkOut}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/40 bg-primary/5 p-6 text-center">
              <Key className="size-6 text-primary mx-auto" />
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Code d'accès</div>
              <div className="text-5xl font-mono font-semibold tracking-widest mt-1 text-primary">{booking.accessCode}</div>
              <div className="text-xs text-muted-foreground mt-2">Boîte à clés près de la porte principale</div>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-5">
              <h3 className="font-semibold mb-3">Guide d'arrivée</h3>
              <ol className="space-y-2.5 text-sm">
                {[
                  "Accès parking par le portillon de gauche, place n°3",
                  "Boîte à clés près de la porte d'entrée, code ci-dessus",
                  "WiFi : ConciergeOS-Guest / Mot de passe : welcome2026",
                  "Climatisation : télécommande sur la table basse",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-5">
              <h3 className="font-semibold mb-3">Équipements</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Wifi className="size-4" />, label: "WiFi" },
                  { icon: <Car className="size-4" />, label: "Parking" },
                  { icon: <Tv className="size-4" />, label: "Smart TV" },
                  { icon: <Coffee className="size-4" />, label: "Cuisine équipée" },
                ].map((e) => (
                  <div key={e.label} className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm">
                    {e.icon}
                    <span>{e.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-5">
              <h3 className="font-semibold mb-3">Services additionnels</h3>
              <div className="space-y-2">
                {[
                  { label: "Petit déjeuner livré", price: "15€/jour" },
                  { label: "Ménage supplémentaire", price: "60€" },
                  { label: "Transfert aéroport", price: "70€" },
                ].map((s) => (
                  <button key={s.label} className="w-full p-3 rounded-md bg-muted hover-elevate flex items-center justify-between text-sm" data-testid={`button-service-${s.label}`}>
                    <span className="font-medium">{s.label}</span>
                    <span className="flex items-center gap-2 text-primary font-medium">{s.price} <ArrowRight className="size-3.5" /></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-12" data-testid="button-guest-chat"><MessageSquare className="size-4 mr-1.5" />Discuter</Button>
              <Button variant="outline" className="h-12 border-destructive/50 text-destructive hover:bg-destructive/10" data-testid="button-guest-incident"><AlertCircle className="size-4 mr-1.5" />Signaler</Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ============= PROVIDER PWA (mobile-first) =============
export function ProviderApp() {
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const propMap = new Map(properties.map((p) => [p.id, p]));

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.scheduledAt.startsWith(today) || t.status === "pending" || t.status === "in_progress");

  const [activeId, setActiveId] = useState<number | null>(null);
  const active = todayTasks.find((t) => t.id === activeId);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const checklist = [
    "Aérer toutes les pièces",
    "Changer les draps et serviettes",
    "Nettoyer salle de bain",
    "Nettoyer cuisine et frigo",
    "Aspirer et serpiller les sols",
    "Vérifier équipements (TV, WiFi)",
    "Remplir kit accueil (savon, papier...)",
    "Sortir les poubelles",
  ];

  const completedCount = Object.values(checks).filter(Boolean).length;
  const progress = (completedCount / checklist.length) * 100;

  const { toast } = useToast();
  const validate = useMutation({
    mutationFn: async () => {
      if (!active) return;
      await apiRequest("PATCH", `/api/tasks/${active.id}`, { status: "completed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Mission validée", description: "Merci pour votre travail !" });
      setActiveId(null);
      setChecks({});
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-card-border bg-card/90 backdrop-blur">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          {active ? (
            <button onClick={() => setActiveId(null)} className="text-sm text-muted-foreground flex items-center gap-1" data-testid="button-back-tasks">
              <ChevronLeft className="size-4" /> Mes missions
            </button>
          ) : (
            <Logo />
          )}
          <div className="flex items-center gap-2 text-xs">
            <div className="size-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Carmen L.</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-20">
        {!active ? (
          <>
            <div className="mb-4">
              <h1 className="text-lg font-semibold">Mes missions du jour</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{todayTasks.length} missions assignées</p>
            </div>
            <div className="space-y-2">
              {todayTasks.map((t) => {
                const p = propMap.get(t.propertyId);
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className="w-full text-left rounded-xl border border-card-border bg-card p-4 hover-elevate"
                    data-testid={`button-provider-task-${t.id}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs uppercase tracking-wider font-semibold text-primary">{t.type}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="font-medium">{p?.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p?.address}, {p?.city}</div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t.scheduledAt}</span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="rounded-xl border border-card-border bg-card p-4 mb-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-primary">{active.type}</div>
              <div className="font-semibold mt-1">{propMap.get(active.propertyId)?.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="size-3" /> {propMap.get(active.propertyId)?.address}, {propMap.get(active.propertyId)?.city}</div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" data-testid="button-call-property"><Phone className="size-3.5 mr-1" />Appeler</Button>
                <Button size="sm" variant="outline" className="flex-1" data-testid="button-navigate"><MapPin className="size-3.5 mr-1" />Itinéraire</Button>
              </div>
            </div>

            <div className="rounded-xl border border-card-border bg-card p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm text-muted-foreground tabular-nums">{completedCount}/{checklist.length}</span>
              </div>
              <Progress value={progress} />
            </div>

            <div className="rounded-xl border border-card-border bg-card p-4 mb-4">
              <h3 className="font-semibold mb-3">Checklist</h3>
              <div className="space-y-1">
                {checklist.map((item, i) => {
                  const key = `c${i}`;
                  const checked = !!checks[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setChecks({ ...checks, [key]: !checked })}
                      className="w-full text-left p-2.5 rounded-md hover-elevate flex items-center gap-3"
                      data-testid={`button-checklist-${i}`}
                    >
                      <div className={`size-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${checked ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                        {checked && <CheckCircle2 className="size-3.5 text-primary-foreground" />}
                      </div>
                      <span className={`text-sm ${checked ? "line-through text-muted-foreground" : ""}`}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border-2 border-dashed border-card-border bg-card/40 p-6 text-center mb-4">
              <Camera className="size-6 text-muted-foreground mx-auto" />
              <div className="text-sm font-medium mt-2">Ajouter des photos</div>
              <div className="text-xs text-muted-foreground mt-1">Photos avant/après recommandées</div>
              <Button variant="outline" size="sm" className="mt-3" data-testid="button-upload-photo">Importer</Button>
            </div>

            <Button
              className="w-full h-12"
              onClick={() => validate.mutate()}
              disabled={validate.isPending || completedCount < checklist.length}
              data-testid="button-validate-mission"
            >
              {validate.isPending ? "Validation…" : <><CheckCircle2 className="size-4 mr-1.5" />Valider la mission</>}
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
