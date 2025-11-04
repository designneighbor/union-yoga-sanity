import "@/app/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Union Yoga | Black-Owned Yoga Studio in Baltimore",
  description: "Union Yoga is a yoga studio in Baltimore, Maryland. It is a place to practice yoga, meditate, and connect with others.",
  keywords: ["yoga", "meditation", "baltimore", "union", "yoga", "union yoga", "maryland"],
  authors: [{ name: "Union Yoga" }],
  robots: "index, follow",
  icons: {
    icon: "/site_icon.png",
    apple: "/site_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className="font-sans">{children}</body>

    </html>
  );
}