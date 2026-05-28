import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Plus, Search, ChevronRight, MapPin, Users, Bed, Wallet, ArrowLeft, Filter, Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Property, Booking } from "@shared/schema";

export default function Properties() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const [q, setQ] = useState("");

  const filtered = properties.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.city.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-page-title">Biens immobiliers</h1>
          <p className="text-sm text-muted-foreground mt-1">{properties.length} logement(s) sous gestion</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="button-export-properties"><Download className="size-4 mr-1.5" />Export</Button>
          <AddPropertyDialog />
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-card-border">
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-muted rounded-md px-3 py-1.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un bien, ville..."
              className="bg-transparent outline-none flex-1 text-sm"
              data-testid="input-search-properties"
            />
          </div>
          <Button variant="outline" size="sm" data-testid="button-filter"><Filter className="size-4 mr-1.5" />Filtres</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-semibold">Bien</th>
                <th className="px-5 py-3 font-semibold">Ville</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Capacité</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold">Occupation</th>
                <th className="px-5 py-3 font-semibold text-right">Revenus mois</th>
                <th className="px-5 py-3 font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-muted-foreground">Chargement…</td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover-elevate" data-testid={`row-property-${p.id}`}>
                  <td className="px-5 py-4">
                    <Link href={`/properties/${p.id}`}>
                      <a className="font-medium hover:text-primary" data-testid={`link-property-${p.id}`}>{p.name}</a>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{p.city}</td>
                  <td className="px-5 py-4 text-muted-foreground">{p.type}</td>
                  <td className="px-5 py-4 text-muted-foreground">{p.capacity} pers · {p.bedrooms} ch.</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${p.occupancyRate * 100}%` }} />
                      </div>
                      <span className="text-xs tabular-nums">{Math.round(p.occupancyRate * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-medium tabular-nums">{p.monthlyRevenue.toLocaleString("fr-FR")}€</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/properties/${p.id}`}>
                      <a><ChevronRight className="size-4 text-muted-foreground" /></a>
                    </Link>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">Aucun bien trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const id = Number(params?.id);
  const { data: property } = useQuery<Property>({ queryKey: ["/api/properties", id] });
  const { data: bookings = [] } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });
  const propertyBookings = bookings.filter((b) => b.propertyId === id);

  if (!property) {
    return <AppShell><div className="text-muted-foreground">Chargement…</div></AppShell>;
  }

  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <Link href="/properties"><a className="hover:text-foreground inline-flex items-center gap-1" data-testid="link-back-properties"><ArrowLeft className="size-3.5" /> Retour aux biens</a></Link>
      </div>
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">{property.name}</h1>
            <StatusBadge status={property.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5"><MapPin className="size-3.5" /> {property.address}, {property.city}</p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-edit-property">Modifier</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiSmall label="Type" value={property.type} icon={<Bed className="size-4" />} />
        <KpiSmall label="Capacité" value={`${property.capacity} pers`} icon={<Users className="size-4" />} />
        <KpiSmall label="Occupation" value={`${Math.round(property.occupancyRate * 100)}%`} />
        <KpiSmall label="Revenus mensuels" value={`${property.monthlyRevenue.toLocaleString("fr-FR")}€`} icon={<Wallet className="size-4" />} />
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info" data-testid="tab-info">Info</TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="bookings" data-testid="tab-bookings">Réservations</TabsTrigger>
          <TabsTrigger value="finances" data-testid="tab-finances">Finances</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="font-semibold mb-4">Informations générales</h3>
            <dl className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Detail label="Adresse" value={property.address} />
              <Detail label="Ville" value={property.city} />
              <Detail label="Type" value={property.type} />
              <Detail label="Chambres" value={`${property.bedrooms}`} />
              <Detail label="Capacité maximale" value={`${property.capacity} personnes`} />
              <Detail label="Statut" value={property.status} />
            </dl>
            <h3 className="font-semibold mt-8 mb-4">Équipements</h3>
            <div className="flex flex-wrap gap-2">
              {["WiFi", "Cuisine équipée", "Climatisation", "Lave-linge", "Lave-vaisselle", "Parking", "Balcon", "Vue mer"].slice(0, property.bedrooms + 4).map((e) => (
                <span key={e} className="px-2.5 py-1 rounded-md border border-card-border bg-muted text-xs">{e}</span>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <CalendarGrid bookings={propertyBookings} />
        </TabsContent>
        <TabsContent value="bookings" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
                <tr><th className="px-5 py-3">Voyageur</th><th className="px-5 py-3">Check-in</th><th className="px-5 py-3">Check-out</th><th className="px-5 py-3">Montant</th><th className="px-5 py-3">Canal</th><th className="px-5 py-3">Statut</th></tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {propertyBookings.map((b) => (
                  <tr key={b.id} className="hover-elevate">
                    <td className="px-5 py-3 font-medium">{b.guestName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.checkIn}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.checkOut}</td>
                    <td className="px-5 py-3 tabular-nums">{b.totalPrice.toLocaleString("fr-FR")}€</td>
                    <td className="px-5 py-3"><StatusBadge status={b.channel} /></td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="finances" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="font-semibold mb-4">Revenus & commissions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Detail2 label="Revenus bruts" value={`${property.monthlyRevenue.toLocaleString("fr-FR")}€`} />
              <Detail2 label="Commission (15%)" value={`${Math.round(property.monthlyRevenue * 0.15).toLocaleString("fr-FR")}€`} />
              <Detail2 label="Net propriétaire" value={`${Math.round(property.monthlyRevenue * 0.85).toLocaleString("fr-FR")}€`} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function KpiSmall({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">{icon}{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (<><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></>);
}
function Detail2({ label, value }: { label: string; value: string }) {
  return (<div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="text-xl font-semibold mt-1">{value}</div></div>);
}

function CalendarGrid({ bookings }: { bookings: Booking[] }) {
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 7 + i);
    return d;
  });

  function bookingForDay(d: Date) {
    const s = d.toISOString().slice(0, 10);
    return bookings.find((b) => b.checkIn <= s && s < b.checkOut);
  }

  return (
    <div className="rounded-xl border border-card-border bg-card p-5">
      <h3 className="font-semibold mb-4">Disponibilités · 4 semaines</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="text-xs text-muted-foreground text-center pb-1">{d}</div>
        ))}
        {days.map((d, i) => {
          const b = bookingForDay(d);
          const isToday = d.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);
          return (
            <div key={i} className={`aspect-square rounded-md border text-xs flex flex-col items-center justify-center p-1 ${b ? "bg-primary/15 border-primary/30 text-primary" : "border-card-border"} ${isToday ? "ring-2 ring-primary" : ""}`}>
              <span className="font-semibold">{d.getDate()}</span>
              {b && <span className="text-[9px] truncate w-full text-center mt-0.5">{b.guestName.split(" ")[0]}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddPropertyDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", address: "", city: "", type: "Appartement", bedrooms: 1, capacity: 2 });
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/properties", {
        ...form,
        agencyId: 1,
        ownerId: 1,
        status: "active",
        occupancyRate: 0,
        monthlyRevenue: 0,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({ title: "Bien créé", description: `${form.name} a été ajouté à votre catalogue.` });
      setOpen(false);
      setStep(1);
      setForm({ name: "", address: "", city: "", type: "Appartement", bedrooms: 1, capacity: 2 });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="button-add-property"><Plus className="size-4 mr-1.5" />Ajouter un bien</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau bien · Étape {step}/3</DialogTitle>
          <DialogDescription>
            {step === 1 && "Adresse et localisation"}
            {step === 2 && "Capacité et type"}
            {step === 3 && "Statut et vérification"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nom du bien</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-name" /></div>
            <div className="space-y-2"><Label>Adresse</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} data-testid="input-address" /></div>
            <div className="space-y-2"><Label>Ville</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} data-testid="input-city" /></div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Type</Label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" data-testid="select-type">
                <option>Appartement</option><option>Maison</option><option>Studio</option><option>Villa</option><option>Loft</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Chambres</Label><Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Capacité</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="rounded-lg border border-card-border bg-muted/40 p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Nom</span><span className="font-medium">{form.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Adresse</span><span className="font-medium">{form.address}, {form.city}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{form.type}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Capacité</span><span className="font-medium">{form.capacity} pers · {form.bedrooms} ch.</span></div>
          </div>
        )}
        <DialogFooter>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} data-testid="button-prev-step">Précédent</Button>}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} data-testid="button-next-step">Suivant</Button>
          ) : (
            <Button onClick={() => create.mutate()} disabled={create.isPending} data-testid="button-create-property">
              {create.isPending ? "Création…" : "Créer le bien"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
