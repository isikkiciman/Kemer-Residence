import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotelSchema from "@/components/schema/HotelSchema";
import "../globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kemerresidence.com'),
  title: {
    default: "Kemer Residence - Lüks Konaklama Deneyimi",
    template: "%s | Kemer Residence",
  },
  description: "Modern ve konforlu odalarımız, harika galerilerimiz ve blog içeriklerimizle size en iyi konaklama deneyimini sunuyoruz.",
  keywords: ["otel", "konaklama", "lüks otel", "kemer residence", "istanbul otel", "butik otel", "şehir oteli"],
  authors: [{ name: "Kemer Residence" }],
  creator: "Kemer Residence",
  publisher: "Kemer Residence",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.kemerresidence.com',
    siteName: 'Kemer Residence',
    title: 'Kemer Residence - Lüks Konaklama Deneyimi',
    description: 'Modern ve konforlu odalarımız, harika galerilerimiz ve blog içeriklerimizle size en iyi konaklama deneyimini sunuyoruz.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kemer Residence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kemer Residence - Lüks Konaklama Deneyimi',
    description: 'Modern ve konforlu odalarımız, harika galerilerimiz ve blog içeriklerimizle size en iyi konaklama deneyimini sunuyoruz.',
    images: ['/twitter-image.jpg'],
    creator: '@kemerresidence',
  },
  alternates: {
    canonical: '/',
    languages: {
      'tr': '/tr',
      'en': '/en',
      'de': '/de',
      'ru': '/ru',
      'pl': '/pl',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'tr' | 'en' | 'de' | 'ru' | 'pl')) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script id="gtm-base" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MMCK759H');`}
        </Script>
        <HotelSchema />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-MMCK759H\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>",
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
