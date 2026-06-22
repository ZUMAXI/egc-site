import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function checkTelegramInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) return null;

  params.delete("hash");

  const checkString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  if (calculatedHash !== hash) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;

  return JSON.parse(userRaw);
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Missing bot token" }, { status: 500 });
  }

  const { initData } = await request.json();

  if (!initData) {
    return NextResponse.json({ error: "Missing initData" }, { status: 400 });
  }

  const user = checkTelegramInitData(initData, token);

  if (!user) {
    return NextResponse.json({ error: "Bad Telegram data" }, { status: 401 });
  }

  const telegramId = String(user.id);
  const telegramName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ");

  const { data: existingProfile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("telegram_id", telegramId)
    .single();

  if (existingProfile) {
    await supabaseAdmin
      .from("profiles")
      .update({
        telegram_username: user.username || null,
        telegram_name: telegramName,
        avatar_url: user.photo_url || null,
      })
      .eq("telegram_id", telegramId);
  } else {
    await supabaseAdmin.from("profiles").insert({
      telegram_id: telegramId,
      telegram_username: user.username || null,
      telegram_name: telegramName,
      nickname: user.username || user.first_name || "Guest",
      avatar_url: user.photo_url || null,
      role: "guest",
      status: "guest",
      access_role: "guest",
      position: "Guest",
      steps: 0,
      moves: 0,
    });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("egc_user", telegramId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}