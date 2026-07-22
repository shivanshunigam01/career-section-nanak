import { Link, useParams } from "react-router-dom";
import SeoPageShell from "@/components/seo/SeoPageShell";
import { BLOG_POSTS, getBlogBySlug, type BlogCluster } from "@/data/seo/blogPosts";
import NotFound from "@/pages/NotFound";

const CLUSTER_LABELS: Record<BlogCluster, string> = {
  "ev-education": "EV Education",
  vf6: "VinFast VF6",
  vf7: "VinFast VF7",
  mpv7: "VinFast MPV7",
};

export function BlogIndexPage() {
  const clusters = (Object.keys(CLUSTER_LABELS) as BlogCluster[]).map((cluster) => ({
    cluster,
    label: CLUSTER_LABELS[cluster],
    posts: BLOG_POSTS.filter((p) => p.cluster === cluster),
  }));

  return (
    <SeoPageShell
      title="EV Blogs & Guides Bihar | Patliputra VinFast"
      description="Topic clusters on EV education, VinFast VF6, VF7 and MPV7 — buying guides, charging, ADAS and ownership for Bihar."
      path="/blogs"
      keywords={["VinFast blog", "EV guide Bihar", "Electric SUV articles", "VF6 VF7 MPV7"]}
      eyebrow="Insights"
      h1="EV Guides & VinFast Topic Clusters"
      lead="Educational content organised by cluster — not isolated articles — so you can research with confidence."
      ctaPrimary={{ label: "EV Buying Guide", to: "/ev-buying-guide" }}
      ctaSecondary={{ label: "FAQ", to: "/faq" }}
    >
      <div className="space-y-12">
        {clusters.map(({ cluster, label, posts }) => (
          <section key={cluster}>
            <h2 className="font-display font-bold text-2xl mb-4">{label}</h2>
            <div className="grid gap-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={post.path}
                  className="block rounded-xl border border-border/60 p-5 hover:border-primary/40 transition-colors"
                >
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                    {post.readMinutes} min read · {post.date}
                  </p>
                  <h3 className="font-display font-semibold text-lg mb-1">{post.h1}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.lead}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SeoPageShell>
  );
}

export function BlogPostPage() {
  const { slug = "" } = useParams();
  const post = getBlogBySlug(slug);
  if (!post) return <NotFound />;

  const related = BLOG_POSTS.filter((p) => p.cluster === post.cluster && p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.h1,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Patliputra VinFast" },
    publisher: { "@type": "Organization", name: "Patliputra VinFast" },
    mainEntityOfPage: `https://patliputravinfast.in${post.path}`,
  };

  return (
    <SeoPageShell
      title={post.title}
      description={post.description}
      path={post.path}
      keywords={post.keywords}
      eyebrow={post.clusterLabel}
      h1={post.h1}
      lead={post.lead}
      sections={post.sections}
      schemas={[articleSchema]}
      ctaPrimary={{ label: "Book Test Drive", to: "/test-drive" }}
      ctaSecondary={{ label: "More Articles", to: "/blogs" }}
    >
      {related.length > 0 ? (
        <section>
          <h2 className="font-display font-bold text-2xl mb-4">Related in {post.clusterLabel}</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={r.path} className="text-primary hover:underline">
                  {r.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </SeoPageShell>
  );
}
