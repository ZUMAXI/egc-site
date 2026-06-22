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

  const data = {
    title: body.title,
    content: body.content,
    sort_order: Number(body.sort_order || 0),
  };

  if (body.id) {
    await supabaseAdmin.from("rules").update(data).eq("id", body.id);
  } else {
    await supabaseAdmin.from("rules").insert(data);
  }

  const adminName =
    currentUser?.nickname ||
    currentUser?.telegram_name ||
    currentUser?.telegram_username ||
    "Администратор";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: body.id
      ? `Изменил правило "${body.title}"`
      : `Создал правило "${body.title}"`,
  });

  return NextResponse.json({ ok: true });
}