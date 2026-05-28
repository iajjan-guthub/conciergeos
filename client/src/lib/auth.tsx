import { createContext, useContext, useState, ReactNode } from "react";

type User = { email: string; fullName: string; agencyName: string } | null;

type AuthCtx = {
  user: User;
  login: (email: string, password: string) => void;
  register: (agencyName: string, fullName: string, email: string, password: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Demo mode: auto-logged in to make demo accessible
  const [user, setUser] = useState<User>({
    email: "marie@parisselite.fr",
    fullName: "Marie Laurent",
    agencyName: "Conciergerie Paris Elite",
  });

  return (
    <Ctx.Provider
      value={{
        user,
        login: (email) =>
          setUser({ email, fullName: "Marie Laurent", agencyName: "Conciergerie Paris Elite" }),
        register: (agencyName, fullName, email) =>
          setUser({ email, fullName, agencyName }),
        logout: () => setUser(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
