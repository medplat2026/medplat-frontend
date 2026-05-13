import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function PatientEmailPage() {
  redirect(ROUTES.onboarding.patient.details);
}
