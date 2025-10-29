import { Hero } from "@/components/blocks/Hero";
import { Features } from "@/components/blocks/Features";
import { SplitImage } from "@/components/blocks/SplitImage";
import { FAQs } from "@/components/blocks/FAQs";
import { Prose } from "@/components/blocks/Prose";
import { PageTitle } from "@/components/blocks/pageTitle";
import { CallToAction } from "@/components/blocks/CallToAction";
import { Testimonials } from "@/components/blocks/Testimonials";
import { Form } from "@/components/blocks/Form";
import { Video } from "@/components/blocks/Video";
import { PAGE_QUERYResult } from "@/sanity/types";

type PageBuilderProps = {
  content: NonNullable<PAGE_QUERYResult>["content"];
};

export function PageBuilder({ content }: PageBuilderProps) {
  if (!Array.isArray(content)) {
    return null;
  }

  return (
    <main>
      {content.map((block, index) => {
        switch (block._type) {
          case "hero":
            return <Hero key={block._key} {...block} />;
          case "features":
            return <Features key={block._key} {...block} />;
          case "splitImage":
            return <SplitImage key={block._key} {...block} />;
          case "faqs":
            return <FAQs key={block._key} {...block} />;
          case "callToAction":
            return <CallToAction key={block._key} {...block} />;
          case "prose":
            return <Prose key={block._key} {...block} />;
          case "testimonials":
            return <Testimonials key={block._key} {...block} />;
          case "pageTitle":
            return <PageTitle key={block._key} {...block} />;
          case "formBlock":
            return block.form ? <Form key={block._key} form={block.form} /> : null;
          case "video":
            return <Video key={block._key} {...block} />;
          default:
            // This is a fallback for when we don't have a block type
            return (
              <div key={`unknown-${index}`}>
                Block not found: {String((block as { _type: string })._type)}
              </div>
            );
        }
      })}
    </main>
  );
}
