import { supabase } from "@/lib/supabase";
import EventsTabs from "./EventsTabs";

export const dynamic = "force-dynamic";

const schedule = [
  { day: "Понедельник", time: "21:00 — 21:40", name: "Набор", accent: "bg-sky-500/15 text-sky-300" },
  { day: "Вторник", time: "—", name: "Отдых", accent: "bg-zinc-500/15 text-zinc-300" },
  { day: "Среда", time: "21:00", name: "Обход / после набор", accent: "bg-violet-500/15 text-violet-300" },
  { day: "Четверг", time: "—", name: "Отдых", accent: "bg-zinc-500/15 text-zinc-300" },
  { day: "Пятница", time: "—", name: "Отдых", accent: "bg-zinc-500/15 text-zinc-300" },
  { day: "Суббота", time: "20:30", name: "РПБ", accent: "bg-yellow-500/15 text-yellow-300" },
  { day: "Воскресенье", time: "20:00", name: "Тренировка", accent: "bg-emerald-500/15 text-emerald-300" },
];

export default async function EventsPage() {
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">События EgC</h1>

        <p className="mb-10 text-zinc-400">
          Сборы, РПБ, тренировки, обходы и другие активности клана.
        </p>

        <section className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-white/5 backdrop-blur md:p-8">
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
            {schedule.map((item) => (
              <div
                key={item.day}
                className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:-translate-y-0.5 hover:bg-white/10 md:grid-cols-[180px_180px_1fr] md:items-center"
              >
                <div className={`w-fit rounded-full px-4 py-2 font-bold ${item.accent}`}>
                  {item.day}
                </div>

                <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-zinc-300">
                  {item.time}
                </div>

                <div className="text-lg font-semibold text-white">
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
              📍 Все мероприятия проходят на <span className="text-white">2РУ</span>.
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
              🕒 Время указано по <span className="text-white">МСК</span>.
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
              ⚠️ Расписание может <span className="text-white">меняться</span>.
            </div>
          </div>
        </section>

        <h2 className="mb-6 text-3xl font-black">Ближайшие события</h2>

        <EventsTabs events={events || []} />
      </div>
    </main>
  );
}