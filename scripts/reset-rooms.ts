import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleRoom = {
  id: 'kemer-seaview-suite-2025',
  name: {
    tr: 'Deniz Manzaralı Süit',
    en: 'Sea View Suite',
    de: 'Suite mit Meerblick',
    ru: 'Люкс с видом на море',
    pl: 'Apartament z widokiem na morze',
  },
  description: {
    tr: 'Geniş deniz manzaralı süitimizde özel balkon, king yatak ve spa duşu ile lüks bir konaklama deneyimi yaşayın.',
    en: 'Enjoy a luxurious stay in our spacious sea view suite featuring a private balcony, king bed and spa shower.',
    de: 'Genießen Sie einen luxuriösen Aufenthalt in unserer geräumigen Suite mit Meerblick, privatem Balkon, Kingsize-Bett und Spa-Dusche.',
    ru: 'Насладитесь роскошным отдыхом в просторном люксе с видом на море, частным балконом, кроватью размера «king-size» и спа-душем.',
    pl: 'Ciesz się luksusowym pobytem w przestronnym apartamencie z widokiem na morze, prywatnym balkonem, łóżkiem king-size i prysznicem spa.',
  },
  image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
  images: [
    'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501117716987-c8e1ecb2105c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
  ],
  price: 280,
  capacity: '2 Kişi',
  size: '45 m²',
  amenities: {
    tr: ['King yatak', 'Deniz manzarası', 'Özel balkon', 'Spa duşu', 'Klima', 'Yüksek hızlı Wi-Fi'],
    en: ['King bed', 'Sea view', 'Private balcony', 'Spa shower', 'Air conditioning', 'High-speed Wi-Fi'],
    de: ['Kingsize-Bett', 'Meerblick', 'Privater Balkon', 'Spa-Dusche', 'Klimaanlage', 'Highspeed-WLAN'],
    ru: ['Кровать king-size', 'Вид на море', 'Частный балкон', 'Спа-душ', 'Кондиционер', 'Высокоскоростной Wi-Fi'],
    pl: ['Łóżko king-size', 'Widok na morze', 'Prywatny balkon', 'Prysznic spa', 'Klimatyzacja', 'Szybki Wi-Fi'],
  },
  order: 1,
  active: true,
};

async function main() {
  try {
    console.log('🧹 Removing existing rooms...');
    const deleted = await prisma.room.deleteMany();
    console.log(`🗑️  Removed ${deleted.count} room(s).`);

    console.log('➕ Inserting sample room...');
    const created = await prisma.room.create({ data: sampleRoom });
    console.log(`✅ Created room: ${created.id}`);
  } catch (error) {
    console.error('❌ Failed to reset rooms:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
