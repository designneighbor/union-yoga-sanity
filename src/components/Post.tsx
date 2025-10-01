import { Author } from "@/components/Author";
import { Categories } from "@/components/Categories";
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { POST_QUERYResult } from "@/sanity/types";
import { PublishedAt } from "@/components/PublishedAt";
import { Title } from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export function Post(props: NonNullable<POST_QUERYResult>) {
  const { title, author, mainImage, body, publishedAt, categories } = props;

  return (
    <article className="flex flex-col gap-4">
     
        <Categories categories={categories}/>
       
        <Title>{title}</Title>

        {/* Metadata */}
        <div className="flex items-center mb-6">
            <span className="">3 Min Read</span>
            <span className="mx-2 text-secondary-700">|</span>
            <PublishedAt publishedAt={publishedAt} />
        </div>
     
      {mainImage ? (
        <figure className="rounded-md">
          <Image
            src={urlFor(mainImage).width(944).height(500).quality(80).dpr(2).auto("format").url()}
            className="rounded-md"
            width={944} 
            height={500} 
            sizes="(max-width: 600px) 90vw, (min-width: 600px) 60vw, 500px"
            quality={80}
            alt=""
          />
        </figure>
      ) : null}
      {body ? (
        <div className="prose lg:prose-lg max-w-none prose-headings:font-medium">
          <PortableText value={body} components={components} />
        </div>
      ) : null}
    </article>
  );
}