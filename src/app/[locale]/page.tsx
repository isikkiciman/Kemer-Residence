import type { Metadata } from "next";
import Hero from "@/components/Hero";
import FeaturedRooms from "@/components/FeaturedRooms";
import Features from "@/components/Features";
import LatestBlog from "@/components/LatestBlog";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: "Kemer Residence - İstanbul'un kalbinde lüks konaklama deneyimi. Modern odalar, özel hizmetler ve unutulmaz bir tatil için bizi keşfedin.",
  keywords: ["otel", "konaklama", "istanbul", "lüks otel", "butik otel", "otel rezervasyon"],
  openGraph: {
    title: "Kemer Residence - Lüks Konaklama Deneyimi",
    description: "İstanbul'un kalbinde lüks konaklama deneyimi",
    url: '/',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Kemer Residence Ana Sayfa',
      },
    ],
  },
  alternates: {
    canonical: '/tr',
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedRooms />
      <LatestBlog />
      <CTASection />
    </>
  );
}
