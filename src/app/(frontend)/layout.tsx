import { SanityLive } from '@/sanity/lib/live'
import { IBM_Plex_Sans } from "next/font/google";
import "@/app/globals.css";
import { NavigationBar } from '@/components/NavigationBar';

const font = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Add error boundary component
function SanityLiveWrapper() {
  try {
    return <SanityLive />;
  } catch (error) {
    console.error('SanityLive error:', error);
    return null; // Silently fail in production
  }
}

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>

      <NavigationBar />

      {children}
      <SanityLiveWrapper />
    </>
  )
}