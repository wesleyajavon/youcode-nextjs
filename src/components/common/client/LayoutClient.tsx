// LayoutClient.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/common/button";
import { Menu } from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";
import { Role } from "@/types/role";
import type { Session } from "next-auth"; // or your custom session type

type LayoutClientProps = {
  children: React.ReactNode;
  session: Session;
};

const SessionContext = createContext<Session | null>(null);
export const useSessionContext = () => {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error('useSessionContext must be used within UserLayoutClient');
  }
  return session;
};

export default function LayoutClient({ children, session }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <SessionContext.Provider value={session}>
      <div className="flex flex-1">
        <SideNav visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {!sidebarOpen && (
          <Button
            variant="ghost"
            className="fixed left-4 z-50 p-2 bg-primary/10 rounded
              bottom-26
              lg:bottom-auto lg:top-22 lg:p-3 lg:bg-primary/80 lg:rounded-full"
            onClick={() => setSidebarOpen(true)}
            aria-label="Show navigation bar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <main className="flex flex-1 pb-10">{children}</main>
      </div>
    </SessionContext.Provider>
  );
}
