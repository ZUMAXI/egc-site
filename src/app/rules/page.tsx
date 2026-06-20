import { supabase } from "@/lib/supabase";
import RulesTabs from "./RulesTabs";

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const { data: rules } = await supabase
    .from("rules")
    .select("*")
    .order("order_number", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Правила EgC</h1>

        <p className="mb-10 text-zinc-400">
          Выбери раздел, чтобы открыть нужные правила.
        </p>

        <RulesTabs rules={rules || []} />
      </div>
    </main>
  );
}