import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: admin } = await supabaseAdmin
    .from("profiles")
    .select("nickname, telegram_name, telegram_username, access_role")
    .eq("telegram_id", telegramId)
    .single();

  if (admin?.access_role !== "host" && admin?.access_role !== "admin") {
    return NextResponse.json({ error: "No access" }, { status: 403 });
  }

  const body = await request.json();

  const adminName =
    admin.nickname ||
    admin.telegram_name ||
    admin.telegram_username ||
    "Администратор";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: body.action,
  });

  return NextResponse.json({ ok: true });
}