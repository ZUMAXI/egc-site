import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminAlliesForm from "./AdminAlliesForm";

export const dynamic = "force-dynamic";

export default async function AdminAlliesPage() {
  const { data: allies } = await supabaseAdmin
    .from("allies")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, telegram_name, telegram_username")
    .order("id");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Управление союзами</h1>

        <p className="mb-10 text-zinc-400">
          Создание, редактирование и удаление союзов EgC.
        </p>

        <AdminAlliesForm allies={allies || []} profiles={profiles || []} />
      </div>
    </main>
  );
}