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
      console.error("Delete inventory admin error:", adminError);

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
    const inventoryId = Number(body.id);

    if (!Number.isFinite(inventoryId)) {
      return NextResponse.json(
        { error: "Некорректный ID предмета." },
        { status: 400 }
      );
    }

    const { data: inventory, error: inventoryError } =
      await supabaseAdmin
        .from("inventory")
        .select(`
          id,
          profile_id,
          owner:profiles!profile_id (
            id,
            telegram_id,
            nickname,
            telegram_name,
            telegram_username
          ),
          item:shop_items!shop_item_id (
            id,
            name
          )
        `)
        .eq("id", inventoryId)
        .maybeSingle();

    if (inventoryError) {
      console.error("Delete inventory load error:", inventoryError);

      return NextResponse.json(
        { error: "Не удалось получить предмет из инвентаря." },
        { status: 500 }
      );
    }

    if (!inventory) {
      return NextResponse.json(
        { error: "Предмет в инвентаре не найден." },
        { status: 404 }
      );
    }

    const owner = Array.isArray(inventory.owner)
      ? inventory.owner[0]
      : inventory.owner;

    const item = Array.isArray(inventory.item)
      ? inventory.item[0]
      : inventory.item;

    const { error: deleteError } = await supabaseAdmin
      .from("inventory")
      .delete()
      .eq("id", inventoryId);

    if (deleteError) {
      console.error("Delete inventory error:", deleteError);

      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    const adminName = getName(admin);
    const ownerName = getName(owner);
    const itemName = item?.name || "Предмет";

    const { error: logError } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_profile_id: admin.id,
        admin_name: adminName,
        action_type: "item_delete",
        target_name: ownerName,
        old_value: itemName,
        action: `Удалил предмет "${itemName}" у участника "${ownerName}"`,
      });

    if (logError) {
      console.error("Delete inventory log error:", logError);
    }

    let notificationSent = false;

    if (owner?.telegram_id) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        "";

      const notificationResult = await sendTelegramMessage({
        chatId: owner.telegram_id,
        text: [
          "🗑 <b>Предмет удалён из инвентаря</b>",
          "",
          `<b>${escapeTelegramHtml(itemName)}</b>`,
          "",
          "Предмет был удалён администрацией.",
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
      notificationSent,
    });
  } catch (error) {
    console.error("Delete inventory route error:", error);

    return NextResponse.json(
      { error: "Произошла ошибка при удалении предмета." },
      { status: 500 }
    );
  }
}