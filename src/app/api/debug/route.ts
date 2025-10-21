// API test endpoint
import { NextResponse } from 'next/server'
import blogData from '@/data/blog-posts.json'

export async function GET() {
  try {
    console.log('🔍 JSON blog data test...')
    
    const blogCount = blogData.posts.length
    console.log(`📝 Blog posts count: ${blogCount}`)
    
    return NextResponse.json({ 
      success: true, 
      blogCount,
      posts: blogData.posts.map(blog => ({
        id: blog.id,
        title: blog.title,
        author: blog.author,
        category: blog.category,
        publishedAt: blog.publishedAt,
        active: true
      })),
      blogs: blogData.posts.map(blog => ({
        id: blog.id,
        title: blog.title,
        publishedAt: blog.publishedAt
      })),
      message: 'JSON blog data loaded successfully!' 
    })
  } catch (error) {
    console.error('❌ JSON error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'JSON blog data failed!' 
    }, { status: 500 })
  }
}