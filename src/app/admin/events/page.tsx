import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminEventsForm from "./AdminEventsForm";
import AdminBackButton from "../components/AdminBackButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("id", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <AdminBackButton />
        
        <h1 className="mb-3 text-5xl font-black">Управление событиями</h1>

        <p className="mb-10 text-zinc-400">
          Создание, редактирование и удаление событий EgC.
        </p>

        <AdminEventsForm events={events || []} />
      </div>
    </main>
  );
}