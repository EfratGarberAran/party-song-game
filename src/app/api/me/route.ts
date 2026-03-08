import { NextRequest, NextResponse } from "next/server";
import { getSessionUserIdForRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Returns current user or 401. Use in client with credentials: 'include'. */
export async function GET(req: NextRequest) {
  const userId = await getSessionUserIdForRequest(
    req.headers.get("cookie"),
    req.headers.get("x-party-session-token")
  );
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(user);
}
