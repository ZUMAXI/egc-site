import Link from "next/link";

const nav = [
  { label: "Главная", href: "/" },
  { label: "Новости", href: "/news" },
  { label: "Участники", href: "/members" },
  { label: "Лор", href: "/lore" },
  { label: "Союзы", href: "/allies" },
  { label: "Магазин", href: "/shop" },
  { label: "Правила", href: "/rules" },
  { label: "События", href: "/events" },
  { label: "Вход", href: "/login" },
];

export default function SiteHeader() {
  return (
    <header className="mx-auto mb-10 flex max-w-6xl flex-col gap-5 px-6 pt-6 md:flex-row md:items-center md:justify-between">
      <Link href="/" className="text-xl font-bold tracking-wide text-white">
        ♟ EgC
      </Link>

      <nav className="flex flex-wrap gap-3 text-sm text-zinc-300">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}