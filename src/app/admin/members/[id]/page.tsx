import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminMemberEditForm from "./AdminMemberEditForm";

export const dynamic = "force-dynamic";

export default async function AdminMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) redirect("/login");

  const { data: currentUser } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!currentUser) redirect("/login");

  const currentAccessRole = currentUser.access_role || "guest";

  if (currentAccessRole !== "host" && currentAccessRole !== "admin") {
    redirect("/profile");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/members" className="mb-8 inline-block text-zinc-400 hover:text-white">
          ← Назад к участникам
        </Link>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.nickname}
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

          <p className="mt-6 whitespace-pre-line text-zinc-300">
            {profile.bio || "Описание профиля пока не заполнено."}
          </p>
        </div>

        <AdminMemberEditForm
          profile={profile}
          currentAccessRole={currentAccessRole}
        />
      </div>
    </main>
  );
}