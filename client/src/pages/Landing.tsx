import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Home, Sparkles, Wallet, Star, BarChart3, MessageSquare, Shield, Calendar } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Landing() {
  const [annual, setAnnual] = useState(false);
  const mult = annual ? 0.8 : 1;

  const plans = [
    { name: "Starter", price: 9 * mult, features: ["Jusqu'à 5 logements", "Channel manager basique", "Planning ménage", "Support email"], cta: "Commencer" },
    { name: "Pro", price: 14 * mult, features: ["Jusqu'à 30 logements", "Channel manager complet", "Pricing dynamique", "Portail propriétaire", "Portail voyageur", "Support prioritaire"], cta: "Essai 15 jours", highlighted: true },
    { name: "Agency", price: 19 * mult, features: ["Logements illimités", "Multi-équipes & rôles", "API & intégrations", "Tableaux de bord avancés", "Account manager dédié"], cta: "Nous contacter" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-card-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground" data-testid="link-nav-features">Fonctionnalités</button>
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground" data-testid="link-nav-pricing">Tarifs</button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground" data-testid="link-nav-about">À propos</button>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm" data-testid="button-login-nav">Connexion</Button></Link>
            <Link href="/register"><Button size="sm" data-testid="button-register-nav">Essai gratuit</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-glow-teal pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-card-border bg-card text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Nouveau · Pricing dynamique IA disponible
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] font-semibold tracking-tight max-w-3xl">
            Gérez votre conciergerie Airbnb depuis une <span className="text-primary">seule plateforme</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Réservations · Ménage · Propriétaires · Finance — Automatisez les tâches répétitives et reprenez la main sur votre exploitation.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2" data-testid="button-cta-trial">
                Essai gratuit 15 jours <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" data-testid="button-cta-demo">Voir la démo</Button>
            </Link>
            <span className="inline-flex items-center gap-2 ml-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <Shield className="size-3" /> Démo · Pas de CB requise
            </span>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-card-border border border-card-border rounded-xl overflow-hidden">
            {[
              { value: "+230", label: "agences clientes" },
              { value: "4,9/5", label: "Note moyenne", icon: <Star className="size-3 fill-current" /> },
              { value: "38 000", label: "biens gérés" },
              { value: "-65%", label: "tâches répétitives" },
            ].map((s) => (
              <div key={s.label} className="bg-card px-6 py-5">
                <div className="text-2xl font-semibold flex items-center gap-1.5">
                  {s.value}
                  {s.icon}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock dashboard preview */}
      <section className="border-b border-card-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="rounded-xl border border-card-border bg-card shadow-xl overflow-hidden">
            <div className="border-b border-card-border bg-[hsl(var(--sidebar))] px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-500/70" />
                <div className="size-2.5 rounded-full bg-amber-500/70" />
                <div className="size-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <div className="ml-3 text-xs text-[hsl(var(--sidebar-foreground))]/60 font-mono">conciergeos.app/dashboard</div>
            </div>
            <div className="grid grid-cols-12 min-h-[420px]">
              <div className="col-span-3 bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))] p-4 space-y-1.5 hidden md:block">
                {["Dashboard", "Biens", "Réservations", "Planning", "Missions", "Messagerie", "Finances"].map((l, i) => (
                  <div key={l} className={cn("h-7 rounded-md px-2 text-xs flex items-center", i === 0 ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]" : "text-[hsl(var(--sidebar-foreground))]/50")}>
                    {l}
                  </div>
                ))}
              </div>
              <div className="col-span-12 md:col-span-9 p-6 bg-background">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: "Taux d'occupation", v: "85%", c: "text-primary" },
                    { l: "RevPAR", v: "218€", c: "" },
                    { l: "Note moyenne", v: "4.9★", c: "" },
                    { l: "Incidents", v: "2", c: "text-red-500" },
                  ].map((k) => (
                    <div key={k.l} className="rounded-lg border border-card-border p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
                      <div className={cn("text-xl font-semibold mt-1", k.c)}>{k.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 h-[260px]">
                  <div className="col-span-2 rounded-lg border border-card-border p-4">
                    <div className="text-sm font-medium mb-3">Revenus mensuels</div>
                    <div className="h-[180px] flex items-end gap-2">
                      {[40, 55, 35, 30, 70, 85, 95].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t bg-primary/70 hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-card-border p-4">
                    <div className="text-sm font-medium mb-3">Arrivées aujourd'hui</div>
                    <div className="space-y-2">
                      {["Olivia M.", "Lucas S.", "Emma G."].map((g, i) => (
                        <div key={g} className="flex items-center gap-2 text-xs">
                          <div className="size-1.5 rounded-full bg-primary" />
                          <span className="flex-1 truncate">{g}</span>
                          <span className="text-muted-foreground">15h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-card-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">Fonctionnalités</div>
            <h2 className="text-3xl font-semibold mt-2">Tout votre métier dans un seul outil</h2>
            <p className="text-muted-foreground mt-3">De la réservation au reversement propriétaire, ConciergeOS couvre l'ensemble du cycle de vie.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Réservations",
                desc: "Channel manager unifié (Airbnb, Booking, Vrbo) et pricing dynamique IA.",
                bullets: ["Synchronisation iCal & API", "Anti-double booking", "Tarifs auto saisonniers"],
              },
              {
                icon: Sparkles,
                title: "Opérations",
                desc: "Planning ménage, check-in et maintenance avec votre équipe de prestataires.",
                bullets: ["App mobile prestataire", "Checklists photo", "Code d'accès auto"],
              },
              {
                icon: Wallet,
                title: "Finance",
                desc: "Reversements propriétaires automatiques et factures conformes.",
                bullets: ["Décomptes mensuels", "Factures PDF", "Export comptable"],
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-card-border bg-card p-6 hover:border-primary/40 transition-colors">
                <div className="size-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
                <ul className="mt-4 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* secondary features */}
          <div className="grid md:grid-cols-4 gap-4 mt-10">
            {[
              { icon: MessageSquare, title: "Messagerie unifiée", desc: "Toutes vos conversations." },
              { icon: BarChart3, title: "Analytics avancés", desc: "RevPAR, ADR, occupation." },
              { icon: Home, title: "Portail propriétaire", desc: "Vue temps réel." },
              { icon: Shield, title: "Conformité RGPD", desc: "Données hébergées en France." },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-card-border bg-card p-4">
                <f.icon className="size-4 text-primary mb-2" />
                <div className="font-medium text-sm">{f.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-card-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">Tarifs</div>
            <h2 className="text-3xl font-semibold mt-2">Un tarif clair, par logement</h2>
            <p className="text-muted-foreground mt-3">15 jours d'essai sans carte bancaire. Annulable à tout moment.</p>
            <div className="inline-flex items-center gap-2 mt-6 p-1 rounded-full border border-card-border bg-card">
              <button
                onClick={() => setAnnual(false)}
                className={cn("px-4 py-1.5 rounded-full text-sm transition-colors", !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                data-testid="button-pricing-monthly"
              >
                Mensuel
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn("px-4 py-1.5 rounded-full text-sm transition-colors", annual ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                data-testid="button-pricing-annual"
              >
                Annuel <span className="text-xs opacity-75">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "rounded-xl border bg-card p-6 relative",
                  p.highlighted
                    ? "border-primary shadow-xl ring-1 ring-primary/30"
                    : "border-card-border"
                )}
                data-testid={`card-plan-${p.name.toLowerCase()}`}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-6 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Le plus populaire
                  </span>
                )}
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">{p.price.toFixed(0)}€</span>
                  <span className="text-sm text-muted-foreground">/logement/mois</span>
                </div>
                {annual && (
                  <div className="text-xs text-primary mt-1">Facturé annuellement</div>
                )}
                <Link href="/register">
                  <Button className="w-full mt-6" variant={p.highlighted ? "default" : "outline"} data-testid={`button-plan-${p.name.toLowerCase()}`}>
                    {p.cta}
                  </Button>
                </Link>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="border-b border-card-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold">Prêt à automatiser votre conciergerie ?</h2>
          <p className="text-muted-foreground mt-3">Rejoignez plus de 230 agences qui gèrent leur exploitation avec ConciergeOS.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/register"><Button size="lg" data-testid="button-cta-final">Commencer maintenant</Button></Link>
            <Link href="/dashboard"><Button size="lg" variant="outline" data-testid="button-cta-final-demo">Explorer la démo</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border bg-card/40">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xs text-muted-foreground">© 2026 ConciergeOS. Tous droits réservés.</span>
          </div>
          <nav className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Mentions légales</a>
            <a href="#" className="hover:text-foreground">CGU</a>
            <a href="#" className="hover:text-foreground">Confidentialité</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
