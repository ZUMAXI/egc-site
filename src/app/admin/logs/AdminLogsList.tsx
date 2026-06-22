"use client";

import ProfileAvatar from "../../components/ProfileAvatar";
import ProfileBadges from "../../components/ProfileBadges";

function getActionStyle(action: string) {
  if (action.includes("Создал")) {
    return { icon: "🟢", label: "Создание", className: "border-green-500/30 bg-green-500/10 text-green-300" };
  }

  if (action.includes("Изменил")) {
    return { icon: "🟡", label: "Изменение", className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300" };
  }

  if (action.includes("Удалил")) {
    return { icon: "🔴", label: "Удаление", className: "border-red-500/30 bg-red-500/10 text-red-300" };
  }

  if (action.includes("Выдал")) {
    return { icon: "🎁", label: "Выдача", className: "border-purple-500/30 bg-purple-500/10 text-purple-300" };
  }

  return { icon: "📜", label: "Действие", className: "border-white/10 bg-white/5 text-zinc-300" };
}

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

export default function AdminLogsList({ logs }: { logs: any[] }) {
  return (
    <div className="grid gap-4">
      {logs.length > 0 ? (
        logs.map((log) => {
          const style = getActionStyle(log.action || "");
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

              <p className="mt-5 whitespace-pre-line text-zinc-300">
                {log.action || "Действие без описания"}
              </p>
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