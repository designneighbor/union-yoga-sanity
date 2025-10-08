import { PortableText } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity/types";

type HeroProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "hero" }
>;

export function Hero({ title, text, image }: HeroProps) {
  return (
    <section className="min-h-auto py-6 md:py-12 flex items-center justify-center bg-neutral-50">
      <div className="container px-4 sm:px-6 md:px-8 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-2 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Main Heading */}
            {title ? (
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl xl:text-7xl/19 text-primary-950 leading-tight fade-in-up delay-200">
                {title}
              </h1>
            ) : null}

            {/* Description */}
            <div className="font-sans text-lg sm:text-xl lg:text-2xl text-foreground text-primary-950 leading-relaxed max-w-2xl fade-in-up delay-300">
              {text ? <PortableText value={text} /> : null}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative order-1 lg:order-2 hidden md:block fade-in-up delay-500">
            <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
              {image ? (
                <Image
                  className="object-contain w-full h-full"
                  src={urlFor(image).url()}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  alt=""
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
