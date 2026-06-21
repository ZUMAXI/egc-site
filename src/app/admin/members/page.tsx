import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Управление участниками</h1>

        <p className="mb-10 text-zinc-400">
          Нажми на участника, чтобы открыть его настройки.
        </p>

        <div className="grid gap-3">
          {profiles?.map((profile) => (
            <Link
              key={profile.id}
              href={`/admin/members/${profile.id}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.nickname}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
                  ♟
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold">
                  {profile.nickname || profile.telegram_name || "Участник"}
                </h2>

                <p className="text-sm text-zinc-400">
                  @{profile.telegram_username || "telegram"} •{" "}
                  {profile.position || "Guest"} • {profile.access_role || "guest"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}