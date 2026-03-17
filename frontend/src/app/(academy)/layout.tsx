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
      <main className="ml-0 min-h-[calc(100vh-6rem)] p-4 md:ml-56 md:p-6">
        {children}
      </main>
    </div>
  );
}
