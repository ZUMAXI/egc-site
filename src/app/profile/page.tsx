import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
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

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-10 text-5xl font-black">Мой профиль</h1>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.nickname}
              className="mb-6 h-28 w-28 rounded-full object-cover"
            />
          ) : null}

          <h2 className="text-3xl font-bold">
            {profile.nickname || profile.telegram_name}
          </h2>

          <p className="mt-2 text-zinc-400">
            @{profile.telegram_username || "telegram"}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Роль</div>
              <div className="font-bold">{profile.role}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Статус</div>
              <div className="font-bold">{profile.status}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Шаги</div>
              <div className="font-bold">{profile.steps}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Ходы</div>
              <div className="font-bold">{profile.moves}</div>
            </div>
          </div>

          <a
            href="/profile/edit"
            className="mt-6 inline-block rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105"
          >
            Редактировать профиль
          </a>

          <p className="mt-6 whitespace-pre-line text-zinc-300">
            {profile.bio || "Описание профиля пока не заполнено."}
          </p>
        </div>
      </div>
    </main>
  );
}