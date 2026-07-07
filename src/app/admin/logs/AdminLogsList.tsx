"use client";

import ProfileAvatar from "../../components/ProfileAvatar";
import ProfileBadges from "../../components/ProfileBadges";

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

function getName(profile: any, fallback: string) {
  return (
    profile?.nickname ||
    profile?.telegram_name ||
    profile?.telegram_username ||
    fallback ||
    "Администратор"
  );
}

function getLogStyle(log: any) {
  switch (log.action_type) {
    case "rank":
      return {
        icon: "🏅",
        label: "Ранг",
        className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      };

    case "position":
      return {
        icon: "👑",
        label: "Должность",
        className: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      };

    case "access":
      return {
        icon: "🔐",
        label: "Доступ",
        className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      };

    case "reward":
      return {
        icon: "🎁",
        label: "Награда",
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      };

    case "currency":
      return {
        icon: "💰",
        label: "Валюта",
        className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      };

    case "bio":
      return {
        icon: "📝",
        label: "Описание",
        className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
      };

    case "avatar":
      return {
        icon: "🖼️",
        label: "Аватар",
        className: "border-pink-500/30 bg-pink-500/10 text-pink-300",
      };

    default:
      return {
        icon: "📜",
        label: "Действие",
        className: "border-white/10 bg-white/5 text-zinc-300",
      };
  }
}

function ChangeBox({
  title,
  oldValue,
  newValue,
}: {
  title: string;
  oldValue?: string;
  newValue?: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="mb-3 text-sm font-bold text-zinc-400">{title}</div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
          <div className="mb-1 text-xs text-red-300/80">Было</div>
          <div className="font-bold">{oldValue || "—"}</div>
        </div>

        <div className="text-center text-2xl text-zinc-500">→</div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200">
          <div className="mb-1 text-xs text-emerald-300/80">Стало</div>
          <div className="font-bold">{newValue || "—"}</div>
        </div>
      </div>
    </div>
  );
}

function CurrencyBox({ log }: { log: any }) {
  const steps = Number(log.steps_delta || 0);
  const moves = Number(log.moves_delta || 0);

  return (
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <div className="text-sm text-emerald-300">Шаги</div>
        <div className="mt-2 text-3xl font-black text-emerald-200">
          {steps >= 0 ? "+" : ""}
          {steps}
        </div>
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="text-sm text-violet-300">Ходы</div>
        <div className="mt-2 text-3xl font-black text-violet-200">
          {moves >= 0 ? "+" : ""}
          {moves}
        </div>
      </div>
    </div>
  );
}

function LogDetails({ log }: { log: any }) {
  if (log.action_type === "rank") {
    return (
      <ChangeBox
        title="Изменение ранга"
        oldValue={log.old_value}
        newValue={log.new_value}
      />
    );
  }

  if (log.action_type === "position") {
    return (
      <ChangeBox
        title="Изменение должности"
        oldValue={log.old_value}
        newValue={log.new_value}
      />
    );
  }

  if (log.action_type === "access") {
    return (
      <ChangeBox
        title="Изменение доступа"
        oldValue={log.old_value}
        newValue={log.new_value}
      />
    );
  }

  if (log.action_type === "reward") {
    return (
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="text-sm text-zinc-400">Причина награды</div>
        <div className="mt-2 text-2xl font-black">
          🎁 {log.reward_reason || "Награда"}
        </div>

        <CurrencyBox log={log} />
      </div>
    );
  }

  if (log.action_type === "currency") {
    return (
      <>
        <ChangeBox
          title="Ручное изменение валюты"
          oldValue={log.old_value}
          newValue={log.new_value}
        />

        <CurrencyBox log={log} />
      </>
    );
  }

  return (
    <p className="mt-5 whitespace-pre-line text-zinc-300">
      {log.action || "Действие без описания"}
    </p>
  );
}

export default function AdminLogsList({ logs }: { logs: any[] }) {
  return (
    <div className="grid gap-5">
      {logs.length > 0 ? (
        logs.map((log) => {
          const style = getLogStyle(log);
          const admin = log.admin;

          return (
            <div
              key={log.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <ProfileAvatar
                    avatarUrl={admin?.avatar_url}
                    nickname={getName(admin, log.admin_name)}
                    accessRole={admin?.access_role}
                    size={64}
                  />

                  <div>
                    <h2 className="text-xl font-bold">
                      {getName(admin, log.admin_name)}
                    </h2>

                    {admin ? (
                      <ProfileBadges
                        position={admin.position}
                        accessRole={admin.access_role}
                      />
                    ) : null}

                    <p className="mt-2 text-sm text-zinc-500">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${style.className}`}
                >
                  {style.icon} {style.label}
                </div>
              </div>

              {log.target_name ? (
                <div className="mt-5 w-fit rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-300">
                  👤 Участник:{" "}
                  <span className="font-bold text-white">{log.target_name}</span>
                </div>
              ) : null}

              <LogDetails log={log} />
            </div>
          );
        })
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Записей пока нет.
        </div>
      )}
    </div>
  );
}