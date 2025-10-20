import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, Heart, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Romee Hotel'in hikayesini keşfedin. Misyonumuz, vizyonumuz ve size sunduğumuz benzersiz konaklama deneyimi hakkında bilgi edinin.",
  keywords: ["otel hakkında", "romee hotel hikayesi", "otel vizyonu", "misyonumuz", "değerlerimiz"],
  openGraph: {
    title: "Hakkımızda - Romee Hotel",
    description: "Romee Hotel hakkında bilgi edinin",
    url: '/hakkimizda',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Romee Hotel Hakkımızda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakkımızda - Romee Hotel',
    description: 'Romee Hotel hakkında bilgi edinin',
  },
  alternates: {
    canonical: '/tr/hakkimizda',
    languages: {
      'tr': '/tr/hakkimizda',
      'en': '/en/hakkimizda',
      'de': '/de/hakkimizda',
      'ru': '/ru/hakkimizda',
      'pl': '/pl/hakkimizda',
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080"
          alt="About Us"
          fill
          className="object-cover"
        />
        <div className="container-custom relative z-20 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
            Hakkımızda
          </h1>
          <p className="text-xl">Hikayemizi keşfedin</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-6">
                Romee Hotel&apos;e Hoş Geldiniz
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                2010 yılında kurulan Romee Hotel, İstanbul&apos;un kalbinde konuklara 
                eşsiz bir konaklama deneyimi sunmak için var. Lüks, konfor ve 
                Türk misafirperverliğini bir araya getiren otelimiz, her misafire 
                özel hissettirecek hizmetler sunar.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Modern tasarıma sahip odalarımız, dünya standartlarındaki 
                olanaklarımız ve deneyimli ekibimizle, iş veya tatil için 
                gelen tüm misafirlerimize unutulmaz anlar yaşatmayı hedefliyoruz.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Şehrin tarihi ve kültürel zenginliklerine yakın konumumuz, 
                misafirlerimize İstanbul&apos;u keşfetme imkanı sunarken, otelimizin 
                huzurlu atmosferinde dinlenme fırsatı da sağlar.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070"
                alt="Hotel Lobby"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-[--secondary]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Değerlerimiz
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Bizi biz yapan prensipler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 bg-[--primary] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">
                Mükemmellik
              </h3>
              <p className="text-gray-600">
                Her detayda kalite ve mükemmellik standartlarını koruruz
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 bg-[--primary] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">
                Misafirperverlik
              </h3>
              <p className="text-gray-600">
                Türk misafirperverliğini modern hizmet anlayışıyla birleştiririz
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 bg-[--primary] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">
                Özen
              </h3>
              <p className="text-gray-600">
                Her misafirimize özel ilgi gösterir ve ihtiyaçlarını önemseriz
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 bg-[--primary] rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">
                Yenilikçilik
              </h3>
              <p className="text-gray-600">
                Sürekli gelişim ve yenilikle daha iyi hizmet sunma çabasındayız
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[--primary] mb-2">15+</div>
              <p className="text-gray-600">Yıllık Deneyim</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[--primary] mb-2">120</div>
              <p className="text-gray-600">Oda</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[--primary] mb-2">50K+</div>
              <p className="text-gray-600">Mutlu Misafir</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[--primary] mb-2">25+</div>
              <p className="text-gray-600">Ödül</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-[--secondary]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Ekibimiz
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Deneyimli ve profesyonel ekibimiz sizlere hizmet etmek için burada
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmet Yılmaz",
                role: "Genel Müdür",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2074",
              },
              {
                name: "Ayşe Demir",
                role: "Operasyon Müdürü",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076",
              },
              {
                name: "Mehmet Kaya",
                role: "Baş Aşçı",
                image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070",
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-serif font-semibold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
