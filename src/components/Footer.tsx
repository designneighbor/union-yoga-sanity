import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logoText?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  socialLinks?: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
  className?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ 
    className = '',
    logoText = "Union Yoga",
    primaryButtonText = "Design System",
    primaryButtonHref = "/design-system",
    secondaryButtonText = "Learn More",
    secondaryButtonHref = "#learn-more",
    socialLinks = [
      {
        name: "Instagram",
        href: "https://instagram.com/unionyoga",
        icon: <Instagram className="w-5 h-5" />
      },
      {
        name: "Facebook",
        href: "https://facebook.com/unionyoga",
        icon: <Facebook className="w-5 h-5" />
      },
      {
        name: "Twitter",
        href: "https://twitter.com/unionyoga",
        icon: <Twitter className="w-5 h-5" />
      }
    ],
    ...props 
  }, ref) => {
    // Navigation link data for yoga website
    const navigationSections = [
      {
        title: "Classes",
        links: [
          { label: "Beginner Yoga", href: "#beginner" },
          { label: "Vinyasa Flow", href: "#vinyasa" },
          { label: "Hatha Yoga", href: "#hatha" },
          { label: "Yin Yoga", href: "#yin" },
          { label: "Restorative", href: "#restorative" },
          { label: "Prenatal", href: "#prenatal" },
          { label: "Private Sessions", href: "#private" },
          { label: "Online Classes", href: "#online" }
        ]
      },
      {
        title: "Membership",
        links: [
          { label: "Pricing", href: "#pricing" },
          { label: "Class Packages", href: "#packages" },
          { label: "Unlimited Monthly", href: "#unlimited" },
          { label: "Student Discounts", href: "#student" },
          { label: "Corporate Wellness", href: "#corporate" }
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "About Yoga", href: "#about-yoga" },
          { label: "Blog", href: "#blog" },
          { label: "Help Center", href: "#help" },
          { label: "Teacher Training", href: "#training" },
          { label: "Workshops", href: "#workshops" }
        ]
      },
      {
        title: "Community",
        links: [
          { label: "Events", href: "#events" },
          { label: "Retreats", href: "#retreats" },
          { label: "Teacher Directory", href: "#teachers" },
          { label: "Student Stories", href: "#stories" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "#about" },
          { label: "Careers", href: "#careers" },
          { label: "Contact", href: "#contact" },
          { label: "Studio Locations", href: "#locations" }
        ]
      }
    ];

    return (
      <footer
        className={`bg-white text-neutral-950 ${className}`}
        ref={ref}
        {...props}
      >
        <div className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12">

        <div className="border-b border-neutral-200 mb-12"></div>
            
          {/* Top Section - Logo and Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            {/* Logo */}
            <div className="mb-6 lg:mb-0">
              <Link 
                href="/" 
                className="font-sans text-3xl lg:text-4xl font-bold text-primary-950 hover:text-primary-800 transition-colors duration-200"
              >
                {logoText}
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
             
            <Button
                variant="primary"
                size="sm"
                asChild
            >
                <a href={primaryButtonHref}>
                {primaryButtonText}
                </a>
            </Button>

            <Button
                variant="secondary"
                size="sm"
                asChild
                >
                <a href={secondaryButtonHref}>
                {secondaryButtonText}
                </a>
            </Button>

            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="font-sans text-base font-semibold text-primary-950 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="font-sans text-sm text-primary-700 hover:text-primary-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section - Legal, Social, Disclaimer */}
          <div className="">
            {/* Legal and Social Links */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-t border-b border-neutral-200 py-6">
              {/* Legal Links */}
              <div className="flex flex-wrap items-center gap-4 mb-4 lg:mb-0">
                <a
                  href="#terms"
                  className="font-sans text-sm text-primary-700 hover:text-primary-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                >
                  Terms
                </a>
                <a
                  href="#privacy"
                  className="font-sans text-sm text-primary-700 hover:text-primary-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                >
                  Privacy
                </a>
                <a
                  href="#disclosures"
                  className="font-sans text-sm text-primary-700 hover:text-primary-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                >
                  Disclosures
                </a>
                <a
                  href="#cookies"
                  className="font-sans text-sm text-primary-700 hover:text-primary-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                >
                  Cookie Settings
                </a>

                {/* 
                <span className="font-sans text-sm text-primary-600">
                  Union Yoga Wellness LLC
                </span>
                */}
                
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-primary-700 hover:text-primary-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-sm text-neutral-700 leading-relaxed py-6">
              <p className="font-semibold mb-2">Disclaimer:</p>
              <p className="mb-2">
                The information provided on this website is for educational and informational purposes only. 
                Yoga practice should be approached with care and respect for your body&apos;s limitations. 
                Always consult with a healthcare professional before beginning any new exercise program.
              </p>
              <p>
                Union Yoga is not responsible for any injuries that may occur during practice. 
                By participating in our classes, you acknowledge that you understand the risks involved 
                and agree to practice at your own discretion.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export { Footer };
