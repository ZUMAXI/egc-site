import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const sections = [
  { title: "👥 Участники", text: "Роли, должности, шаги и ходы.", href: "/admin/members" },
  { title: "📰 Новости", text: "Создание и редактирование новостей.", href: "/admin/news" },
  { title: "📖 Лор", text: "Главы истории и пролог.", href: "/admin/lore" },
  { title: "📜 Правила", text: "Разделы правил и изображения.", href: "/admin/rules" },
  { title: "📅 События", text: "Ивенты, расписание и награды.", href: "/admin/events" },
  { title: "🛒 Магазин", text: "Товары, цены и картинки.", href: "/admin/shop" },
];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    redirect("/login");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const accessRole = profile.access_role || "guest";

  if (accessRole !== "host" && accessRole !== "admin") {
    redirect("/profile");
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-5xl font-black">Админ-панель EgC</h1>

        <p className="mb-10 text-zinc-400">
          Управление сайтом. Доступ открыт только администрации.
        </p>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-zinc-400">Вы вошли как:</p>
          <h2 className="mt-2 text-2xl font-bold">
            {profile.nickname || profile.telegram_name}
          </h2>
          <p className="mt-1 text-zinc-500">
            Доступ: {accessRole} • Должность: {profile.position || "Guest"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <p className="mt-3 text-zinc-400">{section.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}