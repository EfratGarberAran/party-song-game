import { EventPageContent } from "./EventPageContent";

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventPageContent eventId={id} />;
}
