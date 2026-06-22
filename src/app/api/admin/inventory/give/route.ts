import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await supabaseAdmin.from("inventory").insert({
    profile_id: Number(body.profile_id),
    shop_item_id: Number(body.shop_item_id),
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}