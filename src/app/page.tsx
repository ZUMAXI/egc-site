const nav = ["Новости", "Участники", "Лор", "Союзы", "Магазин", "Правила"];

const stats = [
  { label: "Администрация", value: "7" },
  { label: "Глав лора", value: "3" },
  { label: "Валюты", value: "2" },
  { label: "Товаров", value: "3" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold tracking-wide">♟ EgC</div>

        <nav className="hidden gap-5 text-sm text-zinc-300 md:flex">
          {nav.map((item) => (
            <a key={item} href="#" className="hover:text-white">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-zinc-500">
          The Eternal Game of Chess
        </p>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          Добро пожаловать в вечную партию
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Шахматный клан Pony Town с лором, нациями, рангами, валютой,
          магазином, событиями и собственной системой управления.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a className="rounded-2xl bg-white px-7 py-3 font-semibold text-black" href="#">
            Читать новости
          </a>
          <a className="rounded-2xl border border-white/20 px-7 py-3 font-semibold text-white" href="#">
            Смотреть лор
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-4xl font-black">{item.value}</div>
            <div className="mt-2 text-sm text-zinc-400">{item.label}</div>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">⚪ White Nation</h2>
          <p className="mt-3 text-zinc-400">
            Порядок, совершенство и строгая дисциплина.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">⚫ Black Nation</h2>
          <p className="mt-3 text-zinc-400">
            Боль, стойкость и сила, выкованная испытаниями.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">🏛 Трактир</h2>
          <p className="mt-3 text-zinc-400">
            Место, где начинается путь каждой фигуры.
          </p>
        </div>
      </section>
    </main>
  );
}