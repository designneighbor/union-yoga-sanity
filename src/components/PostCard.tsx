import { Categories } from '@/components/Categories'
import { POSTS_QUERYResult } from '@/sanity/types'
import { PublishedAt } from '@/components/PublishedAt'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'

export function PostCard(props: POSTS_QUERYResult[0]) {
  const { title, author, mainImage, publishedAt, categories } = props

  return (
    <Link className="group relative w-full" href={`/blog/${props.slug!.current}`}>
      <article className="flex flex-col gap-4">

      {/* _ Main Image _ */}
      {mainImage ? (
      <figure className="relative rounded-md h-72 sm:h-56 overflow-hidden">
      <Image
            src={urlFor(mainImage).url()}
            className="rounded-md group-hover:scale-110 transition-transform duration-300 object-cover object-top"
            fill
            alt=""
          />
        </figure>
      ) : null}

        {/* Categories */}
        <Categories categories={categories} />
  
        {/* Title */}
        <span className="text-xl font-normal group-hover:text-neutral-600 transition-colors duration-200">{title}</span>
           
        {/* Metadata */}
        <div className="flex items-center text-sm text-neutral-600">
          <span className="">3 Min Read</span>
          <span className="mx-2 text-secondary-700">|</span>
          <PublishedAt publishedAt={publishedAt} />
        </div>

        </article>
    </Link>
  )
}