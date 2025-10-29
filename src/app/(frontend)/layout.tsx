import { draftMode } from "next/headers";
import { IBM_Plex_Sans } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { NavigationBar } from '@/components/NavigationBar';
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { Footer } from '@/components/Footer';
import "@/app/globals.css";
import { ScrollAnimationProvider } from '@/components/ScrollAnimationProvider';


const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings with navigation data
  const siteSettings = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    params: {},
  });

  // Transform Sanity navigation data to NavigationBar format
  const transformNavigationItems = (navigation: any[] = []) => {
    return navigation.map((item) => {
      let href = '#';
      let openInNewTab = false;

      // Priority order: externalUrl first, then pageSlug
      if (item.externalUrl) {
        href = item.externalUrl;
        // Auto-set openInNewTab to true for actual external URLs
        if (item.externalUrl.startsWith('http://') || item.externalUrl.startsWith('https://')) {
          openInNewTab = true;
        }
      } else if (item.pageSlug) {
        href = `/${item.pageSlug}`;
      }

      // Override with explicit openInNewTab setting if provided
      if (item.openInNewTab !== undefined) {
        openInNewTab = item.openInNewTab;
      }

      return {
        label: item.title || 'Untitled',
        href,
        openInNewTab,
      };
    });
  };

  // Get navigation items with fallback
  const navigationItems = siteSettings?.data?.navigation 
    ? transformNavigationItems(siteSettings.data.navigation)
    : [
        { label: "About", href: "/about", openInNewTab: false },
        { label: "Classes", href: "#classes", openInNewTab: false },
        { label: "Blog", href: "/blog", openInNewTab: false }
      ];

  return (
    <ScrollAnimationProvider>
      <section className={`${ibmPlexSans.variable} bg-white min-h-screen`}>
        <NavigationBar navigationItems={navigationItems} />
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
        <Footer footerLinks={navigationItems} />
      </section>
    </ScrollAnimationProvider>
  );
}