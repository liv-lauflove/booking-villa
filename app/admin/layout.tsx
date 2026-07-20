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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-slate-900 text-white p-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </nav>
      <main className="p-8 flex-1">
        {children}
      </main>
    </div>
  );
}
