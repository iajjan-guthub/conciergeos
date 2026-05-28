import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import { Login, Register } from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Properties, { PropertyDetail } from "@/pages/Properties";
import Bookings, { BookingDetail } from "@/pages/Bookings";
import Planning from "@/pages/Planning";
import Tasks from "@/pages/Tasks";
import Incidents from "@/pages/Incidents";
import Messages from "@/pages/Messages";
import Finances from "@/pages/Finances";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import { OwnerPortal, GuestPortal, ProviderApp } from "@/pages/Portals";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/bookings/:id" component={BookingDetail} />
      <Route path="/planning" component={Planning} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/incidents" component={Incidents} />
      <Route path="/messages" component={Messages} />
      <Route path="/finances" component={Finances} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route path="/owner-portal" component={OwnerPortal} />
      <Route path="/guest/:token" component={GuestPortal} />
      <Route path="/provider" component={ProviderApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <AppRouter />
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
