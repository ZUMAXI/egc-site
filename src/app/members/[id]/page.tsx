import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.nickname || "Участник"}
              className="mb-6 h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-5xl">
              ♟
            </div>
          )}

          <h1 className="text-5xl font-black">
            {profile.nickname || profile.telegram_name || "Участник"}
          </h1>

          <p className="mt-2 text-zinc-400">
            @{profile.telegram_username || "telegram"}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Должность</div>
              <div className="font-bold">{profile.position || "Guest"}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Доступ</div>
              <div className="font-bold">
                {profile.access_role || "guest"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Шаги</div>
              <div className="font-bold">{profile.steps || 0}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm text-zinc-500">Ходы</div>
              <div className="font-bold">{profile.moves || 0}</div>
            </div>
          </div>

          <p className="mt-8 whitespace-pre-line text-lg leading-8 text-zinc-300">
            {profile.bio || "Описание профиля пока не заполнено."}
          </p>
        </div>
      </div>
    </main>
  );
}