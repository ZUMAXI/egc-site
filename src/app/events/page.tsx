import { supabase } from "@/lib/supabase";
import EventsTabs from "./EventsTabs";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">События EgC</h1>

        <p className="mb-10 text-zinc-400">
          Сборы, РПБ, тренировки, обходы и другие активности клана.
        </p>

        <EventsTabs events={events || []} />
      </div>
    </main>
  );
}