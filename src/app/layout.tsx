import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <title>Union Yoga | Black-Owned Yoga Studio in Baltimore</title>
      <meta name="description" content="Union Yoga is a yoga studio in Baltimore, Maryland. It is a place to practice yoga, meditate, and connect with others." />
      <meta name="keywords" content="yoga, meditation, baltimore, union, yoga, union yoga, maryland" />
      <meta name="author" content="Union Yoga" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      <body className="font-sans">{children}</body>

    </html>
  );
}