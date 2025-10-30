import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kemer-residence.com' },
    update: {},
    create: {
      email: 'admin@kemer-residence.com',
      password: '$2a$10$rOd5QfKN3hGfDOQRwQCc7uELz7Z9YvQGX7MdZJL7QfKN3hGfDOQRwQ', // admin123
      name: 'Admin User',
      role: 'admin'
    }
  })

  // Create sample rooms
  await prisma.room.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: {
        tr: 'Deluxe Oda',
        en: 'Deluxe Room',
        de: 'Deluxe Zimmer',
        ru: 'Делюкс номер',
        pl: 'Pokój Deluxe'
      },
      description: {
        tr: 'Geniş ve konforlu deluxe odamız',
        en: 'Spacious and comfortable deluxe room',
        de: 'Geräumiges und komfortables Deluxe-Zimmer',
        ru: 'Просторный и комфортабельный номер делюкс',
        pl: 'Przestronny i wygodny pokój deluxe'
      },
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80'
      ] as Prisma.JsonArray,
      price: 150,
      capacity: '2 Kişi',
      size: '35 m²',
      amenities: {
        tr: ['Klima', 'Wi-Fi', 'TV', 'Minibar'],
        en: ['Air Conditioning', 'Wi-Fi', 'TV', 'Minibar'],
        de: ['Klimaanlage', 'Wi-Fi', 'TV', 'Minibar'],
        ru: ['Кондиционер', 'Wi-Fi', 'ТВ', 'Мини-бар'],
        pl: ['Klimatyzacja', 'Wi-Fi', 'TV', 'Minibar']
      }
    }
  })

  // Create sample blog posts
  await prisma.blogPost.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      slug: {
        tr: 'kapadokya-balon-turu',
        en: 'cappadocia-balloon-tour',
        de: 'kappadokien-ballonfahrt',
        ru: 'каппадокия-воздушный-шар',
        pl: 'kapadocja-lot-balonem'
      },
      title: {
        tr: 'Kapadokya Balon Turu Deneyimi',
        en: 'Cappadocia Balloon Tour Experience',
        de: 'Kappadokien Ballonfahrt Erlebnis',
        ru: 'Опыт полета на воздушном шаре в Каппадокии',
        pl: 'Doświadczenie lotu balonem w Kapadocji'
      },
      content: {
        tr: 'Kapadokya\'nın büyüleyici manzarasını havadan keşfetmek için balon turuna katılın.',
        en: 'Join a balloon tour to discover Cappadocia\'s enchanting landscape from above.',
        de: 'Nehmen Sie an einer Ballonfahrt teil, um Kappadokiens bezaubernde Landschaft von oben zu entdecken.',
        ru: 'Присоединяйтесь к туру на воздушном шаре, чтобы открыть для себя очаровательный пейзаж Каппадокии сверху.',
        pl: 'Dołącz do lotu balonem, aby odkryć urokliwy krajobraz Kapadocji z góry.'
      },
      excerpt: {
        tr: 'Kapadokya balon turu ile unutulmaz bir deneyim yaşayın',
        en: 'Experience an unforgettable balloon tour in Cappadocia',
        de: 'Erleben Sie eine unvergessliche Ballonfahrt in Kappadokien',
        ru: 'Испытайте незабываемый тур на воздушном шаре в Каппадокии',
        pl: 'Przeżyj niezapomnianą wycieczkę balonem w Kapadocji'
      },
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
      author: 'Kemer Residence',
      category: 'Turlar',
      readTime: '5 dk',
      active: true,
      seoTitle: {
        tr: 'Kapadokya Balon Turu | Kemer Residence',
        en: 'Cappadocia Balloon Tour | Kemer Residence',
        de: 'Kappadokien Ballonfahrt | Kemer Residence',
        ru: 'Каппадокия Воздушный Шар | Kemer Residence',
        pl: 'Kapadocja Lot Balonem | Kemer Residence'
      },
      seoDescription: {
        tr: 'Kapadokya balon turu ile muhteşem manzaraları keşfedin. Kemer Residence ile unutulmaz bir deneyim.',
        en: 'Discover magnificent views with Cappadocia balloon tour. An unforgettable experience with Kemer Residence.',
        de: 'Entdecken Sie großartige Aussichten mit der Kappadokien-Ballonfahrt. Ein unvergessliches Erlebnis mit Kemer Residence.',
        ru: 'Откройте для себя великолепные виды с туром на воздушном шаре в Каппадокии. Незабываемые впечатления с Kemer Residence.',
        pl: 'Odkryj wspaniałe widoki podczas lotu balonem w Kapadocji. Niezapomniane doświadczenie z Kemer Residence.'
      }
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })