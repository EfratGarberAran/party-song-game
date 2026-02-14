import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-party",
});

export const metadata: Metadata = {
  title: "Party Song Game | משחק שירים במסיבה",
  description: "משחק שירים במסיבות – אירועים חברתיים אינטראקטיביים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning className={nunito.variable}>
      <body className="min-h-screen bg-party-mesh text-slate-800 font-party">
        {children}
      </body>
    </html>
  );
}
