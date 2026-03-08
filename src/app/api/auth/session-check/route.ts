import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUserId, getCurrentUser } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const hasCookie = !!cookieStore.get("party_session")?.value;
  const userId = await getSessionUserId();
  const user = await getCurrentUser();
  return NextResponse.json({
    hasCookie,
    hasSession: !!userId,
    user: user ? { id: user.id, email: user.email } : null,
  });
}
