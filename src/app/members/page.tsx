import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProfileBadges from "../components/ProfileBadges";
import ProfileAvatar from "../components/ProfileAvatar";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Участники EgC"
          text="Нажми на участника, чтобы открыть его профиль."
        />

        <div className="grid gap-4">
          {profiles?.map((profile, index) => (
            <AnimatedCard key={profile.id} delay={index * 0.05}>
              <Link
                href={`/members/${profile.id}`}
                className="flex items-center gap-4 p-4"
              >
                <ProfileAvatar
                  avatarUrl={profile.avatar_url}
                  nickname={profile.nickname}
                  accessRole={profile.access_role}
                  size={56}
                />

                <div>
                  <h2 className="text-xl font-bold">
                    {profile.nickname || profile.telegram_name || "Участник"}
                  </h2>

                  <p className="text-sm text-zinc-400">
                    @{profile.telegram_username || "telegram"}
                  </p>

                  <ProfileBadges
                    position={profile.position}
                    accessRole={profile.access_role}
                  />

                  <p className="mt-2 text-sm text-zinc-500">
                    👣 {profile.steps || 0} • ♟ {profile.moves || 0}
                  </p>
                </div>
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </main>
  );
}