import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminUserInventoryForm from "./AdminUserInventoryForm";

export const dynamic = "force-dynamic";

function getProfileName(profile: any) {
  return (
    profile.nickname ||
    profile.telegram_name ||
    profile.telegram_username ||
    "Участник"
  );
}

export default async function UserInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const { data: inventory } = await supabaseAdmin
    .from("inventory")
    .select(`
      id,
      created_at,
      item:shop_items (
        id,
        name,
        image_url,
        description
      )
    `)
    .eq("profile_id", id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-5xl font-black">
          Инвентарь {profile ? getProfileName(profile) : "участника"}
        </h1>

        <p className="mb-10 text-zinc-400">
          Купленные предметы и управление ими.
        </p>

        <AdminUserInventoryForm inventory={inventory || []} />
      </div>
    </main>
  );
}