import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

type PatientDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientDetailRoute({ params }: PatientDetailRouteProps) {
  const { id } = await params;
  return <PatientDetailPage patientId={id} />;
}
