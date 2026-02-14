import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlayGameClient } from "./PlayGameClient";

export default async function EventPlayPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const event = await prisma.event.findUnique({
    where: { code },
    select: { id: true, name: true, status: true },
  });
  if (!event) notFound();
  return (
    <main className="min-h-screen p-6 bg-party-mesh" dir="rtl">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">{event.name}</h1>
        <PlayGameClient eventId={event.id} eventCode={code} status={event.status} />
      </div>
    </main>
  );
}
