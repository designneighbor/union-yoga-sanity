import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity/types";
import { Button } from "@/components/Button";
import Link from "next/link";
import { stegaClean } from "next-sanity";

type SplitImageProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "splitImage" }
>;

export function SplitImage({
  title,
  text,
  image,
  orientation,
  button,
}: SplitImageProps) {
  return (
    <section
      className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12 gap-8 lg:gap-12 flex items-stretch lg:items-center flex-col lg:flex-row data-[orientation='imageRight']:lg:flex-row-reverse"
      data-orientation={stegaClean(orientation) || "imageLeft"}
    >
      <div className="flex-1 flex items-center">
        <div className="relative">
          {image ? (
            <Image
              className="rounded-md h-56 sm:64 md:h-72 lg:h-full object-cover"
              src={urlFor(image)
                .width(944)
                .height(600)
                .quality(80)
                .dpr(2)
                .auto("format")
                .url()}
              width={944}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              alt={image?.alt || "Union Yoga Split Image"}
            />
          ) : null}
        </div>
      </div>
      <div className="flex-1 flex items-center">
        <div className="w-full">

          {/* Title */}
          {title ? (
            <h2 className="font-sans text-3xl lg:text-4xl xl:text-5xl leading-tight mb-4">
              {title}
            </h2>
          ) : null}

          {/* Text */}
          <div className="font-sans text-lg sm:text-xl lg:text-2xl text-primary-950 leading-relaxed">
            {text ? <PortableText value={text} /> : null}
          </div>

          {/* Button */}
          {button?.text && button?.url && (
            <Link
              href={button.url}
              target={button.newTab ? "_blank" : undefined}
              rel={button.newTab ? "noopener noreferrer" : undefined}
            >
              <Button className="mt-6" variant="primary">{button.text}</Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
