"use client";

import { useEffect, useState } from "react";
import { DonorHeader } from "@/components/layout/donor-header";
import { DonorSidebar } from "@/components/layout/donor-sidebar";
import { MOCK_DONOR_DISPLAY_NAME } from "@/data/mock-donor-dashboard";
import { getStoredAuthUser } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

type DonorShellProps = {
  children: React.ReactNode;
  donorName?: string;
};

export function DonorShell({ children, donorName: donorNameProp }: DonorShellProps) {
  const [donorName, setDonorName] = useState(() => {
    if (donorNameProp != null && donorNameProp !== "") return donorNameProp;
    if (typeof window === "undefined") return MOCK_DONOR_DISPLAY_NAME;
    const u = getStoredAuthUser();
    if (u?.full_name?.trim()) return u.full_name.trim();
    if (u?.email) return u.email;
    return MOCK_DONOR_DISPLAY_NAME;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (donorNameProp != null && donorNameProp !== "") {
      setDonorName(donorNameProp);
      return;
    }
    const u = getStoredAuthUser();
    if (u?.full_name?.trim()) setDonorName(u.full_name.trim());
    else if (u?.email) setDonorName(u.email);
  }, [donorNameProp]);

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
      <DonorSidebar
        donorName={donorName}
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
        <div
          data-app-scroll-container=""
          className="no-scrollbar flex min-h-screen flex-col overflow-y-auto bg-white"
        >
          <DonorHeader donorName={donorName} onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 pb-6 pt-2 md:px-6 md:pb-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
