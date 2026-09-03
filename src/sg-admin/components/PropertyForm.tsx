"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { IconPhoto, IconTrash, IconUpload, IconVideo } from "@tabler/icons-react";
import type { AdminProperty } from "@/sg-admin/lib/types/property";
import { uploadPropertyMedia } from "@/sg-admin/lib/services/propertyService";

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
  images: string[];
  videos: string[];
  masterPlan: string;
  floorPlans: string[];
  amenities: string;
  featured: boolean;
  luxury: boolean;
  landmark: string;
  documentInfo: string;
  builderDescription: string;
  isPublished: boolean;
  isActive: boolean;
};

const STEPS = [
  { id: 1, title: "Basic details" },
  { id: 2, title: "Location & price" },
  { id: 3, title: "Specifications" },
  { id: 4, title: "Gallery & media" },
  { id: 5, title: "Publish" },
] as const;

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
    images: [],
    videos: [],
    masterPlan: "",
    floorPlans: [],
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
    ...emptyPropertyForm(),
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
    possessionDate: (p.possessionDate || "").slice(0, 10),
    launchDate: (p.launchDate || "").slice(0, 10),
    configurations: (p.configurations || []).join(", "),
    areaRange: p.areaRange || "",
    priceRange: p.priceRange || "",
    startingPrice: p.startingPrice != null ? String(p.startingPrice) : "",
    emi: p.emi || "",
    images: p.images || [],
    videos: p.videos || [],
    masterPlan: p.masterPlan || "",
    floorPlans: p.floorPlans || [],
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

function splitList(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
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
    images: form.images,
    videos: form.videos,
    masterPlan: form.masterPlan.trim(),
    floorPlans: form.floorPlans,
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

function MediaGrid({
  urls,
  kind,
  onRemove,
}: {
  urls: string[];
  kind: "image" | "video";
  onRemove: (index: number) => void;
}) {
  if (!urls.length) {
    return <p className="text-sm text-muted-foreground">No files uploaded yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {urls.map((url, index) => (
        <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-xl border border-border bg-muted/30">
          {kind === "video" ? (
            <video src={url} className="h-28 w-full object-cover" controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-28 w-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
            aria-label="Remove"
          >
            <IconTrash size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

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
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState<string | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const masterRef = useRef<HTMLInputElement>(null);
  const floorRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function uploadField(field: "images" | "videos" | "floorPlans" | "builderLogo" | "masterPlan", files: FileList | null) {
    if (!files?.length) return;
    const fd = new FormData();
    for (const file of Array.from(files)) {
      fd.append(field, file);
    }
    setUploading(field);
    try {
      const result = await uploadPropertyMedia(fd);
      setForm((prev) => {
        if (field === "images") return { ...prev, images: [...prev.images, ...result.images] };
        if (field === "videos") return { ...prev, videos: [...prev.videos, ...result.videos] };
        if (field === "floorPlans") return { ...prev, floorPlans: [...prev.floorPlans, ...result.floorPlans] };
        if (field === "builderLogo" && result.builderLogo) return { ...prev, builderLogo: result.builderLogo };
        if (field === "masterPlan" && result.masterPlan) return { ...prev, masterPlan: result.masterPlan };
        return prev;
      });
      toast.success("Uploaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function goNext() {
    if (step === 1 && form.name.trim().length < 2) {
      toast.error("Property name is required");
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  }

  return (
    <div className="space-y-6">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {STEPS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                if (item.id > 1 && form.name.trim().length < 2) {
                  toast.error("Property name is required");
                  return;
                }
                setStep(item.id);
              }}
              className={`w-full rounded-xl border px-2 py-2 text-left text-xs sm:text-sm ${
                step === item.id
                  ? "border-primary bg-primary/10 font-semibold text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wide">Step {item.id}</span>
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 sm:grid-cols-2">
        {step === 1 && (
          <>
            <Field label="Name *">
              <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Slug (optional)">
              <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" />
            </Field>
            <Field label="Builder">
              <input className={inputClass} value={form.builder} onChange={(e) => set("builder", e.target.value)} />
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
            <Field label="RERA number" className="sm:col-span-2">
              <input className={inputClass} value={form.reraNumber} onChange={(e) => set("reraNumber", e.target.value)} />
            </Field>
            <Field label="Builder logo" className="sm:col-span-2">
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadField("builderLogo", e.target.files)} />
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => logoRef.current?.click()} disabled={uploading === "builderLogo"} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                  <IconUpload size={16} />
                  {uploading === "builderLogo" ? "Uploading..." : "Upload logo"}
                </button>
                {form.builderLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.builderLogo} alt="Builder logo" className="h-12 rounded-md border border-border object-contain" />
                ) : null}
              </div>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="City">
              <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="State">
              <input className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value)} />
            </Field>
            <Field label="Location">
              <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Landmark">
              <input className={inputClass} value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="Latitude">
              <input className={inputClass} value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
            </Field>
            <Field label="Longitude">
              <input className={inputClass} value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
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
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Launch date">
              <input className={inputClass} type="date" value={form.launchDate} onChange={(e) => set("launchDate", e.target.value)} />
            </Field>
            <Field label="Possession date">
              <input className={inputClass} type="date" value={form.possessionDate} onChange={(e) => set("possessionDate", e.target.value)} />
            </Field>
            <Field label="Configurations (comma separated)" className="sm:col-span-2">
              <input className={inputClass} value={form.configurations} onChange={(e) => set("configurations", e.target.value)} placeholder="2 BHK, 3 BHK" />
            </Field>
            <Field label="Amenities (comma separated)" className="sm:col-span-2">
              <input className={inputClass} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} />
            </Field>
            <Field label="Document info" className="sm:col-span-2">
              <input className={inputClass} value={form.documentInfo} onChange={(e) => set("documentInfo", e.target.value)} />
            </Field>
            <Field label="Builder description" className="sm:col-span-2">
              <textarea className={`${inputClass} min-h-24`} value={form.builderDescription} onChange={(e) => set("builderDescription", e.target.value)} />
            </Field>
          </>
        )}

        {step === 4 && (
          <div className="space-y-6 sm:col-span-2">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconPhoto size={16} /> Gallery images (multiple)
                </h3>
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  disabled={uploading === "images"}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  <IconUpload size={16} />
                  {uploading === "images" ? "Uploading..." : "Upload images"}
                </button>
              </div>
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  uploadField("images", e.target.files);
                  e.target.value = "";
                }}
              />
              <MediaGrid urls={form.images} kind="image" onRemove={(i) => set("images", form.images.filter((_, idx) => idx !== i))} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">Floor plans</h3>
                <button type="button" onClick={() => floorRef.current?.click()} disabled={uploading === "floorPlans"} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                  <IconUpload size={16} />
                  {uploading === "floorPlans" ? "Uploading..." : "Upload plans"}
                </button>
              </div>
              <input
                ref={floorRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  uploadField("floorPlans", e.target.files);
                  e.target.value = "";
                }}
              />
              <MediaGrid urls={form.floorPlans} kind="image" onRemove={(i) => set("floorPlans", form.floorPlans.filter((_, idx) => idx !== i))} />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">Master plan</h3>
                <button type="button" onClick={() => masterRef.current?.click()} disabled={uploading === "masterPlan"} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                  <IconUpload size={16} />
                  {uploading === "masterPlan" ? "Uploading..." : "Upload master plan"}
                </button>
              </div>
              <input
                ref={masterRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  uploadField("masterPlan", e.target.files);
                  e.target.value = "";
                }}
              />
              {form.masterPlan ? (
                <MediaGrid urls={[form.masterPlan]} kind="image" onRemove={() => set("masterPlan", "")} />
              ) : (
                <p className="text-sm text-muted-foreground">No master plan uploaded.</p>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconVideo size={16} /> Videos (multiple)
                </h3>
                <button type="button" onClick={() => videoRef.current?.click()} disabled={uploading === "videos"} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                  <IconUpload size={16} />
                  {uploading === "videos" ? "Uploading..." : "Upload videos"}
                </button>
              </div>
              <input
                ref={videoRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  uploadField("videos", e.target.files);
                  e.target.value = "";
                }}
              />
              <MediaGrid urls={form.videos} kind="video" onRemove={(i) => set("videos", form.videos.filter((_, idx) => idx !== i))} />
            </section>
          </div>
        )}

        {step === 5 && (
          <>
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
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm sm:col-span-2">
              <p className="font-semibold">{form.name || "Untitled property"}</p>
              <p className="mt-1 text-muted-foreground">
                {form.city || "No city"} · {form.images.length} gallery image{form.images.length === 1 ? "" : "s"} · {form.videos.length} video{form.videos.length === 1 ? "" : "s"}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2.5 text-sm">
              Cancel
            </button>
          )}
          {step > 1 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-xl border border-border px-4 py-2.5 text-sm">
              Back
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {step < 5 ? (
            <button type="button" onClick={goNext} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={pending || Boolean(uploading)}
              onClick={() => onSubmit(form)}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Saving..." : submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
