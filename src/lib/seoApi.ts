import { publicGet } from "@/lib/api";

export type SeoDistrict = { name: string; slug: string };

export type SeoModelSummary = {
  key: string;
  slug: string;
  name: string;
  shortName: string;
  bodyType: string;
  seats: number;
  variants: string[];
};

export type SeoFaq = { question: string; answer: string };

export type SeoSection = { heading: string; body: string };

export type DistrictPagePayload = {
  districtSlug: string;
  districtName: string;
  modelKey: string;
  modelName: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: SeoSection[];
  keywords: string[];
  faqs: SeoFaq[];
  canonicalUrl?: string;
  schemas?: Record<string, unknown>[];
};

export type GlobalSeoPayload = {
  siteUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  googleSiteVerification: string | null;
  schemas: Record<string, unknown>[];
};

export type DistrictPageListItem = {
  path: string;
  districtSlug: string;
  districtName: string;
  modelKey: string;
  modelName: string;
  metaTitle: string;
};

export function fetchGlobalSeo() {
  return publicGet<GlobalSeoPayload>("/public/seo/global");
}

export function fetchSeoDistricts() {
  return publicGet<SeoDistrict[]>("/public/seo/districts");
}

export function fetchSeoModels() {
  return publicGet<SeoModelSummary[]>("/public/seo/models");
}

export function fetchDistrictPage(districtSlug: string, modelSlug: string) {
  return publicGet<DistrictPagePayload>(
    `/public/seo/district-pages/${encodeURIComponent(districtSlug)}/${encodeURIComponent(modelSlug)}`
  );
}

export function fetchDistrictPageList(params?: { district?: string; model?: string }) {
  const q = new URLSearchParams();
  if (params?.district) q.set("district", params.district);
  if (params?.model) q.set("model", params.model);
  const qs = q.toString();
  return publicGet<DistrictPageListItem[]>(`/public/seo/district-pages${qs ? `?${qs}` : ""}`);
}
