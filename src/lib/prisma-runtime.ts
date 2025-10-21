import { PrismaClient } from '@prisma/client'

// Global instance to prevent multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with optimized settings for Vercel
export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        // For production (Vercel), use memory database or embedded
        url: process.env.NODE_ENV === 'production' 
          ? 'file::memory:?cache=shared' 
          : 'file:dev.db'
      }
    }
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Initialize database with seed data for production
async function initializeDatabase() {
  if (process.env.NODE_ENV === 'production') {
    try {
      // Create tables
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS BlogPost (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          image TEXT NOT NULL,
          author TEXT NOT NULL,
          category TEXT NOT NULL,
          readTime TEXT NOT NULL,
          slug TEXT NOT NULL,
          seoTitle TEXT,
          seoDescription TEXT,
          seoKeywords TEXT,
          externalLink TEXT,
          externalLinkTitle TEXT,
          images TEXT,
          active INTEGER DEFAULT 1,
          publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Check if data exists
      const postCount = await prisma.blogPost.count()
      
      if (postCount === 0) {
        // Insert seed data
        await prisma.blogPost.create({
          data: {
            id: '1',
            slug: JSON.stringify({
              tr: 'kapadokya-balon-turu',
              en: 'cappadocia-balloon-tour',
              de: 'kappadokien-ballonfahrt',
              ru: 'каппадокия-воздушный-шар',
              pl: 'kapadocja-lot-balonem'
            }),
            title: JSON.stringify({
              tr: 'Kapadokya Balon Turu Deneyimi',
              en: 'Cappadocia Balloon Tour Experience',
              de: 'Kappadokien Ballonfahrt Erlebnis',
              ru: 'Опыт полета на воздушном шаре в Каппадокии',
              pl: 'Doświadczenie lotu balonem w Kapadocji'
            }),
            content: JSON.stringify({
              tr: 'Kapadokya\'nın büyüleyici manzarasını havadan keşfetmek için balon turuna katılın.',
              en: 'Join a balloon tour to discover Cappadocia\'s enchanting landscape from above.',
              de: 'Nehmen Sie an einer Ballonfahrt teil, um Kappadokiens bezaubernde Landschaft von oben zu entdecken.',
              ru: 'Присоединяйтесь к туру на воздушном шаре, чтобы открыть для себя очаровательный пейзаж Каппадокии сверху.',
              pl: 'Dołącz do lotu balonem, aby odkryć urokliwy krajobraz Kapadocji z góry.'
            }),
            excerpt: JSON.stringify({
              tr: 'Kapadokya balon turu ile unutulmaz bir deneyim yaşayın',
              en: 'Experience an unforgettable balloon tour in Cappadocia',
              de: 'Erleben Sie eine unvergessliche Ballonfahrt in Kappadokien',
              ru: 'Испытайте незабываемый тур на воздушном шаре в Каппадокии',
              pl: 'Przeżyj niezapomnianą wycieczkę balonem w Kapadocji'
            }),
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
            author: 'Kemer Residence',
            category: 'Turlar',
            readTime: '5 dk',
            active: true,
            seoTitle: JSON.stringify({
              tr: 'Kapadokya Balon Turu | Kemer Residence',
              en: 'Cappadocia Balloon Tour | Kemer Residence',
              de: 'Kappadokien Ballonfahrt | Kemer Residence',
              ru: 'Каппадокия Воздушный Шар | Kemer Residence',
              pl: 'Kapadocja Lot Balonem | Kemer Residence'
            }),
            seoDescription: JSON.stringify({
              tr: 'Kapadokya balon turu ile muhteşem manzaraları keşfedin. Kemer Residence ile unutulmaz bir deneyim.',
              en: 'Discover magnificent views with Cappadocia balloon tour. An unforgettable experience with Kemer Residence.',
              de: 'Entdecken Sie großartige Aussichten mit der Kappadokien-Ballonfahrt. Ein unvergessliches Erlebnis mit Kemer Residence.',
              ru: 'Откройте для себя великолепные виды с туром на воздушном шаре в Каппадокии. Незабываемые впечатления с Kemer Residence.',
              pl: 'Odkryj wspaniałe widoki podczas lotu balonem w Kapadocji. Niezapomniane doświadczenie z Kemer Residence.'
            })
          }
        })
        
        console.log('✅ Database seeded successfully!')
      }
    } catch (error) {
      console.log('⚠️ Database initialization skipped:', error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

// Initialize on first import
if (process.env.NODE_ENV === 'production') {
  initializeDatabase().catch(console.error)
}

export default prisma