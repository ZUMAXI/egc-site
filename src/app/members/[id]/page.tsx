import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProfileBadges from "../../components/ProfileBadges";
import ProfileAvatar from "../../components/ProfileAvatar";
import AnimatedCard from "../../components/AnimatedCard";

export const dynamic = "force-dynamic";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <AnimatedCard>
          <div className="p-8">
            <div className="mb-6">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                nickname={profile.nickname}
                accessRole={profile.access_role}
                size={128}
              />
            </div>

            <h1 className="text-5xl font-black">
              {profile.nickname || profile.telegram_name || "Участник"}
            </h1>

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

            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-bold">Описание</h2>

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