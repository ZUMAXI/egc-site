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
    .select("access_role, nickname, telegram_name, telegram_username")
    .eq("telegram_id", telegramId)
    .single();

  const accessRole = currentUser?.access_role || "guest";

  if (accessRole !== "host" && accessRole !== "admin") {
    return NextResponse.json({ error: "No access" }, { status: 403 });
  }

  const body = await request.json();

  const data = {
    title: body.title,
    content: body.content,
    author: body.author,
    image_url: body.image_url,
  };

  if (body.id) {
    await supabaseAdmin.from("news").update(data).eq("id", body.id);
  } else {
    await supabaseAdmin.from("news").insert(data);
  }

  const adminName =
    currentUser?.nickname ||
    currentUser?.telegram_name ||
    currentUser?.telegram_username ||
    "Администратор";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: body.id
      ? `Изменил новость "${body.title}"`
      : `Создал новость "${body.title}"`,
  });

  return NextResponse.json({ ok: true });
}