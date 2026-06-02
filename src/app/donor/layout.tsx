import { DonorShell } from "@/components/layout/donor-shell";

export default function DonorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DonorShell>{children}</DonorShell>;
}
