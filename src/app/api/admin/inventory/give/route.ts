import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  escapeTelegramHtml,
  sendTelegramMessage,
} from "@/lib/telegramBot";

function getName(profile: any) {
  return (
    profile?.nickname ||
    profile?.telegram_name ||
    profile?.telegram_username ||
    "Участник"
  );
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const telegramId = cookieStore.get("egc_user")?.value;

    if (!telegramId) {
      return NextResponse.json(
        { error: "Необходимо войти в аккаунт." },
        { status: 401 }
      );
    }

    const { data: admin, error: adminError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, nickname, telegram_name, telegram_username, access_role"
      )
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (adminError) {
      console.error("Give item admin error:", adminError);

      return NextResponse.json(
        { error: "Не удалось проверить администратора." },
        { status: 500 }
      );
    }

    if (
      !admin ||
      !["admin", "host"].includes(admin.access_role || "")
    ) {
      return NextResponse.json(
        { error: "Недостаточно прав." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const profileId = Number(body.profile_id);
    const shopItemId = Number(body.shop_item_id);

    if (!Number.isFinite(profileId) || !Number.isFinite(shopItemId)) {
      return NextResponse.json(
        { error: "Не выбран участник или предмет." },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select(
          "id, telegram_id, nickname, telegram_name, telegram_username"
        )
        .eq("id", profileId)
        .maybeSingle();

    if (profileError) {
      console.error("Give item profile error:", profileError);

      return NextResponse.json(
        { error: "Не удалось получить участника." },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Участник не найден." },
        { status: 404 }
      );
    }

    const { data: item, error: itemError } = await supabaseAdmin
      .from("shop_items")
      .select("id, name, description, image_url")
      .eq("id", shopItemId)
      .maybeSingle();

    if (itemError) {
      console.error("Give item shop item error:", itemError);

      return NextResponse.json(
        { error: "Не удалось получить предмет." },
        { status: 500 }
      );
    }

    if (!item) {
      return NextResponse.json(
        { error: "Предмет не найден." },
        { status: 404 }
      );
    }

    const { data: inventoryEntry, error: insertError } =
      await supabaseAdmin
        .from("inventory")
        .insert({
          profile_id: profileId,
          shop_item_id: shopItemId,
        })
        .select()
        .single();

    if (insertError) {
      console.error("Give item inventory insert error:", insertError);

      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    const adminName = getName(admin);
    const profileName = getName(profile);
    const itemName = item.name || "Предмет";

    const { error: logError } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_profile_id: admin.id,
        admin_name: adminName,
        action_type: "item_give",
        target_name: profileName,
        new_value: itemName,
        action: `Выдал предмет "${itemName}" участнику "${profileName}"`,
      });

    if (logError) {
      console.error("Give item log error:", logError);
    }

    let notificationSent = false;

    if (profile.telegram_id) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        "";

      const notificationResult = await sendTelegramMessage({
        chatId: profile.telegram_id,
        text: [
          "🎁 <b>Вам выдан предмет</b>",
          "",
          `<b>${escapeTelegramHtml(itemName)}</b>`,
          "",
          "Предмет уже находится в вашем инвентаре.",
        ].join("\n"),
        button: siteUrl
          ? {
              text: "📦 Открыть инвентарь",
              url: `${siteUrl}/inventory`,
            }
          : undefined,
      });

      notificationSent = notificationResult.ok;
    }

    return NextResponse.json({
      ok: true,
      inventoryEntry,
      notificationSent,
    });
  } catch (error) {
    console.error("Give item error:", error);

    return NextResponse.json(
      { error: "Произошла ошибка при выдаче предмета." },
      { status: 500 }
    );
  }
}