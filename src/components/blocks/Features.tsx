import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity/types";

type FeaturesProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "features" }
>;

export function Features({ features, }: FeaturesProps) {
  return (
    <section className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12">
      

     

      {Array.isArray(features) ? (
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature._key} className="group relative bg-background rounded-md overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
              {/* Image Container */}
              <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-md">
                {feature.image ? (
                  <Image
                    className="object-top object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    src={urlFor(feature.image).width(350).height(400).quality(80).dpr(2).auto("format").url()}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    alt=""
                  />
                ) : null}
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-100 transition-opacity duration-300" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-sans text-lg sm:text-xl md:text-2xl font-normal mb-2 leading-tight">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed hidden">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}