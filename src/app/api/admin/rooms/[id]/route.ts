import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

const LANGUAGES = ["tr", "en", "de", "ru", "pl"] as const;

type AmenitiesPayload = Record<string, string[]> | string[];
type ImagesPayload = unknown;

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

function normalizeImages(input: ImagesPayload, fallback?: string) {
  const list: string[] = [];

  const add = (candidate: unknown) => {
    if (typeof candidate === "string" && candidate.trim()) {
      list.push(candidate.trim());
      return;
    }

    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      const record = candidate as Record<string, unknown>;
      if (typeof record.url === "string" && record.url.trim()) {
        list.push(record.url.trim());
      }
    }
  };

  if (Array.isArray(input)) {
    input.forEach((item) => add(item));
  } else if (input && typeof input === "object") {
    const record = input as Record<string, unknown>;
    if (Array.isArray(record.list)) {
      record.list.forEach((item) => add(item));
    } else if (Array.isArray(record.images)) {
      record.images.forEach((item) => add(item));
    } else {
      Object.values(record).forEach((item) => add(item));
    }
  } else if (typeof input === "string") {
    add(input);
  }

  if (fallback) {
    add(fallback);
  }

  return Array.from(new Set(list)).slice(0, 10);
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
      images,
      price,
      capacity,
      size,
      amenities,
      order,
      active,
    } = body;

    const imageList = normalizeImages(images, typeof image === "string" ? image : undefined);

    if (imageList.length === 0) {
      return NextResponse.json(
        { error: "Kapak görseli zorunludur" },
        { status: 400 }
      );
    }

    const updateData = {
      name,
      description,
      image: imageList[0],
      images: imageList as unknown as Prisma.JsonArray,
      price: parseNumber(price),
      capacity: typeof capacity === "string" ? capacity : String(capacity ?? ""),
      size: typeof size === "string" ? size : String(size ?? ""),
      amenities: normalizeAmenities(amenities),
      order: Number.parseInt(String(order ?? 0), 10) || 0,
      active: active !== false,
    } as unknown as Prisma.RoomUpdateInput;

    const room = await prisma.room.update({
      where: { id },
      data: updateData,
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
