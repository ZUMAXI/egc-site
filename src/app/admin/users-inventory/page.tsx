import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function getProfileName(profile: any) {
  return (
    profile.nickname ||
    profile.telegram_name ||
    profile.telegram_username ||
    "Участник"
  );
}

export default async function UsersInventoryPage() {
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select(`
      id,
      nickname,
      telegram_name,
      telegram_username,
      inventory(id)
    `)
    .order("nickname");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">
          Инвентари участников
        </h1>

        <p className="mb-10 text-zinc-400">
          Выбери участника, чтобы посмотреть его предметы.
        </p>

        <div className="grid gap-4">
          {profiles?.map((profile: any) => (
            <div
              key={profile.id}
              className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div>
                <h2 className="text-2xl font-bold">
                  {getProfileName(profile)}
                </h2>

                <p className="mt-2 text-zinc-500">
                  Предметов: {profile.inventory?.length || 0}
                </p>
              </div>

              <Link
                href={`/admin/inventory/${profile.id}`}
                className="rounded-2xl bg-white px-5 py-3 font-bold text-black transition hover:scale-105"
              >
                Открыть
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}