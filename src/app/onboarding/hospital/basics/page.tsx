import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function HospitalBasicsPage() {
  redirect(ROUTES.onboarding.hospital.contact);
}
