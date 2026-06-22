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
                <div className="p-8">
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

                  <p className="mt-5 whitespace-pre-line text-lg leading-8 text-zinc-300">
                    {item.content}
                  </p>

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
                </div>
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