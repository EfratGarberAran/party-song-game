import { NextRequest, NextResponse } from "next/server";
import { getSessionUserIdForRequest, consumeOneTimeEventToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserIdForRequest(
    req.headers.get("cookie"),
    req.headers.get("x-party-session-token")
  );
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
  const contentType = (req.headers.get("content-type") || "").toLowerCase();
  const isForm = contentType.includes("form");

  let userId: string | null = null;
  let name = "";
  let question = "";

  if (isForm) {
    const formData = await req.formData();
    const token = formData.get("create_event_token");
    userId = await consumeOneTimeEventToken(
      typeof token === "string" ? token : null
    );
    name = String(formData.get("name") ?? "").trim();
    question = String(formData.get("question") ?? "").trim();
  }

  if (!userId) {
    userId = await getSessionUserIdForRequest(
      req.headers.get("cookie"),
      req.headers.get("x-party-session-token")
    );
  }

  if (!userId) {
    if (isForm) {
      return NextResponse.redirect(new URL("/login?error=session", req.url), 302);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isForm) {
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
  if (isForm) {
    return NextResponse.redirect(new URL(`/dashboard/event/${event.id}`, req.url), 302);
  }
  return NextResponse.json(event);
}
