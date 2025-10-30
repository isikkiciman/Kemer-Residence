import { unstable_noStore as noStore } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type PrismaRoom = Awaited<ReturnType<typeof prisma.room.findMany>>[number];

export type LocalizedText = Record<string, string>;
export type LocalizedAmenities = Record<string, string[]>;

export interface Room {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  price: number;
  capacity: string;
  size: string;
  amenities: LocalizedAmenities;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function parseLocalizedText(
  value: Prisma.JsonValue | null | undefined
): LocalizedText {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (acc, [key, val]) => {
      if (typeof val === "string") {
        acc[key] = val;
      }
      return acc;
    },
    {} as LocalizedText
  );
}

function parseLocalizedAmenities(
  value: Prisma.JsonValue | null | undefined
): LocalizedAmenities {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (acc, [key, val]) => {
      if (Array.isArray(val)) {
        acc[key] = val.filter((item): item is string => typeof item === "string");
      }
      return acc;
    },
    {} as LocalizedAmenities
  );
}

function mapRoom(room: PrismaRoom): Room {
  return {
    id: room.id,
    name: parseLocalizedText(room.name),
    description: parseLocalizedText(room.description),
    image: room.image,
    price: room.price,
    capacity: room.capacity,
    size: room.size,
    amenities: parseLocalizedAmenities(room.amenities),
    order: room.order,
    active: room.active,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}

export async function getRooms(options: { includeInactive?: boolean } = {}) {
  noStore();
  const { includeInactive = false } = options;

  const rooms = await prisma.room.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { order: "asc" },
  });

  return rooms.map(mapRoom);
}

export async function getRoomById(id: string) {
  noStore();
  const room = await prisma.room.findUnique({ where: { id } });
  return room ? mapRoom(room) : null;
}
