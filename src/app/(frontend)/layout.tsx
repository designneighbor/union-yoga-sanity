import { SanityLive } from '@/sanity/lib/live'
import { IBM_Plex_Sans } from "next/font/google";
import "@/app/globals.css";

const font = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <SanityLive />
    </>
  )
}