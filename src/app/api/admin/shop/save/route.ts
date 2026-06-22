import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
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

  return NextResponse.json({ ok: true });
}