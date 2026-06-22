"use client";

export default function AdminLogsList({ logs }: { logs: any[] }) {
  return (
    <div className="grid gap-4">
      {logs.length > 0 ? (
        logs.map((log) => (
          <div
            key={log.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="text-sm text-zinc-500">
              {log.created_at
                ? new Date(log.created_at).toLocaleString("ru-RU")
                : "Дата неизвестна"}
            </div>

            <h2 className="mt-2 text-xl font-bold">
              {log.admin_name || "Администратор"}
            </h2>

            <p className="mt-3 whitespace-pre-line text-zinc-300">
              {log.action}
            </p>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Записей пока нет.
        </div>
      )}
    </div>
  );
}