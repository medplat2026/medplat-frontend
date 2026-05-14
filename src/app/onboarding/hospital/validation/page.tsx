import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function HospitalValidationPage() {
  redirect(ROUTES.onboarding.hospital.contact);
}
