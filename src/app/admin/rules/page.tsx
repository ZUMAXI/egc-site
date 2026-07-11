import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminRulesForm from "./AdminRulesForm";
import AdminBackButton from "../components/AdminBackButton";

export const dynamic = "force-dynamic";

export default async function AdminRulesPage() {
  const { data: rules, error } = await supabaseAdmin
    .from("rules")
    .select("*")
    .order("order_number", { ascending: true });

  if (error) {
    console.error("Admin rules page error:", error);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <AdminBackButton />

        <h1 className="mb-3 text-5xl font-black">
          Управление правилами
        </h1>

        <p className="mb-10 text-zinc-400">
          Создание, редактирование и удаление разделов правил.
        </p>

        <AdminRulesForm rules={rules || []} />
      </div>
    </main>
  );
}