import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminShopForm from "./AdminShopForm";

export const dynamic = "force-dynamic";

export default async function AdminShopPage() {
  const { data: items } = await supabaseAdmin
    .from("shop_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Управление магазином</h1>

        <p className="mb-10 text-zinc-400">
          Создание и редактирование товаров.
        </p>

        <AdminShopForm items={items || []} />
      </div>
    </main>
  );
}