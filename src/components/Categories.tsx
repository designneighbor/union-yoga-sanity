import { POST_QUERYResult } from '@/sanity/types'

type CategoriesProps = {
  categories: NonNullable<POST_QUERYResult>['categories']
}

export function Categories({ categories }: CategoriesProps) {
  return categories.map((category) => (
    <span
      key={category._id}
      className="bg-neutral-200 px-2 py-1 text-sm rounded w-min leading-none whitespace-nowrap font-normal text-neutral-950 border border-neutral-700">
      {category.title}
    </span>
  ))
}