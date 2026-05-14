import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function PatientIdentificationPage() {
  redirect(ROUTES.onboarding.patient.email);
}
