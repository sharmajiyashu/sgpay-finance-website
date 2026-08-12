import { redirect } from "next/navigation";

/** Motor Insurance moved to separate Insurance module */
export default function AdminMotorInsuranceRedirectPage() {
  redirect("/admin/insurance/motor");
}
