import { supabase } from "@/lib/supabase";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Новости EgC"
          text="Последние события и объявления проекта."
        />

        <div className="grid gap-6">
          {news && news.length > 0 ? (
            news.map((item, index) => (
              <AnimatedCard key={item.id} delay={index * 0.08}>
                <article className="p-8">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="mb-6 max-h-[500px] w-full rounded-3xl bg-black object-contain"
                    />
                  ) : null}

                  <h2 className="text-3xl font-black">
                    {item.title}
                  </h2>

                  <div
                    className={[
                      "mt-5 text-lg leading-8 text-zinc-300",

                      "[&_p]:my-3",

                      "[&_h1]:mb-4",
                      "[&_h1]:mt-6",
                      "[&_h1]:text-4xl",
                      "[&_h1]:font-black",
                      "[&_h1]:leading-tight",
                      "[&_h1]:text-white",

                      "[&_h2]:mb-3",
                      "[&_h2]:mt-5",
                      "[&_h2]:text-3xl",
                      "[&_h2]:font-black",
                      "[&_h2]:leading-tight",
                      "[&_h2]:text-white",

                      "[&_h3]:mb-3",
                      "[&_h3]:mt-5",
                      "[&_h3]:text-2xl",
                      "[&_h3]:font-bold",
                      "[&_h3]:text-white",

                      "[&_strong]:font-black",
                      "[&_em]:italic",
                      "[&_u]:underline",
                      "[&_s]:line-through",

                      "[&_ul]:my-4",
                      "[&_ul]:list-disc",
                      "[&_ul]:pl-7",

                      "[&_ol]:my-4",
                      "[&_ol]:list-decimal",
                      "[&_ol]:pl-7",

                      "[&_li]:my-1",

                      "[&_blockquote]:my-5",
                      "[&_blockquote]:rounded-2xl",
                      "[&_blockquote]:border-l-4",
                      "[&_blockquote]:border-white/20",
                      "[&_blockquote]:bg-white/5",
                      "[&_blockquote]:px-5",
                      "[&_blockquote]:py-3",
                      "[&_blockquote]:italic",
                      "[&_blockquote]:text-zinc-300",

                      "[&_code]:rounded-md",
                      "[&_code]:bg-white/10",
                      "[&_code]:px-1.5",
                      "[&_code]:py-0.5",
                      "[&_code]:font-mono",
                      "[&_code]:text-sm",
                      "[&_code]:text-emerald-300",

                      "[&_pre]:my-5",
                      "[&_pre]:overflow-x-auto",
                      "[&_pre]:rounded-2xl",
                      "[&_pre]:border",
                      "[&_pre]:border-white/10",
                      "[&_pre]:bg-zinc-950",
                      "[&_pre]:p-5",

                      "[&_pre_code]:bg-transparent",
                      "[&_pre_code]:p-0",

                      "[&_hr]:my-7",
                      "[&_hr]:border-white/10",

                      "[&_a]:text-blue-400",
                      "[&_a]:underline",
                      "[&_a]:underline-offset-4",
                      "[&_a]:transition",
                      "[&_a:hover]:text-blue-300",
                    ].join(" ")}
                    dangerouslySetInnerHTML={{
                      __html: item.content || "",
                    }}
                  />

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
                    <span>
                      Автор: {item.author || "EgC"}
                    </span>

                    <span>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("ru-RU")
                        : ""}
                    </span>
                  </div>
                </article>
              </AnimatedCard>
            ))
          ) : (
            <AnimatedCard>
              <div className="p-8 text-zinc-400">
                Новостей пока нет.
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </main>
  );
}