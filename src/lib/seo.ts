/**
 * Lightweight SEO head manager for the SPA (no react-helmet dependency).
 *
 * - `usePageSeo(...)` — per-route title / description / keywords / canonical /
 *   Open Graph / JSON-LD. Each page owns its tags; they are replaced on route
 *   change so crawlers rendering JS (Googlebot, Bingbot) see unique metadata.
 * - `useGlobalSeo()` — fetches GET /public/seo/global once per session and
 *   injects the site-wide Organization / AutoDealer / WebSite JSON-LD plus the
 *   Google Search Console verification meta.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { publicGet } from "./api";

export const SITE_URL = "https://patliputravinfast.in";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageSeo = {
  title: string;
  description?: string;
  keywords?: string[];
  /** Canonical path (defaults to the current pathname). */
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  /** Page-scoped JSON-LD objects (schema.org). */
  schemas?: object[];
  noindex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string | null | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) {
    if (el && el.dataset.seoManaged === "true") el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.dataset.seoManaged = "true";
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** One <script type="application/ld+json"> per scope, replaced in-place. */
function setJsonLd(scope: "page" | "global", schemas: object[] | undefined) {
  const selector = `script[type="application/ld+json"][data-seo-scope="${scope}"]`;
  let el = document.head.querySelector<HTMLScriptElement>(selector);
  if (!schemas || schemas.length === 0) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.seoScope = scope;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}

export function applyPageSeo(seo: PageSeo, pathname: string) {
  document.title = seo.title;
  upsertMeta("name", "description", seo.description);
  upsertMeta("name", "keywords", seo.keywords?.length ? seo.keywords.join(", ") : undefined);
  upsertMeta("name", "robots", seo.noindex ? "noindex, nofollow" : "index, follow");

  const canonical = absoluteUrl(seo.canonicalPath ?? pathname);
  upsertCanonical(canonical);

  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:type", seo.ogType ?? "website");
  upsertMeta("property", "og:site_name", "Patliputra VinFast");
  if (seo.ogImage) upsertMeta("property", "og:image", seo.ogImage);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);
  if (seo.ogImage) upsertMeta("name", "twitter:image", seo.ogImage);

  setJsonLd("page", seo.schemas);
}

/**
 * Applies page SEO on mount and whenever the serialized config changes.
 * Call once near the top of every public page component.
 */
export function usePageSeo(seo: PageSeo) {
  const { pathname } = useLocation();
  const serialized = JSON.stringify(seo);
  useEffect(() => {
    applyPageSeo(JSON.parse(serialized) as PageSeo, pathname);
  }, [serialized, pathname]);
}

type GlobalSeoPayload = {
  siteUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  googleSiteVerification: string | null;
  schemas: object[];
};

let globalSeoLoaded = false;

/** Injects the site-wide JSON-LD + Search Console verification once. */
export function useGlobalSeo() {
  useEffect(() => {
    if (globalSeoLoaded) return;
    globalSeoLoaded = true;
    void publicGet<GlobalSeoPayload>("/public/seo/global").then((data) => {
      if (!data) return;
      setJsonLd("global", data.schemas ?? []);
      if (data.googleSiteVerification) {
        upsertMeta("name", "google-site-verification", data.googleSiteVerification);
      }
    });
  }, []);
}
