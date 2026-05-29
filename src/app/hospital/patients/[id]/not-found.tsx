import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function PatientNotFound() {
  return (
    <div className="mt-4 space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Patient not found</h2>
      <p className="text-sm text-muted-foreground">This patient does not exist or may have been removed.</p>
      <Link
        href={ROUTES.hospital.patients}
        className="inline-flex text-sm font-medium text-onboarding-blue hover:underline"
      >
        ← Back to patients
      </Link>
    </div>
  );
}
