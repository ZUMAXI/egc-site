import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = {
    name: body.name || null,
    description: body.description || null,
    image_url: body.image_url || null,
    sort_order: Number(body.sort_order || 1),
    leader_profile_id: body.leader_profile_id
      ? Number(body.leader_profile_id)
      : null,
  };

  const result = body.id
    ? await supabaseAdmin.from("allies").update(data).eq("id", body.id)
    : await supabaseAdmin.from("allies").insert(data);

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}