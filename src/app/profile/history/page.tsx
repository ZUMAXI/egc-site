import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AnimatedCard from "../../components/AnimatedCard";
import SectionTitle from "../../components/SectionTitle";

export const dynamic = "force-dynamic";

function formatDate(date: string | null) {
  if (!date) return "Дата неизвестна";

  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStyle(type: string) {
  switch (type) {
    case "reward":
      return { icon: "🎁", label: "Награда", className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" };
    case "purchase":
      return { icon: "🛒", label: "Покупка", className: "border-red-500/20 bg-red-500/10 text-red-300" };
    case "currency":
      return { icon: "💰", label: "Изменение валюты", className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300" };
    case "rank":
      return { icon: "🏅", label: "Ранг", className: "border-amber-500/20 bg-amber-500/10 text-amber-300" };
    case "position":
      return { icon: "👑", label: "Должность", className: "border-purple-500/20 bg-purple-500/10 text-purple-300" };
    case "access":
      return { icon: "🔐", label: "Доступ", className: "border-blue-500/20 bg-blue-500/10 text-blue-300" };
    case "bio":
      return { icon: "📝", label: "Описание", className: "border-zinc-500/20 bg-zinc-500/10 text-zinc-300" };
    case "avatar":
      return { icon: "🖼️", label: "Аватар", className: "border-pink-500/20 bg-pink-500/10 text-pink-300" };
    default:
      return { icon: "📜", label: "Запись", className: "border-white/10 bg-white/5 text-zinc-300" };
  }
}

function getTitle(log: any) {
  if (log.action_type === "reward") return log.reward_reason || "Получена награда";
  if (log.action_type === "purchase") return log.reward_reason || "Покупка товара";
  if (log.action_type === "currency") return "Ручное изменение валюты";
  if (log.action_type === "rank") return "Изменение ранга";
  if (log.action_type === "position") return "Изменение должности";
  if (log.action_type === "access") return "Изменение доступа";
  if (log.action_type === "bio") return "Изменение описания";
  if (log.action_type === "avatar") return "Изменение аватара";
  return "Действие аккаунта";
}

export default async function AccountHistoryPage() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!profile) redirect("/login");

  const profileName =
    profile.nickname ||
    profile.telegram_name ||
    profile.telegram_username ||
    "Участник";

  const { data: logs } = await supabaseAdmin
    .from("admin_logs")
    .select("*")
    .eq("target_name", profileName)
    .in("action_type", [
      "reward",
      "currency",
      "purchase",
      "rank",
      "position",
      "access",
      "bio",
      "avatar",
    ])
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="История аккаунта"
          text="Все действия, связанные с твоим аккаунтом."
        />

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <AnimatedCard>
            <div className="p-5">
              <div className="text-sm text-zinc-500">Текущие шаги</div>
              <div className="mt-2 text-3xl font-black">👣 {profile.steps || 0}</div>
            </div>
          </AnimatedCard>

          <AnimatedCard>
            <div className="p-5">
              <div className="text-sm text-zinc-500">Текущие ходы</div>
              <div className="mt-2 text-3xl font-black">♟ {profile.moves || 0}</div>
            </div>
          </AnimatedCard>
        </div>

        <div className="grid gap-4">
          {logs && logs.length > 0 ? (
            logs.map((log, index) => {
              const style = getStyle(log.action_type);
              const steps = Number(log.steps_delta || 0);
              const moves = Number(log.moves_delta || 0);

              return (
                <AnimatedCard key={log.id} delay={index * 0.04}>
                  <div className="p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className={`mb-4 w-fit rounded-full border px-4 py-2 text-sm font-bold ${style.className}`}>
                          {style.icon} {style.label}
                        </div>

                        <h2 className="text-2xl font-black">{getTitle(log)}</h2>

                        <p className="mt-2 text-sm text-zinc-500">
                          {formatDate(log.created_at)}
                        </p>
                      </div>
                    </div>

                    {log.action_type === "reward" ||
                    log.action_type === "currency" ||
                    log.action_type === "purchase" ? (
                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <div className={`rounded-2xl border p-5 ${
                          steps < 0
                            ? "border-red-500/20 bg-red-500/10 text-red-200"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        }`}>
                          <div className="text-sm opacity-80">Шаги</div>
                          <div className="mt-2 text-3xl font-black">
                            {steps >= 0 ? "+" : ""}
                            {steps}
                          </div>
                        </div>

                        <div className={`rounded-2xl border p-5 ${
                          moves < 0
                            ? "border-red-500/20 bg-red-500/10 text-red-200"
                            : "border-violet-500/20 bg-violet-500/10 text-violet-200"
                        }`}>
                          <div className="text-sm opacity-80">Ходы</div>
                          <div className="mt-2 text-3xl font-black">
                            {moves >= 0 ? "+" : ""}
                            {moves}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {log.old_value || log.new_value ? (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
                        <div>Было: {log.old_value || "—"}</div>
                        <div className="mt-1">Стало: {log.new_value || "—"}</div>
                      </div>
                    ) : null}

                    {log.action ? (
                      <p className="mt-4 text-sm text-zinc-500">{log.action}</p>
                    ) : null}
                  </div>
                </AnimatedCard>
              );
            })
          ) : (
            <AnimatedCard>
              <div className="p-8 text-zinc-400">
                История аккаунта пока пустая.
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </main>
  );
}