"use client";

import { PAGE_QUERYResult } from "@/sanity/types";
import { PortableText } from "next-sanity";
import { useState } from "react";

type FAQsProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "faqs" }
>;

export function FAQs({ _key, title, faqs }: FAQsProps) {
  const [openFaqs, setOpenFaqs] = useState<Set<string>>(new Set());

  const toggleFaq = (faqId: string) => {
    setOpenFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  // Filter out null/undefined FAQs
  const validFaqs = Array.isArray(faqs) ? faqs.filter(faq => faq && faq._id) : [];

  return (
    <section className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12">
      {title ? (
        <h2 className="font-sans text-3xl lg:text-4xl xl:text-5xl leading-tight mb-6">
          {title}
        </h2>
      ) : null}
      {validFaqs.length > 0 ? (
        <div className="border-b border-neutral-200 transform transition-transform duration-300 ease-in-out">
          {validFaqs.map((faq) => {
            const isOpen = openFaqs.has(faq._id);
            return (
              <div
                key={faq._id}
                className="border-t border-neutral-200"
              >
                <button
                  onClick={() => toggleFaq(faq._id)}
                  className="w-full text-left text-xl cursor-pointer py-4 flex items-center justify-between transform transition-transform duration-300 ease-in-out"
                >
                  <span>{faq.title}</span>
                  <span 
                    className={`text-3xl font-light transform transition-transform duration-300 ease-in-out ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    +
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pb-8 text-base leading-relaxed text-neutral-600 md:max-w-3xl">
                    {faq.body ? <PortableText value={faq.body} /> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}