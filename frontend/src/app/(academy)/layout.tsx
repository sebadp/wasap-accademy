import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import { XPBarClient } from "@/components/gamification/XPBarClient";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <XPBarClient />
      <Sidebar />
      <main className="ml-56 min-h-[calc(100vh-6rem)] p-6">
        {children}
      </main>
    </div>
  );
}
