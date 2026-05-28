import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Plus, Search, ChevronRight, ArrowLeft, Filter, Download, Calendar, Key, Mail, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Property, Booking, Message } from "@shared/schema";

export default function Bookings() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const propMap = new Map(properties.map((p) => [p.id, p]));

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const filtered = bookings.filter((b) => {
    const matchesQ = b.guestName.toLowerCase().includes(q.toLowerCase()) || String(b.id).includes(q);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesChannel = channelFilter === "all" || b.channel === channelFilter;
    return matchesQ && matchesStatus && matchesChannel;
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Réservations</h1>
          <p className="text-sm text-muted-foreground mt-1">{bookings.length} réservations · {bookings.filter((b) => b.status === "active").length} en cours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="button-export"><Download className="size-4 mr-1.5" />Export</Button>
          <Button size="sm" data-testid="button-new-booking"><Plus className="size-4 mr-1.5" />Nouvelle réservation</Button>
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-card-border">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm bg-muted rounded-md px-3 py-1.5">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Voyageur, #id..." className="bg-transparent outline-none flex-1 text-sm" data-testid="input-search-bookings" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm" data-testid="select-status-filter">
            <option value="all">Tous statuts</option>
            <option value="confirmed">Confirmée</option>
            <option value="active">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm" data-testid="select-channel-filter">
            <option value="all">Tous canaux</option>
            <option value="airbnb">Airbnb</option>
            <option value="booking">Booking</option>
            <option value="direct">Direct</option>
          </select>
          <Button variant="outline" size="sm" data-testid="button-date-filter"><Calendar className="size-4 mr-1.5" />Période</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">Bien</th>
                <th className="px-5 py-3 font-semibold">Voyageur</th>
                <th className="px-5 py-3 font-semibold">Check-in</th>
                <th className="px-5 py-3 font-semibold">Check-out</th>
                <th className="px-5 py-3 font-semibold text-right">Montant</th>
                <th className="px-5 py-3 font-semibold">Canal</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading && <tr><td colSpan={9} className="px-5 py-8 text-center text-muted-foreground">Chargement…</td></tr>}
              {filtered.map((b) => {
                const p = propMap.get(b.propertyId);
                return (
                  <tr key={b.id} className="hover-elevate" data-testid={`row-booking-${b.id}`}>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">#{String(b.id).padStart(5, "0")}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium">{p?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{p?.city}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                          {b.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{b.guestName}</div>
                          <div className="text-xs text-muted-foreground">{b.guests} pers</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{b.checkIn}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.checkOut}</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">{b.totalPrice.toLocaleString("fr-FR")}€</td>
                    <td className="px-5 py-3"><StatusBadge status={b.channel} /></td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/bookings/${b.id}`}>
                        <a data-testid={`link-booking-${b.id}`}><ChevronRight className="size-4 text-muted-foreground" /></a>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">Aucune réservation trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function BookingDetail() {
  const [, params] = useRoute("/bookings/:id");
  const id = Number(params?.id);
  const { data: booking } = useQuery<Booking>({ queryKey: ["/api/bookings", id] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const { data: messages = [] } = useQuery<Message[]>({ queryKey: ["/api/messages"] });

  if (!booking) return <AppShell><div className="text-muted-foreground">Chargement…</div></AppShell>;
  const property = properties.find((p) => p.id === booking.propertyId);
  const bookingMessages = messages.filter((m) => m.bookingId === booking.id);

  const nights = Math.round((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000);

  return (
    <AppShell>
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <Link href="/bookings"><a className="hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="size-3.5" /> Retour</a></Link>
      </div>
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">Réservation #{String(booking.id).padStart(5, "0")}</h1>
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.channel} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{booking.guestName} · {property?.name} · {nights} nuits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="button-cancel-booking">Annuler</Button>
          <Button size="sm" data-testid="button-edit-booking">Modifier</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        <KpiSmall label="Check-in" value={booking.checkIn} />
        <KpiSmall label="Check-out" value={booking.checkOut} />
        <KpiSmall label="Voyageurs" value={`${booking.guests} pers`} />
        <KpiSmall label="Montant" value={`${booking.totalPrice.toLocaleString("fr-FR")}€`} />
      </div>

      <Tabs defaultValue="guest">
        <TabsList>
          <TabsTrigger value="guest" data-testid="tab-guest">Voyageur</TabsTrigger>
          <TabsTrigger value="access" data-testid="tab-access">Accès</TabsTrigger>
          <TabsTrigger value="tasks" data-testid="tab-tasks">Tâches</TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
          <TabsTrigger value="finances" data-testid="tab-finances">Finances</TabsTrigger>
        </TabsList>
        <TabsContent value="guest" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="font-semibold mb-4">Informations voyageur</h3>
            <dl className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Detail label="Nom complet" value={booking.guestName} />
              <Detail label="Email" value={booking.guestEmail} />
              <Detail label="Téléphone" value={booking.guestPhone ?? "Non renseigné"} />
              <Detail label="Nombre de voyageurs" value={`${booking.guests} personnes`} />
            </dl>
          </div>
        </TabsContent>
        <TabsContent value="access" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="font-semibold mb-4">Code d'accès & instructions</h3>
            <div className="rounded-lg bg-muted p-6 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Code d'accès</div>
              <div className="text-5xl font-mono font-semibold tracking-widest mt-2 text-primary">{booking.accessCode ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-2">Boîte à clés près de la porte principale</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" data-testid="button-send-access"><Mail className="size-4 mr-1.5" />Envoyer au voyageur</Button>
              <Button variant="outline" size="sm" data-testid="button-regenerate-access"><Key className="size-4 mr-1.5" />Régénérer</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tasks" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6 text-sm text-muted-foreground">
            Voir les missions associées dans <Link href="/tasks"><a className="text-primary hover:underline">l'onglet Missions</a></Link>.
          </div>
        </TabsContent>
        <TabsContent value="messages" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="size-4" /> Conversation</h3>
            <div className="space-y-3">
              {bookingMessages.map((m) => (
                <div key={m.id} className={`flex ${m.direction === "out" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-lg p-3 text-sm ${m.direction === "out" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.body}
                    <div className={`text-[10px] mt-1 ${m.direction === "out" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.sentAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="finances" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="font-semibold mb-4">Décompte financier</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Montant brut" value={`${booking.totalPrice.toLocaleString("fr-FR")}€`} />
              <Row label="Commission plateforme" value={`-${booking.commission.toLocaleString("fr-FR")}€`} />
              <Row label="Frais de ménage" value={`-80€`} />
              <div className="border-t border-card-border pt-3">
                <Row label="Net propriétaire" value={`${(booking.totalPrice - booking.commission - 80).toLocaleString("fr-FR")}€`} bold />
              </div>
            </dl>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function KpiSmall({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (<><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></>);
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-semibold text-primary" : ""}`}>{value}</span>
    </div>
  );
}
