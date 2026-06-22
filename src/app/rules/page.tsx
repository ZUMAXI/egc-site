import { supabase } from "@/lib/supabase";
import RulesTabs from "./RulesTabs";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const { data: rules } = await supabase
    .from("rules")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Правила EgC"
          text="Выбери раздел, чтобы открыть нужные правила."
        />

        <RulesTabs rules={rules || []} />
      </div>
    </main>
  );
}