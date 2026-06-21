import { cookies } from "next/headers";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const nav = [
  { label: "Главная", href: "/" },
  { label: "Новости", href: "/news" },
  { label: "Участники", href: "/members" },
  { label: "Лор", href: "/lore" },
  { label: "Союзы", href: "/allies" },
  { label: "Магазин", href: "/shop" },
  { label: "Правила", href: "/rules" },
  { label: "События", href: "/events" },
];

export default async function SiteHeader() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  let accessRole = "guest";

  if (telegramId) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("access_role")
      .eq("telegram_id", telegramId)
      .single();

    accessRole = profile?.access_role || "guest";
  }

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

        {(accessRole === "host" || accessRole === "admin") && (
          <Link
            href="/admin"
            className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-yellow-300 transition hover:bg-yellow-500/20"
          >
            Админ
          </Link>
        )}

        <Link
          href={telegramId ? "/profile" : "/login"}
          className="rounded-full border border-white/10 bg-white px-3 py-2 font-bold text-black transition hover:scale-105"
        >
          {telegramId ? "Профиль" : "Вход"}
        </Link>
      </nav>
    </header>
  );
}