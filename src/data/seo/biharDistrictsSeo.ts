/** 38 Bihar districts with URL slugs — mirrors backend `biharDistricts.js`. */
export const BIHAR_DISTRICTS_SEO = [
  { name: "Araria", slug: "araria" },
  { name: "Arwal", slug: "arwal" },
  { name: "Aurangabad", slug: "aurangabad" },
  { name: "Banka", slug: "banka" },
  { name: "Begusarai", slug: "begusarai" },
  { name: "Bhagalpur", slug: "bhagalpur" },
  { name: "Bhojpur", slug: "bhojpur" },
  { name: "Buxar", slug: "buxar" },
  { name: "Darbhanga", slug: "darbhanga" },
  { name: "East Champaran", slug: "east-champaran" },
  { name: "Gaya", slug: "gaya" },
  { name: "Gopalganj", slug: "gopalganj" },
  { name: "Jamui", slug: "jamui" },
  { name: "Jehanabad", slug: "jehanabad" },
  { name: "Kaimur", slug: "kaimur" },
  { name: "Katihar", slug: "katihar" },
  { name: "Khagaria", slug: "khagaria" },
  { name: "Kishanganj", slug: "kishanganj" },
  { name: "Lakhisarai", slug: "lakhisarai" },
  { name: "Madhepura", slug: "madhepura" },
  { name: "Madhubani", slug: "madhubani" },
  { name: "Munger", slug: "munger" },
  { name: "Muzaffarpur", slug: "muzaffarpur" },
  { name: "Nalanda", slug: "nalanda" },
  { name: "Nawada", slug: "nawada" },
  { name: "Patna", slug: "patna" },
  { name: "Purnia", slug: "purnia" },
  { name: "Rohtas", slug: "rohtas" },
  { name: "Saharsa", slug: "saharsa" },
  { name: "Samastipur", slug: "samastipur" },
  { name: "Saran", slug: "saran" },
  { name: "Sheikhpura", slug: "sheikhpura" },
  { name: "Sheohar", slug: "sheohar" },
  { name: "Sitamarhi", slug: "sitamarhi" },
  { name: "Siwan", slug: "siwan" },
  { name: "Supaul", slug: "supaul" },
  { name: "Vaishali", slug: "vaishali" },
  { name: "West Champaran", slug: "west-champaran" },
] as const;

export const SEO_MODEL_SLUGS = [
  "vinfast-vf6",
  "vinfast-vf7",
  "vinfast-mpv7",
  "vinfast-limo-green",
] as const;

export type SeoModelSlug = (typeof SEO_MODEL_SLUGS)[number];

export const SEO_MODEL_ROUTE_MAP: Record<SeoModelSlug, string> = {
  "vinfast-vf6": "/models/vf6",
  "vinfast-vf7": "/models/vf7",
  "vinfast-mpv7": "/models/mpv7",
  "vinfast-limo-green": "/models/limo-green",
};

export const SEO_MODEL_LABELS: Record<SeoModelSlug, string> = {
  "vinfast-vf6": "VinFast VF6",
  "vinfast-vf7": "VinFast VF7",
  "vinfast-mpv7": "VinFast VF MPV7",
  "vinfast-limo-green": "VinFast Limo Green",
};

const districtSlugSet = new Set(BIHAR_DISTRICTS_SEO.map((d) => d.slug));
const modelSlugSet = new Set<string>(SEO_MODEL_SLUGS);

export function isSeoDistrictSlug(slug: string) {
  return districtSlugSet.has(slug as (typeof BIHAR_DISTRICTS_SEO)[number]["slug"]);
}

export function isSeoModelSlug(slug: string): slug is SeoModelSlug {
  return modelSlugSet.has(slug);
}

export function getDistrictName(slug: string) {
  return BIHAR_DISTRICTS_SEO.find((d) => d.slug === slug)?.name ?? slug;
}
