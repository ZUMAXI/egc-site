import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

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
        <SectionTitle
          title="Союзы EgC"
          text="Здесь отображаются союзные проекты и кланы."
        />

        <div className="grid gap-6">
          {allies && allies.length > 0 ? (
            allies.map((ally, index) => (
              <AnimatedCard
                key={ally.id}
                delay={index * 0.05}
              >
                <article className="overflow-hidden">
                  {ally.image_url ? (
                    <img
                      src={ally.image_url}
                      alt={ally.name}
                      className="max-h-[500px] w-full bg-black object-contain"
                    />
                  ) : null}

                  <div className="p-8">
                    <div className="mb-4 flex flex-wrap gap-3">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
                        🤝 {ally.status || "Союз"}
                      </span>
                    </div>

                    <h2 className="text-3xl font-black">
                      {ally.name}
                    </h2>

                    <div className="mt-4 text-sm text-zinc-400">
                      Лидер:{" "}
                      {ally.leader ? (
                        <Link
                          href={`/members/${ally.leader.id}`}
                          className="font-semibold text-white hover:underline"
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

                    <p className="mt-6 whitespace-pre-line text-lg leading-8 text-zinc-300">
                      {ally.description}
                    </p>
                  </div>
                </article>
              </AnimatedCard>
            ))
          ) : (
            <AnimatedCard>
              <div className="p-8 text-zinc-400">
                Союзов пока нет.
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </main>
  );
}