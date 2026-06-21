import { supabase } from "@/lib/supabase";
import EventsTabs from "./EventsTabs";

export const dynamic = "force-dynamic";

const schedule = [
  { day: "Понедельник", time: "21:00 - 21:40", name: "Набор" },
  { day: "Вторник", time: "", name: "Отдых" },
  { day: "Среда", time: "21:00", name: "Обход / после набор" },
  { day: "Четверг", time: "", name: "Отдых" },
  { day: "Пятница", time: "", name: "Отдых" },
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

        <section className="mb-12 rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl shadow-purple-500/10">
          <p className="text-sm font-bold tracking-widest text-red-400">
            The Eternal Game of Chess - Info
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-[0.25em] text-zinc-300">
            РАСПИСАНИЕ
          </h2>

          <div className="mt-8 grid gap-4">
            {schedule.map((item) => (
              <div key={item.day}>
                <div className="inline-flex rounded-lg border-l-4 border-red-400 bg-white/10 px-4 py-1 text-lg">
                  {item.day}:
                </div>

                <div className="mt-2 text-xl text-zinc-200">
                  ↳{" "}
                  {item.time ? (
                    <span className="tracking-[0.25em] text-zinc-400">
                      {item.time}
                    </span>
                  ) : null}{" "}
                  «{item.name}»
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-zinc-300">
            ━━━━━━━ ◦ ❖ ◦ ━━━━━━━
          </div>

          <p className="mt-6 text-center italic text-zinc-300">
            ⪼ Мы встречаемся на 2РУ, по МСК времени ⪻
            <br />
            ⪼ ❕ Расписание может меняться ❕ ⪻
          </p>
        </section>

        <h2 className="mb-6 text-3xl font-black">Ближайшие события</h2>

        <EventsTabs events={events || []} />
      </div>
    </main>
  );
}