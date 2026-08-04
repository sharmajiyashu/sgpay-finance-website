"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { EnquiriesPanel } from "@/sg-admin/components/EnquiriesPanel";
import { isEnquiryCategoryId } from "@/lib/enquiryCatalog";

export default function CategoryEnquiriesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);

  if (!isEnquiryCategoryId(category)) {
    notFound();
  }

  return <EnquiriesPanel categoryId={category} />;
}
