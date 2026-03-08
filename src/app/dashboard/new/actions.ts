"use server";

import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function createEventAction(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) {
    return { error: "Unauthorized" };
  }
  const name = formData.get("name");
  const question = formData.get("question");
  if (!name || !question || typeof name !== "string" || typeof question !== "string") {
    return { error: "נדרשים שם ושאלה" };
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
  redirect(`/dashboard/event/${event.id}`);
}
