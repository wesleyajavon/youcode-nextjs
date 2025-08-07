"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/common/button";
import { Menu } from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";
import { Role } from "@/types/role";

// This component is used to provide a layout for client-side pages.
// It includes a sidebar for navigation and a main content area.  
export default function LayoutClient({ children, role }: { children: React.ReactNode; role: Role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    // This ensures that the sidebar state persists across page reloads.
    const saved = typeof window !== "undefined" ? localStorage.getItem("sidebarOpen") : null;
    if (saved !== null) setSidebarOpen(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // Save to localStorage on change
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);

  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <SideNav role={role} visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Floating burger button if sidebar is hidden */}
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
  );
}