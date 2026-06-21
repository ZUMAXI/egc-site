import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const hash = params.hash;
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!hash || !token) {
    return NextResponse.redirect(new URL("/login?error=missing", request.url));
  }

  const checkString = Object.keys(params)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(token).digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  if (calculatedHash !== hash) {
    return NextResponse.redirect(new URL("/login?error=bad_hash", request.url));
  }

  const telegramId = params.id;

  await supabaseAdmin.from("profiles").upsert(
    {
      telegram_id: telegramId,
      telegram_username: params.username || null,
      telegram_name: [params.first_name, params.last_name]
        .filter(Boolean)
        .join(" "),
      nickname: params.username || params.first_name || "Guest",
      avatar_url: params.photo_url || null,
      role: "guest",
      status: "guest",
    },
    { onConflict: "telegram_id" }
  );

  const response = NextResponse.redirect(new URL("/profile", request.url));

  response.cookies.set("egc_user", telegramId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}