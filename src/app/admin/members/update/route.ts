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
    steps: body.steps,
    moves: body.moves,
  };

  if (currentAccessRole === "host") {
    updateData.access_role = body.access_role;
  }

  await supabaseAdmin
    .from("profiles")
    .update(updateData)
    .eq("id", body.id);

  return NextResponse.json({ ok: true });
}