import Link from "next/link";
import FadeIn from "./components/FadeIn";

const stats = [
  { label: "Администрация", value: "7" },
  { label: "Глав лора", value: "3" },
  { label: "Валюты", value: "2" },
  { label: "Товаров", value: "4" },
];

const cards = [
  {
    title: "⚪ White Nation",
    text: "Порядок, совершенство и строгая дисциплина.",
  },
  {
    title: "⚫ Black Nation",
    text: "Боль, стойкость и сила, выкованная испытаниями.",
  },
  {
    title: "🏛 Трактир",
    text: "Место, где начинается путь каждой фигуры.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(120,80,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <FadeIn delay={0.1}>
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-zinc-500">
            The Eternal Game of Chess
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Добро пожаловать в вечную партию
          </h1>
        </FadeIn>

        <FadeIn delay={0.35}>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Шахматный клан Pony Town с лором, нациями, рангами, валютой,
            магазином, событиями и собственной системой управления.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              className="rounded-2xl bg-white px-7 py-3 font-semibold text-black transition hover:scale-105"
              href="/news"
            >
              Читать новости
            </Link>

            <Link
              className="rounded-2xl border border-white/20 px-7 py-3 font-semibold text-white transition hover:scale-105 hover:bg-white/10"
              href="/lore"
            >
              Смотреть лор
            </Link>
          </div>
        </FadeIn>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-4">
        {stats.map((item, index) => (
          <FadeIn key={item.label} delay={0.65 + index * 0.12}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-white/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
              <div className="text-4xl font-black">{item.value}</div>
              <div className="mt-2 text-sm text-zinc-400">{item.label}</div>
            </div>
          </FadeIn>
        ))}
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        {cards.map((card, index) => (
          <FadeIn key={card.title} delay={1 + index * 0.15}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-white/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
              <h2 className="text-2xl font-bold">{card.title}</h2>
              <p className="mt-3 text-zinc-400">{card.text}</p>
            </div>
          </FadeIn>
        ))}
      </section>
    </main>
  );
}