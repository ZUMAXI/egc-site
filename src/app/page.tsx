import Link from "next/link";

const nav = [
  { label: "Новости", href: "/news" },
  { label: "Участники", href: "/members" },
  { label: "Лор", href: "/lore" },
  { label: "Союзы", href: "/allies" },
  { label: "Магазин", href: "/shop" },
  { label: "Правила", href: "/rules" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <header className="flex justify-between items-center p-8">
        <div className="text-2xl font-bold">♟ EgC</div>

        <nav className="flex gap-6 text-zinc-400">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="flex flex-col items-center text-center mt-24 px-8">

        <div className="tracking-[8px] text-zinc-500 mb-8">
          THE ETERNAL GAME OF CHESS
        </div>

        <h1 className="text-7xl font-bold max-w-4xl mb-8">
          Добро пожаловать в вечную партию
        </h1>

        <p className="text-zinc-400 text-xl max-w-3xl mb-12">
          Шахматный клан Pony Town с лором, нациями, рангами,
          валютой, магазином, событиями и собственной системой управления.
        </p>

        <div className="flex gap-6">

          <Link
            href="/news"
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
          >
            Читать новости
          </Link>

          <Link
            href="/lore"
            className="border border-zinc-700 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-900 transition"
          >
            Смотреть лор
          </Link>

        </div>

      </section>
    </main>
  );
}