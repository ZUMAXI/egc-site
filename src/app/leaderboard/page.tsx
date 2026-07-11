import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Profile = {
  id: number;
  nickname: string | null;
  telegram_name: string | null;
  telegram_username: string | null;
  avatar_url: string | null;
  position: string | null;
  rank: string | null;
  steps: number | null;
  moves: number | null;
};

function getProfileName(profile: Profile) {
  return (
    profile.nickname ||
    profile.telegram_name ||
    profile.telegram_username ||
    "Участник"
  );
}

function getPlaceIcon(place: number) {
  if (place === 1) return "🥇";
  if (place === 2) return "🥈";
  if (place === 3) return "🥉";

  return `${place}.`;
}

function LeaderboardList({
  title,
  description,
  icon,
  profiles,
  currency,
}: {
  title: string;
  description: string;
  icon: string;
  profiles: Profile[];
  currency: "steps" | "moves";
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 bg-black/30 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
            {icon}
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{title}</h2>

            <p className="mt-1 text-sm text-zinc-400">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid">
        {profiles.length > 0 ? (
          profiles.map((profile, index) => {
            const place = index + 1;
            const value =
              currency === "steps"
                ? Number(profile.steps || 0)
                : Number(profile.moves || 0);

            return (
              <Link
                key={profile.id}
                href={`/members/${profile.id}`}
                className={`group flex items-center gap-4 border-b border-white/10 p-4 transition last:border-b-0 hover:bg-white/10 ${
                  place <= 3 ? "bg-white/[0.025]" : ""
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${
                    place === 1
                      ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                      : place === 2
                        ? "border border-zinc-400/30 bg-zinc-400/10 text-zinc-200"
                        : place === 3
                          ? "border border-orange-500/30 bg-orange-500/10 text-orange-300"
                          : "border border-white/10 bg-white/5 text-zinc-400"
                  }`}
                >
                  {getPlaceIcon(place)}
                </div>

                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={getProfileName(profile)}
                    className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black text-2xl">
                    ♟
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-white transition group-hover:text-yellow-200">
                    {getProfileName(profile)}
                  </div>

                  <div className="mt-1 truncate text-xs text-zinc-500">
                    {profile.position || "Guest"}
                    {profile.rank ? ` • ${profile.rank}` : ""}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xl font-black text-white">
                    {value.toLocaleString("ru-RU")}
                  </div>

                  <div className="mt-1 text-xs text-zinc-500">
                    {currency === "steps" ? "шагов" : "ходов"}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-8 text-center text-zinc-500">
            Участников пока нет.
          </div>
        )}
      </div>
    </section>
  );
}

export default async function LeaderboardPage() {
  const profileFields = `
    id,
    nickname,
    telegram_name,
    telegram_username,
    avatar_url,
    position,
    rank,
    steps,
    moves
  `;

  const [
    { data: stepsProfiles, error: stepsError },
    { data: movesProfiles, error: movesError },
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select(profileFields)
      .order("steps", {
        ascending: false,
        nullsFirst: false,
      })
      .order("id", {
        ascending: true,
      }),

    supabaseAdmin
      .from("profiles")
      .select(profileFields)
      .order("moves", {
        ascending: false,
        nullsFirst: false,
      })
      .order("id", {
        ascending: true,
      }),
  ]);

  if (stepsError) {
    console.error("Steps leaderboard error:", stepsError);
  }

  if (movesError) {
    console.error("Moves leaderboard error:", movesError);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          title="Рейтинг валюты EgC"
          text="Текущий рейтинг участников по количеству шагов и ходов."
        />

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-zinc-400">
          Рейтинг формируется автоматически из текущего баланса участников.
          После начисления награды, покупки товара или изменения валюты новые
          значения появятся при следующем открытии или обновлении страницы.
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <LeaderboardList
            title="Топ по шагам"
            description="Участники с наибольшим количеством шагов"
            icon="👣"
            profiles={(stepsProfiles || []) as Profile[]}
            currency="steps"
          />

          <LeaderboardList
            title="Топ по ходам"
            description="Участники с наибольшим количеством ходов"
            icon="♟"
            profiles={(movesProfiles || []) as Profile[]}
            currency="moves"
          />
        </div>
      </div>
    </main>
  );
}