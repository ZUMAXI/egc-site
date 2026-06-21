import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminMembersForm from "./AdminMembersForm";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) redirect("/login");

  const { data: currentUser } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!currentUser) redirect("/login");

  const accessRole = currentUser.access_role || "guest";

  if (accessRole !== "host" && accessRole !== "admin") {
    redirect("/profile");
  }

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-5xl font-black">Управление участниками</h1>

        <p className="mb-10 text-zinc-400">
          Здесь можно менять должности, доступ, шаги и ходы.
        </p>

        <AdminMembersForm
          profiles={profiles || []}
          currentAccessRole={accessRole}
        />
      </div>
    </main>
  );
}