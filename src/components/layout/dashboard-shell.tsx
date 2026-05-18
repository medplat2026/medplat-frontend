"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
  /** Shown in sidebar + welcome line */
  hospitalName?: string;
};

export function DashboardShell({
  children,
  hospitalName = "LUTH Hospital",
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    closeOnDesktop();
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-foreground">
      <DashboardSidebar
        hospitalName={hospitalName}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div
        className={cn(
          "min-h-screen translate-x-0 transition-[padding] duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-[92px]" : "lg:pl-[260px]",
        )}
      >
        <div data-app-scroll-container="" className="no-scrollbar flex min-h-screen flex-col overflow-y-auto bg-white">
          <DashboardHeader
            hospitalName={hospitalName}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="px-4 pb-6 pt-2 md:px-6 md:pb-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
