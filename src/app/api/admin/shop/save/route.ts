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
    name: body.name,
    description: body.description,
    image_url: body.image_url,
    price_steps: Number(body.price_steps || 0),
    price_moves: Number(body.price_moves || 0),
    sort_order: Number(body.sort_order || 1),
    is_available: body.is_available,
  };

  const result = body.id
    ? await supabaseAdmin.from("shop_items").update(data).eq("id", body.id)
    : await supabaseAdmin.from("shop_items").insert(data);

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  const adminName =
    currentUser?.nickname ||
    currentUser?.telegram_name ||
    currentUser?.telegram_username ||
    "Администратор";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: body.id
      ? `Изменил товар "${body.name}"`
      : `Создал товар "${body.name}"`,
  });

  return NextResponse.json({ ok: true });
}