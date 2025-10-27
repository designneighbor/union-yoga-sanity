import { PAGE_QUERYResult } from "@/sanity/types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type PageTitleProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "pageTitle" }
>;

export function PageTitle({ subhead, title, text, image }: PageTitleProps) {
  return (
    <section className="bg-linear-to-b from-neutral-50 to-white">
      <div className="container px-4 sm:px-6 md:px-8 xl:px-10 py-6 md:py-12 w-full flex flex-col flex-col-reverse md:flex-row items-center gap-6">
        <div className="flex-1">
          {/* Subhead */}
          <p className="font-sans text-base text-neutral-700 uppercase tracking-wider">
            {subhead}
          </p>

          {/* Main Heading */}
          {title ? (
            <h1 className="font-sans text-3xl lg:text-4xl xl:text-5xl text-primary-950 mb-4 leading-[1.2]">
              {title}
            </h1>
          ) : null}

          {/* Text */}
          <p className="font-sans text-xl text-neutral-700">{text}</p>
        </div>

        <div className="flex-1">
          <div className="relative fade-in-up delay-100">
            {image ? (
              <Image
                className="rounded-md h-64 md:h-72 lg:h-full object-cover"
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
                alt=""
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
