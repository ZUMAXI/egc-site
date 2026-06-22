import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminInventoryForm from "./AdminInventoryForm";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const { data: inventory } = await supabaseAdmin
    .from("inventory")
    .select(`
      id,
      created_at,
      owner:profiles (
        id,
        nickname,
        telegram_name,
        telegram_username
      ),
      item:shop_items (
        id,
        name,
        image_url
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-5xl font-black">Инвентари участников</h1>
        <p className="mb-10 text-zinc-400">
          Здесь можно смотреть купленные предметы и удалять ошибочные покупки.
        </p>

        <AdminInventoryForm inventory={inventory || []} />
      </div>
    </main>
  );
}