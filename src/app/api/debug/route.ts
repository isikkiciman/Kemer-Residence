// API test endpoint
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 Database connection test...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected!')
    
    // Count blog posts
    const blogCount = await prisma.blogPost.count()
    console.log(`📝 Blog posts count: ${blogCount}`)
    
    // Get all blog posts
    const blogs = await prisma.blogPost.findMany()
    console.log('📋 Blog posts:', blogs)
    
    return NextResponse.json({ 
      success: true, 
      blogCount,
      blogs: blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        active: blog.active
      })),
      message: 'Database connection successful!' 
    })
  } catch (error) {
    console.error('❌ Database error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed!' 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}