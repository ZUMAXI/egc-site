import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "./LogoutButton";
import ProfileBadges from "../components/ProfileBadges";
import ProfileAvatar from "../components/ProfileAvatar";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

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
        <SectionTitle title="Мой профиль" />

        <AnimatedCard>
          <div className="p-8">
            <div className="mb-6">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                nickname={profile.nickname}
                accessRole={profile.access_role}
                size={112}
              />
            </div>

            <h2 className="text-4xl font-black">
              {profile.nickname || profile.telegram_name}
            </h2>

            <p className="mt-2 text-zinc-400">
              @{profile.telegram_username || "telegram"}
            </p>

            <ProfileBadges
              position={profile.position}
              accessRole={profile.access_role}
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <AnimatedCard>
                <div className="p-5">
                  <div className="text-sm text-zinc-500">Шаги</div>

                  <div className="mt-2 text-3xl font-black">
                    👣 {profile.steps || 0}
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard>
                <div className="p-5">
                  <div className="text-sm text-zinc-500">Ходы</div>

                  <div className="mt-2 text-3xl font-black">
                    ♟ {profile.moves || 0}
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/profile/edit"
                className="rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105"
              >
                Редактировать профиль
              </a>

              <a
                href="/inventory"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Мой инвентарь
              </a>

              <LogoutButton />
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-bold">Описание</h3>

              <p className="whitespace-pre-line text-lg leading-8 text-zinc-300">
                {profile.bio || "Описание профиля пока не заполнено."}
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </main>
  );
}