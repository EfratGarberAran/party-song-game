import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST() {
  await logout();
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  await logout();
  const origin = req.nextUrl?.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/", origin));
}
