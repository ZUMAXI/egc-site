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

  const accessRole = currentUser?.access_role || "guest";

  if (accessRole !== "host" && accessRole !== "admin") {
    return NextResponse.json({ error: "No access" }, { status: 403 });
  }

  const body = await request.json();

  await supabaseAdmin.from("news").delete().eq("id", body.id);

  return NextResponse.json({ ok: true });
}