"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/common/button";
import { Menu } from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";
import { Role } from "@/types/role";

// This component is used to provide a layout for client-side pages.
// It includes a sidebar for navigation and a main content area.  
export default function LayoutClient({ children, role }: { children: React.ReactNode; role: Role }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className={`flex flex-1`}>
      {/* Sidebar */}
      <SideNav role={role} visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Bouton burger flottant si sidebar masquée */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          className="fixed top-22 left-4 z-50 p-2 bg-primary/10 rounded "
          onClick={() => setSidebarOpen(true)}
          aria-label="Show navigation bar"
        >
          <Menu aria-label="Menu" className="h-5 w-5" />
        </Button>
      )}

      <main className={`flex flex-1 pb-10`}>
        {children}
      </main>
    </div>
  );
}