"use client";

import { useState } from "react";
import { Button } from "@/components/ui/common/button";
import { Menu } from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";
import { Role } from "@/types/role";

export default function LayoutClient({ children, role }: { children: React.ReactNode; role: Role }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);


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
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <main className={`flex flex-1 pb-10`}>
        {children}
      </main>
    </div>
  );
}