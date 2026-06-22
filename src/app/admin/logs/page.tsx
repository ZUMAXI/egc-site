import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminLogsList from "./AdminLogsList";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const { data: logs } = await supabaseAdmin
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Журнал администрации</h1>

        <p className="mb-10 text-zinc-400">
          История действий администрации EgC.
        </p>

        <AdminLogsList logs={logs || []} />
      </div>
    </main>
  );
}