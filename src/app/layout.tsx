import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/utils";
import { defaultOgImage } from "@/lib/seo";
import { getContactChannels } from "@/lib/data/content";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const defaultTitle = `${siteConfig.name} — ${siteConfig.title}`;
const defaultDescription =
  "Websites that turn local businesses into leads — plus the Android apps and backends behind them. Built by Quoreeb Adebayo.";

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultDescription,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Quoreeb Adebayo",
    "Web Developer Nigeria",
    "Small business website",
    "Full Stack Developer",
    "Android App Developer",
    "Next.js Developer",
    "Supabase Developer",
  ],
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: siteConfig.name,
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage.url],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "xoe7djQH5NpCboXFmC5BXMeIyuO87izGcrrufWpm8q8",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { socials } = await getContactChannels();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/quoreeb-adebayo.png`,
    jobTitle: siteConfig.title,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Osogbo",
      addressCountry: "NG",
    },
    sameAs: socials.map((social) => social.href),
  };

  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${sourceSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
