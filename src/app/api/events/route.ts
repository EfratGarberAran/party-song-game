import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId, getSessionUserIdFromCookieHeader } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  let userId = await getSessionUserId();
  if (!userId) {
    userId = await getSessionUserIdFromCookieHeader(req.headers.get("cookie"));
  }
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
  let userId = await getSessionUserId();
  if (!userId) {
    userId = await getSessionUserIdFromCookieHeader(req.headers.get("cookie"));
  }
  if (!userId) {
    const isForm = (req.headers.get("content-type") || "").includes("form");
    if (isForm) {
      return NextResponse.redirect(new URL("/login?error=session", req.url), 302);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const contentType = req.headers.get("content-type") || "";
  let name: string;
  let question: string;
  if (contentType.includes("form")) {
    const formData = await req.formData();
    name = String(formData.get("name") ?? "").trim();
    question = String(formData.get("question") ?? "").trim();
  } else {
    const body = await req.json();
    name = typeof body.name === "string" ? body.name.trim() : "";
    question = typeof body.question === "string" ? body.question.trim() : "";
  }
  if (!name || !question) {
    return NextResponse.json({ error: "Name and question required" }, { status: 400 });
  }
  const code = nanoid(8);
  const event = await prisma.event.create({
    data: {
      name,
      question,
      code,
      organizerId: userId,
    },
  });
  if (contentType.includes("form")) {
    return NextResponse.redirect(new URL(`/dashboard/event/${event.id}`, req.url), 302);
  }
  return NextResponse.json(event);
}
