import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function AlliesPage() {
  const { data: allies, error } = await supabase
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

  if (error) {
    console.error("Allies page error:", error);
  }

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
                        {ally.status || "🤝 Союз"}
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

                    <div
                      className={[
                        "mt-6 text-lg leading-8 text-zinc-300",

                        "[&_p]:my-4",

                        "[&_h1]:mb-5",
                        "[&_h1]:mt-7",
                        "[&_h1]:text-4xl",
                        "[&_h1]:font-black",
                        "[&_h1]:leading-tight",

                        "[&_h2]:mb-4",
                        "[&_h2]:mt-6",
                        "[&_h2]:text-3xl",
                        "[&_h2]:font-black",
                        "[&_h2]:leading-tight",

                        "[&_h3]:mb-3",
                        "[&_h3]:mt-5",
                        "[&_h3]:text-2xl",
                        "[&_h3]:font-bold",

                        "[&_strong]:font-black",
                        "[&_em]:italic",
                        "[&_u]:underline",
                        "[&_s]:line-through",

                        "[&_ul]:my-5",
                        "[&_ul]:list-disc",
                        "[&_ul]:pl-8",

                        "[&_ol]:my-5",
                        "[&_ol]:list-decimal",
                        "[&_ol]:pl-8",

                        "[&_li]:my-2",

                        "[&_blockquote]:my-6",
                        "[&_blockquote]:rounded-2xl",
                        "[&_blockquote]:border-l-4",
                        "[&_blockquote]:border-white/20",
                        "[&_blockquote]:bg-white/5",
                        "[&_blockquote]:px-6",
                        "[&_blockquote]:py-4",
                        "[&_blockquote]:italic",
                        "[&_blockquote]:text-zinc-300",

                        "[&_code]:rounded-md",
                        "[&_code]:bg-white/10",
                        "[&_code]:px-1.5",
                        "[&_code]:py-0.5",
                        "[&_code]:font-mono",
                        "[&_code]:text-sm",
                        "[&_code]:text-emerald-300",

                        "[&_pre]:my-6",
                        "[&_pre]:overflow-x-auto",
                        "[&_pre]:rounded-2xl",
                        "[&_pre]:border",
                        "[&_pre]:border-white/10",
                        "[&_pre]:bg-zinc-950",
                        "[&_pre]:p-5",

                        "[&_pre_code]:bg-transparent",
                        "[&_pre_code]:p-0",

                        "[&_hr]:my-8",
                        "[&_hr]:border-white/10",

                        "[&_a]:text-blue-400",
                        "[&_a]:underline",
                        "[&_a]:underline-offset-4",
                        "[&_a]:transition",
                        "[&_a:hover]:text-blue-300",
                      ].join(" ")}
                      dangerouslySetInnerHTML={{
                        __html: ally.description || "",
                      }}
                    />
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