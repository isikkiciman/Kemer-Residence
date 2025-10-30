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

// GET single room
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}

// PUT update room
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    const room = await prisma.room.update({
      where: { id },
      data: {
        name,
        description,
        image,
        price: parseNumber(price),
        capacity: typeof capacity === "string" ? capacity : String(capacity ?? ""),
        size: typeof size === "string" ? size : String(size ?? ""),
        amenities: normalizeAmenities(amenities),
        order: Number.parseInt(String(order ?? 0), 10) || 0,
        active,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

// DELETE room
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.room.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
