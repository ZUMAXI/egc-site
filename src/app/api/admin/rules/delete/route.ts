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
    .select("nickname, telegram_name, telegram_username")
    .eq("telegram_id", telegramId)
    .single();

  const body = await request.json();

  const { data: rule } = await supabaseAdmin
    .from("rules")
    .select("title")
    .eq("id", body.id)
    .single();

  await supabaseAdmin
    .from("rules")
    .delete()
    .eq("id", body.id);

  const adminName =
    currentUser?.nickname ||
    currentUser?.telegram_name ||
    currentUser?.telegram_username ||
    "Администратор";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: `Удалил правило "${rule?.title || "Без названия"}"`,
  });

  return NextResponse.json({ ok: true });
}