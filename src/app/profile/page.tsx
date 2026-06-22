import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "./LogoutButton";
import ProfileBadges from "../components/ProfileBadges";
import ProfileAvatar from "../components/ProfileAvatar";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!profile) redirect("/login");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-10 text-5xl font-black">Мой профиль</h1>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6">
            <ProfileAvatar
              avatarUrl={profile.avatar_url}
              nickname={profile.nickname}
              accessRole={profile.access_role}
              size={112}
            />
          </div>

          <h2 className="text-3xl font-bold">
            {profile.nickname || profile.telegram_name}
          </h2>

          <p className="mt-2 text-zinc-400">
            @{profile.telegram_username || "telegram"}
          </p>

          <ProfileBadges
            position={profile.position}
            accessRole={profile.access_role}
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Шаги</div>
              <div className="text-2xl font-bold">👣 {profile.steps || 0}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Ходы</div>
              <div className="text-2xl font-bold">♟ {profile.moves || 0}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/profile/edit"
              className="inline-block rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105"
            >
              Редактировать профиль
            </a>

            <a
              href="/inventory"
              className="inline-block rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Мой инвентарь
            </a>

            <LogoutButton />
          </div>

          <p className="mt-6 whitespace-pre-line text-zinc-300">
            {profile.bio || "Описание профиля пока не заполнено."}
          </p>
        </div>
      </div>
    </main>
  );
}