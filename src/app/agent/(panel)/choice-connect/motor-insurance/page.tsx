import { redirect } from "next/navigation";

/** Motor Insurance moved to separate Insurance module */
export default function AgentMotorInsuranceRedirectPage() {
  redirect("/agent/insurance/motor");
}
