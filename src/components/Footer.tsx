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
  footerLinks?: Array<{
    label: string;
    href: string;
    openInNewTab?: boolean;
  }>;
  className?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ 
    className = '',
    logoText = "Union Yoga",
    primaryButtonText = "Learn More",
    primaryButtonHref = "/about",
    secondaryButtonText = "Contact Us",
    secondaryButtonHref = "/contact",
    socialLinks = [
      {
        name: "Instagram",
        href: "#",
        icon: <Instagram className="w-5 h-5" />
      },
      {
        name: "Facebook",
        href: "#",
        icon: <Facebook className="w-5 h-5" />
      },
      {
        name: "Twitter",
        href: "#",
        icon: <Twitter className="w-5 h-5" />
      }
    ],
    footerLinks = [],
    ...props 
  }, ref) => {
    // Helper function to determine if a link is external
    const isExternalLink = (href: string) => {
      return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:');
    };

    // Helper function to render footer links
    const renderFooterLink = (item: { label: string; href: string; openInNewTab?: boolean }) => {
      const isExternal = isExternalLink(item.href);
      const shouldOpenInNewTab = item.openInNewTab || (isExternal && item.openInNewTab !== false);
      
      const linkProps = {
        href: item.href,
        className: "font-sans text-sm text-primary-700 hover:text-primary-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded",
        ...(shouldOpenInNewTab && {
          target: '_blank',
          rel: 'noopener noreferrer'
        })
      };

      if (isExternal || shouldOpenInNewTab) {
        return <a {...linkProps}>{item.label}</a>;
      } else {
        return <Link {...linkProps}>{item.label}</Link>;
      }
    };

    return (
      <footer
        className={`bg-white text-neutral-950 ${className}`}
        ref={ref}
        {...props}
      >
        <div className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12">
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

          {/* Bottom Section - Legal, Social, Disclaimer */}
          <div className="">
            {/* Legal and Social Links */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-t border-b border-neutral-200 py-6">
              {/* Footer Links */}
              <div className="flex flex-wrap items-center gap-4 mb-4 lg:mb-0">
                {footerLinks.length > 0 ? (
                  footerLinks.map((link, index) => (
                    <React.Fragment key={index}>
                      {renderFooterLink(link)}
                    </React.Fragment>
                  ))
                ) : (
                  // Fallback if no links provided
                  <>
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
                  </>
                )}
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
