"use client";

import { useState } from "react";
import type { AdminProperty } from "@/sg-admin/lib/types/property";

export type PropertyFormValues = {
  name: string;
  slug: string;
  builder: string;
  builderLogo: string;
  city: string;
  state: string;
  location: string;
  address: string;
  latitude: string;
  longitude: string;
  projectType: string;
  propertyType: string;
  status: string;
  reraNumber: string;
  possessionDate: string;
  launchDate: string;
  configurations: string;
  areaRange: string;
  priceRange: string;
  startingPrice: string;
  emi: string;
  images: string;
  videos: string;
  masterPlan: string;
  floorPlans: string;
  amenities: string;
  featured: boolean;
  luxury: boolean;
  landmark: string;
  documentInfo: string;
  builderDescription: string;
  isPublished: boolean;
  isActive: boolean;
};

export function emptyPropertyForm(): PropertyFormValues {
  return {
    name: "",
    slug: "",
    builder: "",
    builderLogo: "",
    city: "",
    state: "",
    location: "",
    address: "",
    latitude: "",
    longitude: "",
    projectType: "Residential",
    propertyType: "",
    status: "Upcoming",
    reraNumber: "",
    possessionDate: "",
    launchDate: "",
    configurations: "",
    areaRange: "",
    priceRange: "",
    startingPrice: "",
    emi: "",
    images: "",
    videos: "",
    masterPlan: "",
    floorPlans: "",
    amenities: "",
    featured: false,
    luxury: false,
    landmark: "",
    documentInfo: "",
    builderDescription: "",
    isPublished: true,
    isActive: true,
  };
}

export function propertyToForm(p: AdminProperty): PropertyFormValues {
  return {
    name: p.name || "",
    slug: p.slug || "",
    builder: p.builder || "",
    builderLogo: p.builderLogo || "",
    city: p.city || "",
    state: p.state || "",
    location: p.location || "",
    address: p.address || "",
    latitude: p.latitude != null ? String(p.latitude) : "",
    longitude: p.longitude != null ? String(p.longitude) : "",
    projectType: p.projectType || "Residential",
    propertyType: p.propertyType || "",
    status: p.status || "Upcoming",
    reraNumber: p.reraNumber || "",
    possessionDate: p.possessionDate || "",
    launchDate: p.launchDate || "",
    configurations: (p.configurations || []).join(", "),
    areaRange: p.areaRange || "",
    priceRange: p.priceRange || "",
    startingPrice: p.startingPrice != null ? String(p.startingPrice) : "",
    emi: p.emi || "",
    images: (p.images || []).join("\n"),
    videos: (p.videos || []).join("\n"),
    masterPlan: p.masterPlan || "",
    floorPlans: (p.floorPlans || []).join("\n"),
    amenities: (p.amenities || []).join(", "),
    featured: Boolean(p.featured),
    luxury: Boolean(p.luxury),
    landmark: p.landmark || "",
    documentInfo: p.documentInfo || "",
    builderDescription: p.builderDescription || "",
    isPublished: p.isPublished !== false,
    isActive: p.isActive !== false,
  };
}

function splitList(value: string, multiline = false): string[] {
  const parts = multiline ? value.split(/[\n,]+/) : value.split(",");
  return parts.map((s) => s.trim()).filter(Boolean);
}

export function formToPayload(form: PropertyFormValues) {
  return {
    name: form.name.trim(),
    slug: form.slug.trim() || undefined,
    builder: form.builder.trim(),
    builderLogo: form.builderLogo.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    location: form.location.trim(),
    address: form.address.trim(),
    latitude: form.latitude ? Number(form.latitude) : 0,
    longitude: form.longitude ? Number(form.longitude) : 0,
    projectType: form.projectType.trim(),
    propertyType: form.propertyType.trim(),
    status: form.status.trim(),
    reraNumber: form.reraNumber.trim(),
    possessionDate: form.possessionDate.trim(),
    launchDate: form.launchDate.trim(),
    configurations: splitList(form.configurations),
    areaRange: form.areaRange.trim(),
    priceRange: form.priceRange.trim(),
    startingPrice: form.startingPrice ? Number(form.startingPrice) : 0,
    emi: form.emi.trim(),
    images: splitList(form.images, true),
    videos: splitList(form.videos, true),
    masterPlan: form.masterPlan.trim(),
    floorPlans: splitList(form.floorPlans, true),
    amenities: splitList(form.amenities),
    featured: form.featured,
    luxury: form.luxury,
    landmark: form.landmark.trim(),
    documentInfo: form.documentInfo.trim(),
    builderDescription: form.builderDescription.trim(),
    isPublished: form.isPublished,
    isActive: form.isActive,
  };
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm";

export function PropertyForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial?: PropertyFormValues;
  submitLabel: string;
  pending?: boolean;
  onSubmit: (values: PropertyFormValues) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<PropertyFormValues>(initial ?? emptyPropertyForm());

  const set = <K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field label="Name *">
        <input className={inputClass} required value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="Slug (optional)">
        <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" />
      </Field>
      <Field label="Builder">
        <input className={inputClass} value={form.builder} onChange={(e) => set("builder", e.target.value)} />
      </Field>
      <Field label="Builder logo URL">
        <input className={inputClass} value={form.builderLogo} onChange={(e) => set("builderLogo", e.target.value)} />
      </Field>
      <Field label="City">
        <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} />
      </Field>
      <Field label="State">
        <input className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value)} />
      </Field>
      <Field label="Location">
        <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} />
      </Field>
      <Field label="Address" className="sm:col-span-2">
        <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} />
      </Field>
      <Field label="Project type">
        <select className={inputClass} value={form.projectType} onChange={(e) => set("projectType", e.target.value)}>
          <option>Residential</option>
          <option>Commercial</option>
        </select>
      </Field>
      <Field label="Property type">
        <input className={inputClass} value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)} placeholder="Villa, Plot, Apartment..." />
      </Field>
      <Field label="Status">
        <input className={inputClass} value={form.status} onChange={(e) => set("status", e.target.value)} />
      </Field>
      <Field label="RERA number">
        <input className={inputClass} value={form.reraNumber} onChange={(e) => set("reraNumber", e.target.value)} />
      </Field>
      <Field label="Launch date">
        <input className={inputClass} type="date" value={form.launchDate} onChange={(e) => set("launchDate", e.target.value)} />
      </Field>
      <Field label="Possession date">
        <input className={inputClass} type="date" value={form.possessionDate} onChange={(e) => set("possessionDate", e.target.value)} />
      </Field>
      <Field label="Price range">
        <input className={inputClass} value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} />
      </Field>
      <Field label="Starting price">
        <input className={inputClass} type="number" value={form.startingPrice} onChange={(e) => set("startingPrice", e.target.value)} />
      </Field>
      <Field label="Area range">
        <input className={inputClass} value={form.areaRange} onChange={(e) => set("areaRange", e.target.value)} />
      </Field>
      <Field label="EMI">
        <input className={inputClass} value={form.emi} onChange={(e) => set("emi", e.target.value)} />
      </Field>
      <Field label="Latitude">
        <input className={inputClass} value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
      </Field>
      <Field label="Longitude">
        <input className={inputClass} value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
      </Field>
      <Field label="Configurations (comma separated)" className="sm:col-span-2">
        <input className={inputClass} value={form.configurations} onChange={(e) => set("configurations", e.target.value)} placeholder="2 BHK, 3 BHK" />
      </Field>
      <Field label="Amenities (comma separated)" className="sm:col-span-2">
        <input className={inputClass} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} />
      </Field>
      <Field label="Image URLs (one per line)" className="sm:col-span-2">
        <textarea className={`${inputClass} min-h-24`} value={form.images} onChange={(e) => set("images", e.target.value)} />
      </Field>
      <Field label="Video URLs (one per line)" className="sm:col-span-2">
        <textarea className={`${inputClass} min-h-20`} value={form.videos} onChange={(e) => set("videos", e.target.value)} />
      </Field>
      <Field label="Master plan URL">
        <input className={inputClass} value={form.masterPlan} onChange={(e) => set("masterPlan", e.target.value)} />
      </Field>
      <Field label="Landmark">
        <input className={inputClass} value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
      </Field>
      <Field label="Floor plan URLs (one per line)" className="sm:col-span-2">
        <textarea className={`${inputClass} min-h-20`} value={form.floorPlans} onChange={(e) => set("floorPlans", e.target.value)} />
      </Field>
      <Field label="Document info" className="sm:col-span-2">
        <input className={inputClass} value={form.documentInfo} onChange={(e) => set("documentInfo", e.target.value)} />
      </Field>
      <Field label="Builder description" className="sm:col-span-2">
        <textarea className={`${inputClass} min-h-24`} value={form.builderDescription} onChange={(e) => set("builderDescription", e.target.value)} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        Featured
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.luxury} onChange={(e) => set("luxury", e.target.checked)} />
        Luxury
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} />
        Published (visible on website)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
        Active
      </label>
      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2.5 text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
