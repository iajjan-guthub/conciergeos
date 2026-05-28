import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Plus, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Agency, User } from "@shared/schema";

export default function Settings() {
  const { data: agency } = useQuery<Agency>({ queryKey: ["/api/agency"] });
  const { data: users = [] } = useQuery<User[]>({ queryKey: ["/api/users"] });

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Configurer votre agence, vos utilisateurs et votre abonnement</p>
      </div>

      <Tabs defaultValue="agency">
        <TabsList>
          <TabsTrigger value="agency" data-testid="tab-agency">Agence</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Équipe</TabsTrigger>
          <TabsTrigger value="billing" data-testid="tab-billing">Plan & Facturation</TabsTrigger>
        </TabsList>

        <TabsContent value="agency" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card p-6 max-w-3xl">
            <h3 className="font-semibold mb-4">Profil de l'agence</h3>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-card-border">
              <div className="size-16 rounded-xl bg-[hsl(var(--sidebar))] flex items-center justify-center">
                <Logo showText={false} />
              </div>
              <Button variant="outline" size="sm" data-testid="button-upload-logo">Changer le logo</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nom de l'agence</Label><Input defaultValue={agency?.name} data-testid="input-agency-name" /></div>
              <div className="space-y-2"><Label>Email de contact</Label><Input defaultValue={agency?.email} data-testid="input-agency-email" /></div>
              <div className="space-y-2"><Label>Téléphone</Label><Input defaultValue="+33 1 42 60 33 22" /></div>
              <div className="space-y-2"><Label>Site web</Label><Input defaultValue="parisselite.fr" /></div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button data-testid="button-save-agency">Enregistrer</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="rounded-xl border border-card-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Membres de l'équipe</h3>
                <p className="text-xs text-muted-foreground">{users.length} utilisateurs actifs</p>
              </div>
              <InviteDialog />
            </div>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-card-border bg-muted/40">
                <tr><th className="px-5 py-3">Nom</th><th className="px-5 py-3">Rôle</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Statut</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover-elevate" data-testid={`row-user-${u.id}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                          {u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{u.fullName}</div>
                          <div className="text-xs text-muted-foreground">{u.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize">{u.role === "admin" ? "Administrateur" : "Membre"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-3"><StatusBadge status="active" /></td>
                    <td className="px-5 py-3 text-right"><Button variant="ghost" size="sm">Gérer</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 rounded-xl border border-primary/40 bg-primary/5 p-6">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">Plan actuel</span>
                <span className="text-xl font-semibold">Pro</span>
              </div>
              <div className="text-3xl font-semibold mt-3">14€<span className="text-sm text-muted-foreground font-normal">/logement/mois</span></div>
              <div className="text-sm text-muted-foreground mt-1">3 logements actifs · 42€/mois</div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" data-testid="button-change-plan">Changer de plan</Button>
                <Button variant="ghost" data-testid="button-cancel-plan">Annuler</Button>
              </div>
            </div>
            <div className="rounded-xl border border-card-border bg-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Période d'essai</div>
              <div className="text-2xl font-semibold mt-1">12 jours</div>
              <div className="text-xs text-muted-foreground mt-1">Se termine le {agency?.trialEndsAt}</div>
              <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "20%" }} />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="font-semibold mb-4">Mode de paiement</h3>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
              <div className="size-10 rounded-md bg-card flex items-center justify-center font-mono font-bold text-xs">VISA</div>
              <div className="flex-1">
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-xs text-muted-foreground">Expire 09/2028</div>
              </div>
              <Button variant="outline" size="sm">Modifier</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function InviteDialog() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  function invite() {
    if (!email) return;
    toast({ title: "Invitation envoyée", description: `Un email a été envoyé à ${email}` });
    setEmail("");
  }
  return (
    <div className="flex gap-2">
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nouveau@agence.fr" className="w-56 h-9" data-testid="input-invite-email" />
      <Button size="sm" onClick={invite} data-testid="button-invite-user"><Plus className="size-4 mr-1.5" />Inviter</Button>
    </div>
  );
}
