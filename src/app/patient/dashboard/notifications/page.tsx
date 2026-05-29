import { PatientNotificationsPage } from "@/components/patient/patient-notifications-page";
import { MOCK_PATIENT_NOTIFICATIONS } from "@/data/mock-patient-dashboard";

export default function PatientNotificationsRoutePage() {
  return <PatientNotificationsPage notifications={MOCK_PATIENT_NOTIFICATIONS} />;
}
