import { PatientSettingsPage } from "@/components/patient/patient-settings-page";
import { MOCK_PATIENT_NAME } from "@/data/mock-patient-dashboard";

export default function PatientSettingsRoutePage() {
  return <PatientSettingsPage patientName={MOCK_PATIENT_NAME} />;
}
