import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Home,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Wallet,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Users,
  Smartphone,
} from "lucide-react";
import { Logo } from "./Logo";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navMain = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Biens", icon: Home },
  { href: "/bookings", label: "Réservations", icon: CalendarCheck },
  { href: "/planning", label: "Planning", icon: CalendarDays },
  { href: "/tasks", label: "Missions", icon: ClipboardList },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/messages", label: "Messagerie", icon: MessageSquare },
  { href: "/finances", label: "Finances", icon: Wallet },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const navBottom = [
  { href: "/owner-portal", label: "Portail propriétaire", icon: Users },
  { href: "/provider", label: "App prestataire", icon: Smartphone },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const active = location === href || (href !== "/dashboard" && location.startsWith(href));
    return (
      <Link href={href}>
        <a
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover-elevate",
            active
              ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] font-medium"
              : "text-[hsl(var(--sidebar-foreground))]/70 hover:text-[hsl(var(--sidebar-foreground))]"
          )}
          data-testid={`link-nav-${label.toLowerCase().replace(/\s/g, "-")}`}
          onClick={() => setMobileOpen(false)}
        >
          <Icon className="size-4 flex-shrink-0" />
          <span className="truncate">{label}</span>
          {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))] flex-col",
          "transform transition-transform lg:translate-x-0 lg:flex",
          mobileOpen ? "translate-x-0 flex" : "-translate-x-full lg:flex"
        )}
      >
        <div className="h-14 flex items-center px-4 border-b border-[hsl(var(--sidebar-border))]">
          <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <div className="px-3 pt-1 pb-2 text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/40 font-semibold">
            Pilotage
          </div>
          {navMain.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
          <div className="px-3 pt-5 pb-2 text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/40 font-semibold">
            Portails
          </div>
          {navBottom.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
        </nav>
        <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
          <div className="rounded-md bg-[hsl(var(--sidebar-accent))]/60 p-3 text-xs text-[hsl(var(--sidebar-foreground))]/80">
            <div className="font-medium text-[hsl(var(--sidebar-foreground))]">Essai Pro</div>
            <div className="mt-1 text-[hsl(var(--sidebar-foreground))]/60">12 jours restants</div>
            <div className="mt-2 h-1.5 rounded-full bg-[hsl(var(--sidebar-border))] overflow-hidden">
              <div className="h-full w-[20%] bg-primary" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-60">
        <header className="h-14 sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-card-border flex items-center gap-3 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-menu-toggle"
          >
            <Menu className="size-5" />
          </Button>
          <div className="hidden md:flex items-center gap-2 max-w-md flex-1 text-sm">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Rechercher un bien, voyageur, réservation..."
              className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
              data-testid="input-global-search"
            />
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded border border-card-border text-muted-foreground">
              ⌘K
            </kbd>
          </div>
          <div className="flex-1 lg:flex-none" />
          <Button variant="ghost" size="icon" onClick={toggle} data-testid="button-theme-toggle">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-notifications" className="relative">
            <Bell className="size-4" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2" data-testid="button-user-menu">
                <div className="size-7 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                  {user?.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <span className="hidden md:inline text-sm">{user?.fullName}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">{user?.fullName}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                Mon profil
              </DropdownMenuItem>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings className="size-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="size-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px]">{children}</main>
      </div>
    </div>
  );
}
