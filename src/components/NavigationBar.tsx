"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';

export interface NavigationBarProps extends React.HTMLAttributes<HTMLElement> {
  logoText?: string;
  navigationItems?: Array<{
    label: string;
    href: string;
  }>;
  signInHref?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
}

const NavigationBar = React.forwardRef<HTMLElement, NavigationBarProps>(
  ({ 
    className = '',
    logoText = "Union Yoga",
    navigationItems = [
      { label: "About", href: "#about" },
      { label: "Classes", href: "#classes" },
      { label: "Blog", href: "/blog" }
    ],
    signInHref = "#signin",
    primaryButtonText = "Design System",
    primaryButtonHref = "/design-system",
    ...props 
  }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    
    // Check if we're on the home page to enable animations
    const isHomePage = pathname === '/';
    
    // Animation classes - only apply on home page
    const animationClass = isHomePage ? 'fade-in-down delay-200' : '';

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
    };


    return (
      <nav
        className={`w-full bg-neutral-50 transition-colors duration-300 ${isMobileMenuOpen ? 'bg-primary-950' : ''} ${className}`}
        ref={ref}
        {...props}
      >
        <div className="container px-4 sm:px-6 md:px-8 xl:px-10">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className={`flex-shrink-0 ${animationClass}`}>
              <Link 
                href="/" 
                className="font-sans font-bold text-xl lg:text-2xl text-primary-950 hover:text-primary-800 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                {logoText}
              </Link>
            </div>

            {/* Desktop Navigation */}
           

              {/* Navigation Links */}
              <div className={`${animationClass} items-center space-x-2 bg-neutral-200 flex hidden lg:flex rounded-full`}>
                {navigationItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="font-sans font-normal text-base font-medium text-primary-950 hover:text-primary-950 px-4 py-2 rounded-full hover:bg-neutral-300/50 transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Action Buttons */}
              <div className={`${animationClass} hidden lg:flex items-center space-x-4`}>
                <a
                  href={signInHref}
                  className="font-sans font-normal text-sm font-medium text-primary-950 hover:text-primary-800 transition-colors duration-200"
                >
                  Sign In
                </a>
                <Button
                  variant="primary"
                  size="sm"
                  asChild
                >
                  <a href={primaryButtonHref}>
                    {primaryButtonText}
                  </a>
                </Button>
              </div>
              
        
           

            {/* Mobile Menu Button */}
            <div className={`lg:hidden ${animationClass}`}>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-primary-950 hover:text-primary-800 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  // Close icon (X)
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden">
              <div className="fixed inset-0 z-50 bg-primary-950">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-primary-800">
                  <Link
                    href="/" 
                    className="font-sans font-bold text-xl text-white hover:text-neutral-200 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    {logoText}
                  </Link>
                  <button
                    type="button"
                    className="flex items-center justify-center h-8 w-8 rounded-full text-white hover:text-neutral-200 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                
                {/* Navigation Links */}
                <nav className="">
                  <div className="">
                    {navigationItems.map((item, index) => (
                      <div key={index}>
                        <a
                          href={item.href}
                          className="font-sans font-normal text-lg px-6 py-4 font-medium text-white hover:text-neutral-200 border-b border-primary-800 block hover:bg-primary-800 transition-colors duration-200"
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </nav>

                {/* Action Buttons */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={signInHref} onClick={closeMobileMenu}>
                      Sign In
                    </a>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={primaryButtonHref} onClick={closeMobileMenu}>
                      {primaryButtonText}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={`${animationClass} border-b border-neutral-200`}></div>
      </nav>
    );
  }
);

NavigationBar.displayName = 'NavigationBar';

export { NavigationBar };