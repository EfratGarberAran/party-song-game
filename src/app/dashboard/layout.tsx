import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-party-mesh" dir="rtl">
      <header className="border-b border-party-rose/30 bg-white/80 backdrop-blur-sm px-4 py-4 flex justify-between items-center shadow-party">
        <nav className="flex gap-6 items-center">
          <Link href="/dashboard" className="font-bold text-slate-800 hover:text-party-pink transition">
            האירועים שלי
          </Link>
          <Link href="/dashboard/new" className="font-medium text-party-pink hover:text-party-coral transition">
            אירוע חדש
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:inline">{user.email}</span>
          <Link href="/api/auth/logout" className="text-sm font-medium text-slate-500 hover:text-party-coral transition">
            יציאה
          </Link>
        </div>
      </header>
      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
