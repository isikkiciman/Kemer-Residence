import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all translations with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const category = searchParams.get('category');

    const where: { locale?: string; category?: string } = {};
    if (locale) where.locale = locale;
    if (category) where.category = category;

    const translations = await prisma.translation.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' },
      ],
    });

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

// POST create new translation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, locale, value, category } = body;

    const translation = await prisma.translation.create({
      data: {
        key,
        locale,
        value,
        category: category || 'general',
      },
    });

    return NextResponse.json(translation, { status: 201 });
  } catch (error) {
    console.error('Error creating translation:', error);
    return NextResponse.json(
      { error: 'Failed to create translation' },
      { status: 500 }
    );
  }
}
