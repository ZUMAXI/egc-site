import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: currentUser } = await supabaseAdmin
    .from("profiles")
    .select("access_role")
    .eq("telegram_id", telegramId)
    .single();

  const currentAccessRole = currentUser?.access_role || "guest";

  if (currentAccessRole !== "host" && currentAccessRole !== "admin") {
    return NextResponse.json({ error: "No access" }, { status: 403 });
  }

  const body = await request.json();

  const updateData: any = {
    position: body.position,
    rank: body.rank || "ГОСТЬ",
    steps: body.steps,
    moves: body.moves,
    bio: body.bio,
    avatar_url: body.avatar_url,
  };

  if (currentAccessRole === "host") {
    updateData.access_role = body.access_role;
  }

  const result = await supabaseAdmin
    .from("profiles")
    .update(updateData)
    .eq("id", body.id);

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}