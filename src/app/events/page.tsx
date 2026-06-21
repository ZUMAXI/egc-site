import { supabase } from "@/lib/supabase";
import EventsTabs from "./EventsTabs";

export const dynamic = "force-dynamic";

const schedule = [
  { day: "Понедельник", time: "21:00 — 21:40", name: "Набор" },
  { day: "Вторник", time: "—", name: "Отдых" },
  { day: "Среда", time: "21:00", name: "Обход / после набор" },
  { day: "Четверг", time: "—", name: "Отдых" },
  { day: "Пятница", time: "—", name: "Отдых" },
  { day: "Суббота", time: "20:30", name: "РПБ" },
  { day: "Воскресенье", time: "20:00", name: "Тренировка" },
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

        <section className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-white/5 backdrop-blur">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
                Weekly schedule
              </p>
              <h2 className="mt-2 text-4xl font-black">Расписание недели</h2>
            </div>

            <p className="text-sm text-zinc-500">
              Время указано по МСК
            </p>
          </div>

          <div className="grid gap-3">
            {schedule.map((item) => (
              <div
                key={item.day}
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:bg-white/10 md:grid-cols-[180px_180px_1fr] md:items-center"
              >
                <div className="font-bold text-white">{item.day}</div>

                <div className="font-mono text-zinc-400">{item.time}</div>

                <div className="text-zinc-200">{item.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-400">
            Мы встречаемся на 2РУ. Расписание может меняться.
          </div>
        </section>

        <h2 className="mb-6 text-3xl font-black">Ближайшие события</h2>

        <EventsTabs events={events || []} />
      </div>
    </main>
  );
}