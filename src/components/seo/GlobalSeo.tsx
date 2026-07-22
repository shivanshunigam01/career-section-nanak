import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { fetchGlobalSeo, type GlobalSeoPayload } from "@/lib/seoApi";

/** Loads site-wide Organization / AutoDealer / WebSite JSON-LD once. */
export default function GlobalSeo() {
  const [seo, setSeo] = useState<GlobalSeoPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchGlobalSeo().then((data) => {
      if (!cancelled && data) setSeo(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!seo) return null;

  return (
    <Helmet>
      {seo.googleSiteVerification ? (
        <meta name="google-site-verification" content={seo.googleSiteVerification} />
      ) : null}
      {seo.schemas?.map((schema, i) => (
        <script key={`global-schema-${i}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
