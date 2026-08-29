import { notFound, redirect } from "next/navigation";
import { isEnquiryCategoryId } from "@/lib/enquiryCatalog";

export default async function CategoryEnquiriesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isEnquiryCategoryId(category)) {
    notFound();
  }

  redirect(`/admin/enquiries?type=${encodeURIComponent(category)}`);
}
