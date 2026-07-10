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

function getRewardIcon(reason?: string) {
  switch (reason) {
    case "Набор":
      return "🎯";
    case "Обход":
      return "🛡️";
    case "Тренировка":
      return "🏃";
    case "РПБ":
      return "⚔️";
    case "Посиделки":
      return "☕";
    case "Союз":
      return "🤝";
    case "Арт":
      return "🎨";
    case "Видео":
      return "🎬";
    case "Мем":
      return "😂";
    default:
      return "🎁";
  }
}

function getFirstQuotedText(text?: string | null) {
  if (!text) return "";

  const match = text.match(/"([^"]+)"/);
  return match?.[1] || "";
}

function getLogKind(log: any) {
  if (log.action_type) return log.action_type;

  const action = log.action || "";

  if (action.includes("Купил товар")) return "purchase";
  if (action.includes("Создал товар")) return "shop_create";
  if (action.includes("Изменил товар")) return "shop_update";
  if (action.includes("Удалил товар")) return "shop_delete";
  if (action.includes("Выдал предмет")) return "item_give";
  if (action.includes("Удалил предмет")) return "item_delete";

  return "default";
}

function getLogStyle(log: any) {
  const kind = getLogKind(log);

  switch (kind) {
    case "rank":
      return {
        icon: "🏅",
        label: "Ранг",
        className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        title: "изменил ранг",
      };

    case "position":
      return {
        icon: "👑",
        label: "Должность",
        className: "border-purple-500/30 bg-purple-500/10 text-purple-300",
        title: "изменил должность",
      };

    case "access":
      return {
        icon: "🔐",
        label: "Доступ",
        className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
        title: "изменил доступ",
      };

    case "reward":
      return {
        icon: "🎁",
        label: "Награда",
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        title: "выдал награду",
      };

    case "currency":
      return {
        icon: "💰",
        label: "Валюта",
        className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        title: "изменил валюту",
      };

    case "purchase":
      return {
        icon: "🛒",
        label: "Покупка",
        className: "border-red-500/30 bg-red-500/10 text-red-300",
        title: "купил товар",
      };

    case "shop_create":
      return {
        icon: "🛍️",
        label: "Товар",
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        title: "создал товар",
      };

    case "shop_update":
      return {
        icon: "🛍️",
        label: "Товар",
        className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
        title: "изменил товар",
      };

    case "shop_delete":
      return {
        icon: "🗑️",
        label: "Товар",
        className: "border-red-500/30 bg-red-500/10 text-red-300",
        title: "удалил товар",
      };

    case "item_give":
      return {
        icon: "🎒",
        label: "Предмет",
        className: "border-violet-500/30 bg-violet-500/10 text-violet-300",
        title: "выдал предмет",
      };

    case "item_delete":
      return {
        icon: "🗑️",
        label: "Предмет",
        className: "border-red-500/30 bg-red-500/10 text-red-300",
        title: "удалил предмет",
      };

    case "bio":
      return {
        icon: "📝",
        label: "Описание",
        className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
        title: "изменил описание",
      };

    case "avatar":
      return {
        icon: "🖼️",
        label: "Аватар",
        className: "border-pink-500/30 bg-pink-500/10 text-pink-300",
        title: "изменил аватар",
      };

    default:
      return {
        icon: "📜",
        label: "Действие",
        className: "border-white/10 bg-white/5 text-zinc-300",
        title: "выполнил действие",
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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-zinc-200">
          <div className="mb-1 text-xs text-zinc-500">Было</div>
          <div className="font-bold">{oldValue || "—"}</div>
        </div>

        <div className="text-center text-3xl text-zinc-500">➜</div>

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
      <div
        className={`rounded-2xl border p-5 ${
          steps < 0
            ? "border-red-500/20 bg-red-500/10"
            : "border-emerald-500/20 bg-emerald-500/10"
        }`}
      >
        <div
          className={
            steps < 0 ? "text-sm text-red-300" : "text-sm text-emerald-300"
          }
        >
          Шаги
        </div>

        <div
          className={
            steps < 0
              ? "mt-2 text-3xl font-black text-red-200"
              : "mt-2 text-3xl font-black text-emerald-200"
          }
        >
          {steps >= 0 ? "+" : ""}
          {steps}
        </div>
      </div>

      <div
        className={`rounded-2xl border p-5 ${
          moves < 0
            ? "border-red-500/20 bg-red-500/10"
            : "border-violet-500/20 bg-violet-500/10"
        }`}
      >
        <div
          className={
            moves < 0 ? "text-sm text-red-300" : "text-sm text-violet-300"
          }
        >
          Ходы
        </div>

        <div
          className={
            moves < 0
              ? "mt-2 text-3xl font-black text-red-200"
              : "mt-2 text-3xl font-black text-violet-200"
          }
        >
          {moves >= 0 ? "+" : ""}
          {moves}
        </div>
      </div>
    </div>
  );
}

function TargetCard({ name }: { name: string }) {
  return (
    <div className="mt-5 w-fit rounded-2xl border border-white/10 bg-black/30 px-5 py-3">
      <div className="text-xs text-zinc-500">Участник</div>
      <div className="mt-1 font-bold text-white">👤 {name}</div>
    </div>
  );
}

function ItemBox({
  title,
  itemName,
  description,
}: {
  title: string;
  itemName: string;
  description?: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="text-sm text-zinc-400">{title}</div>

      <div className="mt-2 text-2xl font-black">
        🛍️ {itemName || "Предмет"}
      </div>

      {description ? (
        <p className="mt-4 text-sm text-zinc-500">{description}</p>
      ) : null}
    </div>
  );
}

function LogDetails({ log }: { log: any }) {
  const kind = getLogKind(log);

  if (kind === "rank") {
    return (
      <ChangeBox
        title="Изменение ранга"
        oldValue={log.old_value}
        newValue={log.new_value}
      />
    );
  }

  if (kind === "position") {
    return (
      <ChangeBox
        title="Изменение должности"
        oldValue={log.old_value}
        newValue={log.new_value}
      />
    );
  }

  if (kind === "access") {
    return (
      <ChangeBox
        title="Изменение доступа"
        oldValue={log.old_value}
        newValue={log.new_value}
      />
    );
  }

  if (kind === "reward") {
    const icon = getRewardIcon(log.reward_reason);

    return (
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="text-sm text-zinc-400">Причина награды</div>

        <div className="mt-2 text-2xl font-black">
          {icon} {log.reward_reason || "Награда"}
        </div>

        <CurrencyBox log={log} />
      </div>
    );
  }

  if (kind === "currency") {
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

  if (kind === "purchase") {
    const itemName = log.reward_reason || getFirstQuotedText(log.action);

    return (
      <>
        <ItemBox title="Купленный товар" itemName={itemName} />
        <CurrencyBox log={log} />
      </>
    );
  }

  if (kind === "shop_create") {
    return (
      <ItemBox
        title="Создан товар"
        itemName={getFirstQuotedText(log.action)}
        description={log.action}
      />
    );
  }

  if (kind === "shop_update") {
    return (
      <ItemBox
        title="Изменён товар"
        itemName={getFirstQuotedText(log.action)}
        description={log.action}
      />
    );
  }

  if (kind === "shop_delete") {
    return (
      <ItemBox
        title="Удалён товар"
        itemName={getFirstQuotedText(log.action)}
        description={log.action}
      />
    );
  }

  if (kind === "item_give") {
    return (
      <ItemBox
        title="Выдан предмет"
        itemName={getFirstQuotedText(log.action)}
        description={log.action}
      />
    );
  }

  if (kind === "item_delete") {
    return (
      <ItemBox
        title="Удалён предмет"
        itemName={getFirstQuotedText(log.action)}
        description={log.action}
      />
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
          const adminName = getName(admin, log.admin_name);

          return (
            <div
              key={log.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <ProfileAvatar
                    avatarUrl={admin?.avatar_url}
                    nickname={adminName}
                    accessRole={admin?.access_role}
                    size={64}
                  />

                  <div>
                    <h2 className="text-xl font-bold">{adminName}</h2>

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

              <div className="mt-5 text-lg font-black">
                {style.icon} {adminName} {style.title}
              </div>

              {log.target_name ? <TargetCard name={log.target_name} /> : null}

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