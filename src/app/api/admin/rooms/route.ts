import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LANGUAGES = ["tr", "en", "de", "ru", "pl"] as const;

type AmenitiesPayload = Record<string, string[]> | string[];

function normalizeAmenities(input: AmenitiesPayload | undefined) {
  if (!input) {
    return {};
  }

  if (Array.isArray(input)) {
    return LANGUAGES.reduce<Record<string, string[]>>((acc, lang) => {
      acc[lang] = input;
      return acc;
    }, {});
  }

  return Object.entries(input).reduce<Record<string, string[]>>((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.filter((item): item is string => typeof item === "string");
    }
    return acc;
  }, {});
}

function parseNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

// GET all rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// POST create new room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      image,
      price,
      capacity,
      size,
      amenities,
      order,
      active,
    } = body;

    const room = await prisma.room.create({
      data: {
        name,
        description,
        image,
        price: parseNumber(price),
        capacity: typeof capacity === "string" ? capacity : String(capacity ?? ""),
        size: typeof size === "string" ? size : String(size ?? ""),
        amenities: normalizeAmenities(amenities),
        order: Number.parseInt(String(order ?? 0), 10) || 0,
        active: active !== false,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
