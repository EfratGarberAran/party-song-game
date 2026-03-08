import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createOneTimeEventToken } from "@/lib/auth";
import { NewEventForm } from "./NewEventForm";

export default async function NewEventPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const createEventToken = await createOneTimeEventToken(user.id);

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">אירוע חדש</h1>
      <p className="text-slate-600 mb-6">בחרי שאלה והתחילי לאסוף שירים</p>
      <NewEventForm createEventToken={createEventToken} />
    </div>
  );
}
