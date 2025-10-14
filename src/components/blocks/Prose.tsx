import { PortableText } from "next-sanity";
import { PAGE_QUERYResult } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";

type ProseProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "prose" }
>;

export function Prose({ title, text, subhead, sidebar }: ProseProps) {
  return (
    <section className="container flex flex-col md:flex-row gap-16 md:gap-24 px-4 sm:px-6 md:px-8 xl:px-10 py-12 w-full">
      <div className="flex-3">
        <div className="flex flex-col gap-4">
          {/* Subhead */}
          <p className="font-sans text-base">{subhead}</p>

          {/* Main Heading */}
          {title ? (
            <h2 className="font-sans text-5xl md:text-6xl mb-0 leading-tight">
              {title}
            </h2>
          ) : null}

          {/* Text */}
          <article className="prose max-w-none prose-headings:font-normal">{text ? <PortableText value={text} /> : null}</article>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex-1 sticky top-8 self-start">
        <div className="flex flex-col">
          {sidebar && (
            <>
              <div className="relative w-full h-56 sm:64 md:h-48">
                {sidebar.image && (
                  <Image
                    className="object-cover rounded-t-md"
                    src={urlFor(sidebar.image).url()}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    alt=""
                  />
                )}
              </div>
              <div className="flex flex-col bg-neutral-100 p-8 rounded-b-md">
                {sidebar.heading && (
                  <p className="font-sans text-base mb-2">{sidebar.heading}</p>
                )}
                {sidebar.text && (
                  <p className="font-sans text-xl mb-8">{sidebar.text}</p>
                )}
                {sidebar.url && sidebar.buttonText && (
                  <Link
                    href={sidebar.url}
                    target={sidebar.newTab ? "_blank" : undefined}
                    rel={sidebar.newTab ? "noopener noreferrer" : undefined}
                  >
                    <Button size="sm" variant="secondary">
                      {sidebar.buttonText}
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
