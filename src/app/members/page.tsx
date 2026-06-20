import { supabase } from "@/lib/supabase";

export default async function MembersPage() {
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        Администрация EgC
      </h1>

      <div className="grid gap-6">
        {members?.map((member) => (
          <div
            key={member.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold">
              {member.nickname}
            </h2>

            <p className="text-zinc-400">
              {member.telegram}
            </p>

            <div className="mt-4 flex gap-4 text-sm">
              <span>Nation: {member.nation}</span>
              <span>Rank: {member.rank}</span>
              <span>Position: {member.position}</span>
            </div>

            <div className="mt-2 text-zinc-500">
              Steps: {member.steps} | Moves: {member.moves}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}