"use client";
import { useState } from "react";
import { PAGE_QUERYResult } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

type TestimonialsProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "testimonials" }
>;

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === testimonials.length - 1;

  const goToPrevious = () => {
    if (!isFirstSlide) setCurrentIndex(currentIndex - 1);
  };

  const goToNext = () => {
    if (!isLastSlide) setCurrentIndex(currentIndex + 1);
  };

  if (!currentTestimonial) return null;

  return (
    <section className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12 w-full">
      <div className="relative">
        {/* Testimonial Card */}
        <div
          key={currentIndex}
          className="testimonial-item flex flex-col-reverse p-8 md:p-12 md:flex-row gap-8 lg:gap-24 bg-primary-950 text-white rounded-md"
        >
          <div className="flex flex-4 flex-col gap-6 place-content-between">
            <blockquote className="text-xl lg:text-2xl font-normal animate-fade-in">
              {currentTestimonial.quote}
            </blockquote>

            <div className="flex flex-col">
              <div className="flex-1">
                <p className="text-xl font-normal animate-fade-in">
                  {currentTestimonial.name}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-base font-normal animate-fade-in">
                  {currentTestimonial.company}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {/* Previous Arrow */}
              <button
                onClick={goToPrevious}
                disabled={isFirstSlide}
                aria-label="Previous testimonial"
                aria-disabled={isFirstSlide}
                className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 ${
                  isFirstSlide
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/30 hover:scale-110 active:scale-95"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              {/* Next Arrow */}
              <button
                onClick={goToNext}
                disabled={isLastSlide}
                aria-label="Next testimonial"
                aria-disabled={isLastSlide}
                className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 ${
                  isLastSlide
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/30 hover:scale-110 active:scale-95"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1">
            {currentTestimonial.image && (
              <div className="relative h-48 w-48 animate-fade-in">
                <Image
                  src={urlFor(currentTestimonial.image).url()}
                  alt={currentTestimonial.name || "Testimonial author"}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
