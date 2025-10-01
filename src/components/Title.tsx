import { PropsWithChildren } from 'react'

export function Title(props: PropsWithChildren) {
  return (
    <h1 className="text-2xl md:text-4xl lg:text-6xl mb-6 font-normal text-primary-950 text-pretty">
      {props.children}
    </h1>
  )
}