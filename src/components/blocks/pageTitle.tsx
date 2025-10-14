import { PAGE_QUERYResult } from "@/sanity/types";

type PageTitleProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "pageTitle" }
>;

export function PageTitle({ subhead, title, text }: PageTitleProps) {
  return (
    <section className="bg-neutral-50">
      <div className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12 w-full">
        <div className="w-full md:w-4/5 lg:w-3/5 flex flex-col">
          {/* Subhead */}
          <p className="font-sans text-base text-neutral-700 uppercase tracking-wider">{subhead}</p>

          {/* Main Heading */}
          {title ? (
            <h1 className="font-sans text-3xl lg:text-4xl xl:text-5xl text-primary-950 mb-4 leading-[1.2]">
              {title}
            </h1>
          ) : null}

          {/* Text */}
          <p className="font-sans text-xl text-neutral-700">{text}</p>
        </div>
      </div>
    </section>
  );
}
