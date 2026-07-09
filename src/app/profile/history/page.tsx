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
      return {
        icon: "🎁",
        label: "Награда",
        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };

    case "purchase":
      return {
        icon: "🛒",
        label: "Покупка",
        className: "border-red-500/20 bg-red-500/10 text-red-300",
      };

    case "currency":
      return {
        icon: "💰",
        label: "Изменение валюты",
        className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
      };

    default:
      return {
        icon: "📜",
        label: "Запись",
        className: "border-white/10 bg-white/5 text-zinc-300",
      };
  }
}

export default async function CurrencyHistoryPage() {
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
    .in("action_type", ["reward", "currency", "purchase"])
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
              <div className="mt-2 text-3xl font-black">
                👣 {profile.steps || 0}
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard>
            <div className="p-5">
              <div className="text-sm text-zinc-500">Текущие ходы</div>
              <div className="mt-2 text-3xl font-black">
                ♟ {profile.moves || 0}
              </div>
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
                        <div
                          className={`mb-4 w-fit rounded-full border px-4 py-2 text-sm font-bold ${style.className}`}
                        >
                          {style.icon} {style.label}
                        </div>

                        <h2 className="text-2xl font-black">
                          {log.reward_reason || "Изменение валюты"}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                          {formatDate(log.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div
                        className={`rounded-2xl border p-5 ${
                          steps < 0
                            ? "border-red-500/20 bg-red-500/10 text-red-200"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        }`}
                      >
                        <div className="text-sm opacity-80">Шаги</div>
                        <div className="mt-2 text-3xl font-black">
                          {steps >= 0 ? "+" : ""}
                          {steps}
                        </div>
                      </div>

                      <div
                        className={`rounded-2xl border p-5 ${
                          moves < 0
                            ? "border-red-500/20 bg-red-500/10 text-red-200"
                            : "border-violet-500/20 bg-violet-500/10 text-violet-200"
                        }`}
                      >
                        <div className="text-sm opacity-80">Ходы</div>
                        <div className="mt-2 text-3xl font-black">
                          {moves >= 0 ? "+" : ""}
                          {moves}
                        </div>
                      </div>
                    </div>

                    {log.old_value || log.new_value ? (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
                        <div>Было: {log.old_value || "—"}</div>
                        <div className="mt-1">Стало: {log.new_value || "—"}</div>
                      </div>
                    ) : null}
                  </div>
                </AnimatedCard>
              );
            })
          ) : (
            <AnimatedCard>
              <div className="p-8 text-zinc-400">
                История валюты пока пустая.
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </main>
  );
}