import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const events = await prisma.event.findMany({
    where: { organizerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { participants: true } },
    },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, question } = await req.json();
  if (!name || !question || typeof name !== "string" || typeof question !== "string") {
    return NextResponse.json({ error: "Name and question required" }, { status: 400 });
  }
  const code = nanoid(8);
  const event = await prisma.event.create({
    data: {
      name: name.trim(),
      question: question.trim(),
      code,
      organizerId: userId,
    },
  });
  return NextResponse.json(event);
}
