import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/** Legacy path from earlier routing; canonical route is `ROUTES.hospital.update`. */
export default function UpdateLegacyRedirect() {
  redirect(ROUTES.hospital.update);
}
