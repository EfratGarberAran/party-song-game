import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { eventId } = await params;
  const event = await prisma.event.findFirst({
    where: { id: eventId, organizerId: userId },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/event/${event.code}`;
  const dataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
  const base64 = dataUrl.split(",")[1];
  if (!base64) return NextResponse.json({ error: "QR failed" }, { status: 500 });
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
