import { supabaseAdmin } from "@/lib/supabaseAdmin";
import GiveItemForm from "./GiveItemForm";
import AdminBackButton from "../components/AdminBackButton";

export const dynamic = "force-dynamic";

export default async function GiveItemPage() {
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, telegram_name, telegram_username")
    .order("id");

  const { data: items } = await supabaseAdmin
    .from("shop_items")
    .select("id, name, image_url")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <AdminBackButton />
        
        <h1 className="mb-3 text-5xl font-black">Выдать предмет</h1>
        <p className="mb-10 text-zinc-400">
          Выдай предмет из магазина любому участнику.
        </p>

        <GiveItemForm profiles={profiles || []} items={items || []} />
      </div>
    </main>
  );
}