import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminScheduleForm from "./AdminScheduleForm";

export const dynamic = "force-dynamic";

export default async function AdminSchedulePage() {
  const { data: schedule } = await supabaseAdmin
    .from("event_schedule")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Расписание событий</h1>

        <p className="mb-10 text-zinc-400">
          Управление недельным расписанием на странице событий.
        </p>

        <AdminScheduleForm schedule={schedule || []} />
      </div>
    </main>
  );
}