import { supabase } from "@/lib/supabase";
import EventsTabs from "./EventsTabs";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [{ data: events }, { data: schedule }] = await Promise.all([
    supabase.from("events").select("*").order("id"),
    supabase
      .from("event_schedule")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="События EgC"
          text="Сборы, РПБ, тренировки, обходы и другие активности клана."
        />

        <AnimatedCard>
          <div className="p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-4xl font-black">Расписание недели</h2>

                <p className="mt-2 text-zinc-400">
                  Основные активности клана по дням.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-400">
                Время по МСК
              </div>
            </div>

            <div className="grid gap-3">
              {schedule && schedule.length > 0 ? (
                schedule.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:bg-white/10 md:grid-cols-[180px_180px_1fr] md:items-center"
                  >
                    <div
                      className={`w-fit rounded-full px-4 py-2 font-bold ${
                        item.accent || "bg-zinc-500/15 text-zinc-300"
                      }`}
                    >
                      {item.day_name || "День"}
                    </div>

                    <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-zinc-300">
                      {item.start_time || "—"}
                      {item.end_time ? ` — ${item.end_time}` : ""}
                    </div>

                    <div className="text-lg font-semibold">
                      {item.title || "Отдых"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-zinc-400">
                  Расписание пока не заполнено.
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
                📍 Все мероприятия проходят на{" "}
                <span className="text-white">2РУ</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
                🕒 Время указано по <span className="text-white">МСК</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
                ⚠️ Расписание может{" "}
                <span className="text-white">меняться</span>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-black">Ближайшие события</h2>

          <EventsTabs events={events || []} />
        </div>
      </div>
    </main>
  );
}