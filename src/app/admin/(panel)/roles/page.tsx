"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getRoles, updateRole, type AdminRole } from "@/sg-admin/lib/services/roleService";

export default function AdminRolesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: getRoles,
  });

  const toggleMutation = useMutation({
    mutationFn: ({
      role,
      moduleIndex,
      featureKey,
      enabled,
    }: {
      role: AdminRole;
      moduleIndex: number;
      featureKey: string;
      enabled: boolean;
    }) => {
      const permissions = structuredClone(role.permissions || []);
      const module = permissions[moduleIndex];
      if (!module?.features?.[featureKey]) {
        throw new Error("Feature not found");
      }
      module.features[featureKey].enabled = enabled;
      module.enabled = Object.values(module.features).some((f) => f.enabled);
      return updateRole(role._id || role.id!, { permissions });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Permission updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const roles = data?.roles || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage SUPER_ADMIN, STATE_HEAD, ASM, and R permission modules
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load roles"}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading roles...</p>
      ) : (
        <div className="space-y-6">
          {roles.map((role) => (
            <div
              key={role._id || role.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{role.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {role.description || "No description"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    role.isActive === false
                      ? "bg-muted text-muted-foreground"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {role.isActive === false ? "Inactive" : "Active"}
                </span>
              </div>

              <div className="space-y-4">
                {(role.permissions || []).map((module, moduleIndex) => (
                  <div key={module.moduleName} className="rounded-xl border border-border/70 p-4">
                    <h3 className="mb-3 text-sm font-semibold">{module.moduleName}</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(module.features || {}).map(([featureKey, feature]) => (
                        <label
                          key={featureKey}
                          className="flex items-start gap-3 rounded-lg bg-muted/30 px-3 py-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={Boolean(feature.enabled)}
                            disabled={toggleMutation.isPending || role.name === "SUPER_ADMIN"}
                            onChange={(e) =>
                              toggleMutation.mutate({
                                role,
                                moduleIndex,
                                featureKey,
                                enabled: e.target.checked,
                              })
                            }
                          />
                          <span>
                            <span className="font-medium">{featureKey}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {typeof feature.description === "object" &&
                              feature.description &&
                              "en" in (feature.description as object)
                                ? String((feature.description as { en: string }).en)
                                : typeof feature.description === "string"
                                  ? feature.description
                                  : ""}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
