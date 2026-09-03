import { publicGet, APP_API_PATHS } from "@/lib/public-api";
import type { Project } from "@/data/projects";

export interface ApiProperty {
  _id?: string;
  id?: string;
  slug: string;
  name: string;
  builder?: string;
  builderLogo?: string;
  city?: string;
  state?: string;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  projectType?: string;
  propertyType?: string;
  status?: string;
  reraNumber?: string;
  possessionDate?: string;
  launchDate?: string;
  configurations?: string[];
  areaRange?: string;
  priceRange?: string;
  startingPrice?: number;
  emi?: string;
  images?: string[];
  videos?: string[];
  masterPlan?: string;
  floorPlans?: string[];
  amenities?: string[];
  featured?: boolean;
  luxury?: boolean;
  landmark?: string;
  documentInfo?: string;
  builderDescription?: string;
}

const PLACEHOLDER_IMAGE = "/img/projects/carousel-1.jpg";

export function mapApiPropertyToProject(p: ApiProperty): Project {
  const images = (p.images || []).filter(Boolean);
  return {
    id: String(p.id || p._id || p.slug),
    slug: p.slug,
    name: p.name,
    builder: p.builder || "",
    builderLogo: p.builderLogo || "",
    city: p.city || "",
    state: p.state || "",
    location: p.location || "",
    address: p.address || "",
    latitude: p.latitude ?? 0,
    longitude: p.longitude ?? 0,
    projectType: p.projectType || "",
    propertyType: p.propertyType || "",
    status: p.status || "",
    reraNumber: p.reraNumber || "",
    possessionDate: p.possessionDate || "",
    launchDate: p.launchDate || "",
    configurations: p.configurations || [],
    areaRange: p.areaRange || "",
    priceRange: p.priceRange || "",
    startingPrice: p.startingPrice ?? 0,
    emi: p.emi || "",
    images: images.length ? images : [PLACEHOLDER_IMAGE],
    videos: p.videos || [],
    masterPlan: p.masterPlan,
    floorPlans: p.floorPlans || [],
    amenities: p.amenities || [],
    featured: Boolean(p.featured),
    luxury: Boolean(p.luxury),
    landmark: p.landmark,
    documentInfo: p.documentInfo,
    builderDescription: p.builderDescription,
  };
}

export async function fetchPublishedProperties(): Promise<Project[]> {
  const data = await publicGet<{ properties?: ApiProperty[] } | ApiProperty[]>(
    `${APP_API_PATHS.properties}?page=1&limit=100`
  );
  const list = Array.isArray(data) ? data : data.properties || [];
  return list.map(mapApiPropertyToProject);
}

export async function fetchPublishedPropertyBySlug(slug: string): Promise<Project | null> {
  try {
    const data = await publicGet<{ property: ApiProperty } | ApiProperty>(
      APP_API_PATHS.propertyBySlug(slug)
    );
    const property =
      data && typeof data === "object" && "property" in data ? data.property : (data as ApiProperty);
    if (!property?.slug) return null;
    return mapApiPropertyToProject(property);
  } catch {
    return null;
  }
}
