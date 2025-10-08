import { draftMode } from "next/headers";
import { IBM_Plex_Sans } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { NavigationBar } from '@/components/NavigationBar';
import { SanityLive } from "@/sanity/lib/live";
import { Footer } from '@/components/Footer';
import "@/app/globals.css";

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
  return (
    <section className={`${ibmPlexSans.variable} bg-white min-h-screen`}>
      <NavigationBar />
      {children}
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Footer />
    </section>
  );
}