import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminNewsForm from "./AdminNewsForm";
import AdminBackButton from "../components/AdminBackButton";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) redirect("/login");

  const { data: currentUser } = await supabaseAdmin
    .from("profiles")
    .select("access_role")
    .eq("telegram_id", telegramId)
    .single();

  const accessRole = currentUser?.access_role || "guest";

  if (accessRole !== "host" && accessRole !== "admin") {
    redirect("/profile");
  }

  const { data: news } = await supabaseAdmin
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <AdminBackButton />
        
        <h1 className="mb-3 text-5xl font-black">Управление новостями</h1>

        <p className="mb-10 text-zinc-400">
          Создание, редактирование и удаление новостей EgC.
        </p>

        <AdminNewsForm news={news || []} />
      </div>
    </main>
  );
}