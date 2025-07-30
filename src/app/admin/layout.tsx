"use client";

import { useState } from "react";
import { AdminSideNav } from '@/components/layout/AdminSideNav';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`flex flex-1 ${!sidebarOpen ? "pb-10" : ""}`}>
      {/* Sidebar */}
      <AdminSideNav visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Bouton burger flottant si sidebar masquée */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          className="fixed top-22 left-4 z-50 p-2 bg-primary/10 rounded "
          onClick={() => setSidebarOpen(true)}
          aria-label="Afficher la navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <main className="flex flex-1 relative">
        {children}
      </main>
    </div>
  );
}