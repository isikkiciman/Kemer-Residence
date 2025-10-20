import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDefaultSettings() {
  console.log('🌱 Seeding default settings...\n');

  try {
    // Logo URL
    await prisma.siteSettings.upsert({
      where: { key: 'logoUrl' },
      update: {},
      create: {
        key: 'logoUrl',
        value: '/logo.svg',
      },
    });
    console.log('✅ Logo URL set');

    // Banner URL
    await prisma.siteSettings.upsert({
      where: { key: 'bannerUrl' },
      update: {},
      create: {
        key: 'bannerUrl',
        value: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
      },
    });
    console.log('✅ Banner URL set');

    // Site Name
    await prisma.siteSettings.upsert({
      where: { key: 'siteName' },
      update: {},
      create: {
        key: 'siteName',
        value: {
          tr: 'Kemer Residence',
          en: 'Kemer Residence',
          de: 'Kemer Residence',
          ru: 'Kemer Residence',
          pl: 'Kemer Residence',
        },
      },
    });
    console.log('✅ Site name set');

    // Site Description
    await prisma.siteSettings.upsert({
      where: { key: 'siteDescription' },
      update: {},
      create: {
        key: 'siteDescription',
        value: {
          tr: 'Modern ve konforlu odalarımız ile lüks konaklama deneyimi',
          en: 'Luxury accommodation experience with modern and comfortable rooms',
          de: 'Luxuriöses Unterkunftserlebnis mit modernen und komfortablen Zimmern',
          ru: 'Роскошное размещение с современными и комфортными номерами',
          pl: 'Luksusowe zakwaterowanie z nowoczesnymi i wygodnymi pokojami',
        },
      },
    });
    console.log('✅ Site description set');

    console.log('\n✨ Default settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDefaultSettings();
