import { notFound } from "next/navigation";
import { PatientCaseDetailPage } from "@/components/patient/patient-case-detail-page";
import { getMockPatientCaseDetail } from "@/data/mock-patient-dashboard";

type PatientCaseDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientCaseDetailRoute({ params }: PatientCaseDetailRouteProps) {
  const { id } = await params;
  const detail = getMockPatientCaseDetail(id);
  if (!detail) notFound();
  return <PatientCaseDetailPage detail={detail} />;
}
