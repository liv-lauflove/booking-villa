import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Jika belum login, atau jika role-nya bukan admin, tendang ke homepage
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-serif font-bold text-primary">Umbu Admin</h1>
        </div>
        <nav className="p-4 flex-1 space-y-2">
          <a href="/admin" className="block px-4 py-3 rounded-xl hover:bg-muted text-foreground transition-colors font-medium">
            Dashboard
          </a>
          <a href="/admin/villas" className="block px-4 py-3 rounded-xl hover:bg-muted text-foreground transition-colors font-medium">
            Manajemen Villa
          </a>
          <a href="/" className="block px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground transition-colors font-medium mt-auto">
            &larr; Ke Website Utama
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
