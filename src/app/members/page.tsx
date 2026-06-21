import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-5xl font-black">Участники EgC</h1>

        <p className="mb-10 text-zinc-400">
          Здесь отображаются пользователи, которые вошли через Telegram.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {profiles && profiles.length > 0 ? (
            profiles.map((profile) => (
              <article
                key={profile.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.nickname}
                    className="mb-5 h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-4xl">
                    ♟
                  </div>
                )}

                <h2 className="text-2xl font-bold">
                  {profile.nickname || profile.telegram_name || "Участник"}
                </h2>

                <p className="mt-1 text-zinc-400">
                  @{profile.telegram_username || "telegram"}
                </p>

                <div className="mt-5 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-black/30 p-3">
                    Роль: <span className="text-white">{profile.role}</span>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-3">
                    Статус: <span className="text-white">{profile.status}</span>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-3">
                    Шаги: <span className="text-white">{profile.steps}</span>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-3">
                    Ходы: <span className="text-white">{profile.moves}</span>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 text-zinc-400">
                  {profile.bio || "Описание пока не заполнено."}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400 md:col-span-3">
              Участников пока нет.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}