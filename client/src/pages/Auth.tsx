import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("marie@parisselite.fr");
  const [password, setPassword] = useState("demo");
  const { login } = useAuth();
  const { toast } = useToast();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login(email, password);
    toast({ title: "Connexion réussie", description: "Bienvenue sur ConciergeOS" });
    setLocation("/dashboard");
  }

  return (
    <AuthShell title="Connexion à votre espace" subtitle="Accédez à votre conciergerie en quelques secondes.">
      <form onSubmit={submit} className="space-y-4" data-testid="form-login">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="input-email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <button type="button" className="text-xs text-primary hover:underline" data-testid="link-forgot-password">Mot de passe oublié ?</button>
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="input-password" />
        </div>
        <Button type="submit" className="w-full" data-testid="button-submit-login">Se connecter</Button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border" /></div>
          <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">ou</span></div>
        </div>
        <Button type="button" variant="outline" className="w-full gap-2" data-testid="button-magic-link">
          <Mail className="size-4" /> Recevoir un lien magique
        </Button>
      </form>
      <div className="text-sm text-center mt-6 text-muted-foreground">
        Pas encore de compte ? <Link href="/register"><a className="text-primary hover:underline" data-testid="link-to-register">Créer un compte</a></Link>
      </div>
    </AuthShell>
  );
}

export function Register() {
  const [, setLocation] = useLocation();
  const [agency, setAgency] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const { toast } = useToast();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    register(agency, fullName, email, password);
    toast({ title: "Compte créé", description: "Bienvenue ! Votre essai 15 jours est actif." });
    setLocation("/dashboard");
  }

  return (
    <AuthShell title="Créer votre compte" subtitle="15 jours d'essai gratuit · Sans carte bancaire">
      <form onSubmit={submit} className="space-y-4" data-testid="form-register">
        <div className="space-y-2">
          <Label htmlFor="agency">Nom de l'agence</Label>
          <Input id="agency" value={agency} onChange={(e) => setAgency(e.target.value)} placeholder="Conciergerie Paris Elite" required data-testid="input-agency" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Votre nom</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Marie Laurent" required data-testid="input-fullname" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email professionnel</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@agence.fr" required data-testid="input-email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" required data-testid="input-password" />
        </div>
        <Button type="submit" className="w-full" data-testid="button-submit-register">Créer mon compte</Button>
      </form>
      <div className="text-sm text-center mt-6 text-muted-foreground">
        Déjà inscrit ? <Link href="/login"><a className="text-primary hover:underline" data-testid="link-to-login">Se connecter</a></Link>
      </div>
    </AuthShell>
  );
}

function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <Link href="/"><a className="inline-block mb-10" data-testid="link-back-home"><Logo /></a></Link>
          <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            <Shield className="size-3" /> Démo · Pas de CB requise
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex relative items-center justify-center bg-[hsl(var(--sidebar))] border-l border-[hsl(var(--sidebar-border))] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-glow-teal" />
        <div className="relative max-w-md text-center px-8">
          <div className="inline-flex size-14 rounded-2xl bg-primary/15 items-center justify-center mb-6">
            <Logo showText={false} />
          </div>
          <blockquote className="text-xl font-medium text-[hsl(var(--sidebar-foreground))] leading-relaxed">
            "Depuis ConciergeOS, on a divisé par 3 le temps passé sur les tâches admin. Nos propriétaires adorent le portail."
          </blockquote>
          <div className="mt-6 text-sm text-[hsl(var(--sidebar-foreground))]/70">
            <div className="font-semibold text-[hsl(var(--sidebar-foreground))]">Claire Vasseur</div>
            <div>CEO · Riviera Stays · 47 logements</div>
          </div>
        </div>
      </div>
    </div>
  );
}
