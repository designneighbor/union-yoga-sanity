import Image from "next/image";
import { PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

export const components: PortableTextComponents = {
  types: {
    image: (props) =>
      props.value ? (
        <figure className="relative rounded-md">
          <Image
            src={urlFor(props.value).width(944).height(400).quality(80).dpr(2).auto("format").url()}
            className="rounded-md"
            width={944} 
            height={400} 
            sizes="(max-width: 600px) 90vw, (min-width: 600px) 60vw, 500px"
            quality={80}
            alt={props?.value?.alt || ""}
          />
        </figure>
      ) : null,
  },
};