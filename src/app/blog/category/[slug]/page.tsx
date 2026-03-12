import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory } from "@/lib/mdx";
import { categories, getCategoryBySlug } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import Breadcrumb from "@/components/Breadcrumb";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: {
      canonical: `/blog/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(category.folderName).filter(
    (p) => !p.noindex
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb category={category} />

      {/* Category Header */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span
            className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${category.color}15` }}
          >
            {category.icon}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              {category.name}
            </h1>
            <p className="text-[var(--color-text-light)]">
              {category.description}
            </p>
          </div>
        </div>
        <p className="text-[var(--color-text-light)] leading-relaxed">
          {category.longDescription}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {category.keyTopics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-light)]"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">{category.icon}</p>
          <p className="text-[var(--color-text-light)] text-lg">
            아직 작성된 글이 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
