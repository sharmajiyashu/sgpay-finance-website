export type CreatedByPerson = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  designation?: string;
  agentType?: string;
};

export function personLabel(
  person?: CreatedByPerson | string | null
): string {
  if (!person) return "—";
  if (typeof person === "string") return person;
  return (
    [person.firstName, person.lastName].filter(Boolean).join(" ").trim() ||
    person.email ||
    "—"
  );
}

export function createdByLabel(row: {
  createdBy?: CreatedByPerson | string | null;
  parentId?: CreatedByPerson | string | null;
  managedById?: CreatedByPerson | string | null;
}): string {
  const created = personLabel(row.createdBy);
  if (created !== "—") return created;
  const parent = personLabel(row.parentId);
  if (parent !== "—") return parent;
  return personLabel(row.managedById);
}
