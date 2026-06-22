import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AlliesPage() {
  const { data: allies } = await supabase
    .from("allies")
    .select(`
      *,
      leader:profiles!leader_profile_id (
        id,
        nickname,
        telegram_name,
        telegram_username
      )
    `)
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Союзы EgC</h1>

        <p className="mb-10 text-zinc-400">
          Здесь отображаются союзные проекты и кланы.
        </p>

        <div className="grid gap-8">
          {allies && allies.length > 0 ? (
            allies.map((ally) => (
              <article
                key={ally.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                {ally.image_url ? (
                  <img
                    src={ally.image_url}
                    alt={ally.name}
                    className="max-h-[500px] w-full bg-black object-contain"
                  />
                ) : null}

                <div className="p-8">
                  <div className="mb-2 text-sm text-zinc-500">
                    Статус: {ally.status || "🤝 Союз"}
                  </div>

                  <div className="mb-3 text-sm text-zinc-500">
                    Лидер:{" "}
                    {ally.leader ? (
                      <Link
                        href={`/members/${ally.leader.id}`}
                        className="text-white hover:underline"
                      >
                        {ally.leader.nickname ||
                          ally.leader.telegram_name ||
                          ally.leader.telegram_username ||
                          "Участник"}
                      </Link>
                    ) : (
                      "Не указан"
                    )}
                  </div>

                  <h2 className="text-3xl font-bold">{ally.name}</h2>

                  <p className="mt-4 whitespace-pre-line text-zinc-300">
                    {ally.description}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
              Союзов пока нет.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}