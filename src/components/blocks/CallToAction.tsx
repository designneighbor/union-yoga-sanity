import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity/types";
import { Button } from "@/components/Button";
import Link from "next/link";

type CallToActionProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "callToAction" }
>;

export function CallToAction({
  title,
  text,
  button,
  image,
}: CallToActionProps) {
  return (
    <section className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12">
      <div className="bg-neutral-100">
        <div className="flex flex-col md:flex-row">
          {/* Text Content - Left Column */}
          <div className="flex-1 flex px-8 lg:px-12 py-8 lg:py-12 flex-col gap-6 lg:gap-0 lg:place-content-between">
            <div className="">
              {/* Title */}
              {title ? (
                <h2 className="font-sans text-base mb-2">{title}</h2>
              ) : null}

              {/* Text Content */}
              {text ? (
                <div className="font-sans text-xl lg:text-2xl text-primary-950 leading-relaxed">
                  <PortableText value={text} />
                </div>
              ) : null}
            </div>

            <div>
              {/* Button */}
              {button?.text && button?.url && (
                <div className="pt-2">
                  <Link
                    href={button.url}
                    target={button.newTab ? "_blank" : undefined}
                    rel={button.newTab ? "noopener noreferrer" : undefined}
                    aria-label={
                      button.newTab
                        ? `${button.text} (opens in new tab)`
                        : undefined
                    }
                  >
                    <Button
                      variant="secondary"
                      className="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      {button.text}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Image - Right Column */}
          {image && (
            <div className="flex-1">
              <div className="relative w-full h-56 sm:64 md:h-80">
                <Image
                  className="object-cover"
                  src={urlFor(image)
                    .width(944)
                    .height(600)
                    .quality(80)
                    .dpr(2)
                    .auto("format")
                    .url()}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  alt={image?.alt || "Union Yoga Call to Action Image"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
