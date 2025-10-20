import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const locales = ['tr', 'en', 'de', 'ru', 'pl'];

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  
  return result;
}

function getCategoryFromKey(key: string): string {
  const parts = key.split('.');
  const firstPart = parts[0];
  
  // Map first part to categories
  const categoryMap: Record<string, string> = {
    navigation: 'navigation',
    hero: 'home',
    features: 'home',
    home: 'home',
    rooms: 'rooms',
    blog: 'blog',
    gallery: 'gallery',
    about: 'about',
    contact: 'contact',
    reservation: 'reservation',
    common: 'common',
  };
  
  return categoryMap[firstPart] || 'general';
}

async function importTranslations() {
  console.log('🚀 Starting translation import...\n');
  
  let totalImported = 0;
  let totalSkipped = 0;
  
  for (const locale of locales) {
    console.log(`📝 Processing ${locale.toUpperCase()}...`);
    
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(fileContent);
    
    const flatTranslations = flattenObject(translations);
    
    let imported = 0;
    let skipped = 0;
    
    for (const [key, value] of Object.entries(flatTranslations)) {
      try {
        const category = getCategoryFromKey(key);
        
        // Check if translation already exists
        const existing = await prisma.translation.findUnique({
          where: {
            key_locale: {
              key,
              locale,
            },
          },
        });
        
        if (existing) {
          // Update if different
          if (existing.value !== value || existing.category !== category) {
            await prisma.translation.update({
              where: { id: existing.id },
              data: { value, category },
            });
            console.log(`  ✏️  Updated: ${key} (${locale})`);
            imported++;
          } else {
            skipped++;
          }
        } else {
          // Create new
          await prisma.translation.create({
            data: {
              key,
              locale,
              value,
              category,
            },
          });
          console.log(`  ✅ Created: ${key} (${locale})`);
          imported++;
        }
      } catch (error) {
        console.error(`  ❌ Error with ${key} (${locale}):`, error);
      }
    }
    
    console.log(`  📊 ${locale.toUpperCase()}: ${imported} imported, ${skipped} skipped\n`);
    totalImported += imported;
    totalSkipped += skipped;
  }
  
  console.log(`\n✨ Import complete!`);
  console.log(`📈 Total: ${totalImported} imported, ${totalSkipped} skipped`);
  
  // Show statistics
  const stats = await prisma.translation.groupBy({
    by: ['category'],
    _count: true,
  });
  
  console.log('\n📊 Statistics by category:');
  stats.forEach(stat => {
    console.log(`  ${stat.category}: ${stat._count} translations`);
  });
  
  const totalCount = await prisma.translation.count();
  console.log(`\n💾 Total translations in database: ${totalCount}`);
}

importTranslations()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
