import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/utils";
import { socialLinks } from "@/lib/socials";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `Portfolio of ${siteConfig.author} — ${siteConfig.title}. Web projects, mobile apps, and full-stack development services.`,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Quoreeb Adebayo",
    "Full Stack Developer",
    "Web Developer Nigeria",
    "Mobile App Developer",
    "Next.js Developer",
    "Supabase Developer",
  ],
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description:
      "Premium websites, mobile apps, APIs, and product platforms engineered from interface to infrastructure.",
    images: [
      {
        url: "/images/quorestack-hero-poster.jpg",
        width: 1536,
        height: 1024,
        alt: `${siteConfig.author} — ${siteConfig.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@idrisadebayoiaq",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description:
      "Premium websites, mobile apps, APIs, and product platforms.",
    images: ["/images/quorestack-hero-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "xoe7djQH5NpCboXFmC5BXMeIyuO87izGcrrufWpm8q8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    sameAs: socialLinks.map((social) => social.href),
  };

  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} antialiased`}
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
