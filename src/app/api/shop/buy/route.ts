import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    return NextResponse.json({ error: "Нужно войти в аккаунт." }, { status: 401 });
  }

  const body = await request.json();
  const itemId = body.item_id;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Профиль не найден." }, { status: 404 });
  }

  const { data: item } = await supabaseAdmin
    .from("shop_items")
    .select("*")
    .eq("id", itemId)
    .eq("is_available", true)
    .single();

  if (!item) {
    return NextResponse.json({ error: "Товар не найден." }, { status: 404 });
  }

  const profileSteps = Number(profile.steps || 0);
  const profileMoves = Number(profile.moves || 0);
  const priceSteps = Number(item.price_steps || 0);
  const priceMoves = Number(item.price_moves || 0);

  if (profileSteps < priceSteps || profileMoves < priceMoves) {
    return NextResponse.json(
      { error: "Недостаточно шагов или ходов." },
      { status: 400 }
    );
  }

  await supabaseAdmin
    .from("profiles")
    .update({
      steps: profileSteps - priceSteps,
      moves: profileMoves - priceMoves,
    })
    .eq("id", profile.id);

  await supabaseAdmin.from("inventory").insert({
    profile_id: profile.id,
    shop_item_id: item.id,
  });

  return NextResponse.json({ ok: true });
}