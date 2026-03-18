import DOMPurify from "isomorphic-dompurify";
import Image from "next/image"; // Importing the Image component from Next.js for optimized image rendering
import { getPage } from "@/lib/contentstack"; // Importing functions to get page data and initialize live preview from a local library
import {
  VB_EmptyBlockParentClass,
} from "@contentstack/live-preview-utils"; // Importing live preview utilities from Contentstack
import BlockComponent from "../components/BlockComponent";
import ShortFormComponent from "../components/ShortFormComponent";
import LongFormComponent from "../components/LongFormComponent";

const componentMap: { [key: string]: React.FC<any> } = {
  // ShortFormComponent,
  // LongFormComponent,
  BlockComponent,
};

export default async function ContentPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const fullSlug = resolvedParams.slug 
    ? `/${resolvedParams.slug.join("/")}` 
    : "/";

  const page = await getPage(fullSlug, resolvedSearchParams);
  if (!page) return <div>Page not found</div>;

  return (
    <main className="max-w-(--breakpoint-md) mx-auto">
      {/* Main container with max width and centered alignment */}
      <section className="p-4">
        {/* Section with padding */}
        {page?.title ? (
          <h1
            className="text-4xl font-bold mb-4 text-center"
            {...(page?.$ && page?.$.title)} // Adding editable tags if available
          >
            {page?.title} with Next{/* Rendering the page title */}
          </h1>
        ) : null}
        {page?.description ? (
          <p className="mb-4 text-center" {...(page?.$ && page?.$.description)}>
            {/* Adding editable tags if available */}
            {page?.description} {/* Rendering the page description */}
          </p>
        ) : null}
        {page?.image ? (
          <Image
            className="mb-4"
            width={768}
            height={414}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
            style={{
              width: '100%',
              height: 'auto',
            }}
            src={page?.image.url}
            alt={page?.image.title}
            {...(page?.image?.$ && page?.image?.$.url)} // Adding editable tags if available
          />
        ) : null}
        {page?.rich_text ? (
          <div
            {...(page?.$ && page?.$.rich_text)} // Adding editable tags if available
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(page?.rich_text),
            }} // Rendering rich text content as HTML
          />
        ) : null}
        <div
          className={`space-y-8 max-w-full mt-4 ${!page?.blocks || page.blocks.length === 0
            ? VB_EmptyBlockParentClass // Adding a class if no blocks are present
            : ""
            }`}
          {...(page?.$ && page?.$.blocks)} // Adding editable tags if available
        >
          {page?.blocks?.map((item, index) => {
            const Component = componentMap[item.type] || BlockComponent;
            return <Component key={index} {...item} />;
          })}
        </div>
      </section>
    </main>
  );
}
