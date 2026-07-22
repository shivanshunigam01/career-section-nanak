import { Navigate, useLocation } from "react-router-dom";
import SeoPageShell from "@/components/seo/SeoPageShell";
import { getSeoStaticPage } from "@/data/seo/seoStaticPages";

/** Renders a static SEO content page matched by current path. */
export default function SeoStaticContentPage() {
  const { pathname } = useLocation();
  const page = getSeoStaticPage(pathname);
  if (!page) return <Navigate to="/" replace />;

  return (
    <SeoPageShell
      title={page.title}
      description={page.description}
      path={page.path}
      keywords={page.keywords}
      eyebrow={page.eyebrow}
      h1={page.h1}
      lead={page.lead}
      sections={page.sections}
      faqs={page.faqs}
    />
  );
}
