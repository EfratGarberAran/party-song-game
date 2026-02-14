import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { JoinEventForm } from "./JoinEventForm";

export default async function EventJoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const event = await prisma.event.findUnique({
    where: { code },
    select: { id: true, name: true, question: true, status: true },
  });
  if (!event) notFound();
  if (event.status !== "collecting") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-party-mesh" dir="rtl">
        <div className="card-party text-center max-w-sm">
          <p className="text-slate-600 mb-4">
            האירוע כבר התחיל או הסתיים. אם את משתתפת, פתחי את דף המשחק.
          </p>
          <a href={`/event/${code}/play`} className="btn-party-primary inline-block">
            לדף המשחק
          </a>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-party-mesh" dir="rtl">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2 text-slate-800">{event.name}</h1>
        <p className="text-lg text-slate-600 mb-8">{event.question}</p>
        <div className="card-party">
          <JoinEventForm eventId={event.id} eventCode={code} />
        </div>
      </div>
    </main>
  );
}
