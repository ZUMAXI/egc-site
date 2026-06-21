import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  await supabaseAdmin.from("lore").delete().eq("id", body.id);

  return NextResponse.json({ ok: true });
}