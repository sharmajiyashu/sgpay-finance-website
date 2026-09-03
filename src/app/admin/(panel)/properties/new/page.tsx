"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProperty } from "@/sg-admin/lib/services/propertyService";
import { PropertyAccessGuard } from "@/sg-admin/components/PropertyAccessGuard";
import { PropertyForm, formToPayload } from "@/sg-admin/components/PropertyForm";

export default function NewPropertyPage() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      toast.success("Property created");
      router.push("/admin/properties");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <PropertyAccessGuard permission="admin:property:create">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add property</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step-by-step listing. Upload gallery images and videos — do not paste URLs.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <PropertyForm
            submitLabel="Create property"
            pending={mutation.isPending}
            onCancel={() => router.push("/admin/properties")}
            onSubmit={(values) => mutation.mutate(formToPayload(values))}
          />
        </div>
      </div>
    </PropertyAccessGuard>
  );
}
