"use client";

import { useEffect, useState } from "react";
import { PatientHeader } from "@/components/layout/patient-header";
import { PatientSidebar } from "@/components/layout/patient-sidebar";
import { MOCK_PATIENT_NAME } from "@/data/mock-patient-dashboard";
import { getStoredAuthUser } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

type PatientShellProps = {
  children: React.ReactNode;
  patientName?: string;
};

export function PatientShell({ children, patientName: patientNameProp }: PatientShellProps) {
  const [patientName, setPatientName] = useState(() => {
    if (patientNameProp != null && patientNameProp !== "") return patientNameProp;
    if (typeof window === "undefined") return MOCK_PATIENT_NAME;
    const u = getStoredAuthUser();
    if (u?.full_name?.trim()) return u.full_name.trim();
    if (u?.email) return u.email;
    return MOCK_PATIENT_NAME;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (patientNameProp != null && patientNameProp !== "") {
      setPatientName(patientNameProp);
      return;
    }
    const u = getStoredAuthUser();
    if (u?.full_name?.trim()) setPatientName(u.full_name.trim());
    else if (u?.email) setPatientName(u.email);
  }, [patientNameProp]);

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
      <PatientSidebar
        patientName={patientName}
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
          <PatientHeader patientName={patientName} onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 pb-6 pt-2 md:px-6 md:pb-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
