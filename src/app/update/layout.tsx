import { HospitalRegistrationFlow } from "@/components/dashboard/hospital-registration-flow";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function UpdateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardShell>
      {children}
      <HospitalRegistrationFlow />
    </DashboardShell>
  );
}
