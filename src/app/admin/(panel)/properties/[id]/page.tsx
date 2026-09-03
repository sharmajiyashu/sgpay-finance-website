"use client";

import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPropertyById, updateProperty } from "@/sg-admin/lib/services/propertyService";
import { PropertyAccessGuard } from "@/sg-admin/components/PropertyAccessGuard";
import { PropertyForm, formToPayload, propertyToForm } from "@/sg-admin/components/PropertyForm";
import { hasPermission } from "@/sg-admin/lib/permissions";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id || "");
  const canUpdate = hasPermission("admin:property:update");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-property", id],
    queryFn: () => getPropertyById(id),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (body: ReturnType<typeof formToPayload>) => updateProperty(id, body),
    onSuccess: () => {
      toast.success("Property updated");
      router.push("/admin/properties");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <PropertyAccessGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit property</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data?.name || "Update listing details"}</p>
        </div>
        {error && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load property"}
          </p>
        )}
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : data ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <PropertyForm
              key={data._id || data.id}
              initial={propertyToForm(data)}
              submitLabel={canUpdate ? "Save changes" : "View only"}
              pending={mutation.isPending}
              onCancel={() => router.push("/admin/properties")}
              onSubmit={(values) => {
                if (!canUpdate) {
                  toast.error("You do not have permission to update properties");
                  return;
                }
                mutation.mutate(formToPayload(values));
              }}
            />
          </div>
        ) : null}
      </div>
    </PropertyAccessGuard>
  );
}
