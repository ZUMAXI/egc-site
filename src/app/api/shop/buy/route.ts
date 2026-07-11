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
        { error: "Нужно войти в аккаунт." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const itemId = Number(body.item_id);

    if (!Number.isFinite(itemId)) {
      return NextResponse.json(
        { error: "Некорректный ID товара." },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("telegram_id", telegramId)
        .maybeSingle();

    if (profileError) {
      console.error("Buy item profile error:", profileError);

      return NextResponse.json(
        { error: "Не удалось получить профиль." },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Профиль не найден." },
        { status: 404 }
      );
    }

    const { data: item, error: itemError } =
      await supabaseAdmin
        .from("shop_items")
        .select("*")
        .eq("id", itemId)
        .eq("is_available", true)
        .maybeSingle();

    if (itemError) {
      console.error("Buy item shop error:", itemError);

      return NextResponse.json(
        { error: "Не удалось получить товар." },
        { status: 500 }
      );
    }

    if (!item) {
      return NextResponse.json(
        { error: "Товар не найден или недоступен." },
        { status: 404 }
      );
    }

    const profileSteps = Number(profile.steps || 0);
    const profileMoves = Number(profile.moves || 0);
    const priceSteps = Number(item.price_steps || 0);
    const priceMoves = Number(item.price_moves || 0);

    if (
      !Number.isFinite(priceSteps) ||
      !Number.isFinite(priceMoves) ||
      priceSteps < 0 ||
      priceMoves < 0
    ) {
      return NextResponse.json(
        { error: "У товара указана некорректная цена." },
        { status: 400 }
      );
    }

    if (
      profileSteps < priceSteps ||
      profileMoves < priceMoves
    ) {
      return NextResponse.json(
        { error: "Недостаточно шагов или ходов." },
        { status: 400 }
      );
    }

    const newSteps = profileSteps - priceSteps;
    const newMoves = profileMoves - priceMoves;

    const { error: balanceError } = await supabaseAdmin
      .from("profiles")
      .update({
        steps: newSteps,
        moves: newMoves,
      })
      .eq("id", profile.id);

    if (balanceError) {
      console.error("Buy item balance update error:", balanceError);

      return NextResponse.json(
        { error: "Не удалось списать валюту." },
        { status: 500 }
      );
    }

    const { data: inventoryEntry, error: inventoryError } =
      await supabaseAdmin
        .from("inventory")
        .insert({
          profile_id: profile.id,
          shop_item_id: item.id,
        })
        .select()
        .single();

    if (inventoryError) {
      console.error("Buy item inventory error:", inventoryError);

      const { error: rollbackError } = await supabaseAdmin
        .from("profiles")
        .update({
          steps: profileSteps,
          moves: profileMoves,
        })
        .eq("id", profile.id);

      if (rollbackError) {
        console.error(
          "Buy item rollback error:",
          rollbackError
        );
      }

      return NextResponse.json(
        {
          error:
            "Не удалось добавить предмет в инвентарь. Валюта возвращена.",
        },
        { status: 500 }
      );
    }

    const profileName = getName(profile);
    const itemName = item.name || "Предмет";

    const { error: logError } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_profile_id: profile.id,
        admin_name: profileName,
        action_type: "purchase",
        target_name: profileName,
        reward_reason: itemName,
        steps_delta: -priceSteps,
        moves_delta: -priceMoves,
        old_value: `Шаги ${profileSteps}, ходы ${profileMoves}`,
        new_value: `Шаги ${newSteps}, ходы ${newMoves}`,
        action: `Купил товар "${itemName}": шаги -${priceSteps}, ходы -${priceMoves}`,
      });

    if (logError) {
      console.error("Buy item log error:", logError);
    }

    const paymentLines: string[] = [];

    if (priceSteps > 0) {
      paymentLines.push(
        `👣 ${priceSteps.toLocaleString("ru-RU")} шагов`
      );
    }

    if (priceMoves > 0) {
      paymentLines.push(
        `♟ ${priceMoves.toLocaleString("ru-RU")} ходов`
      );
    }

    if (paymentLines.length === 0) {
      paymentLines.push("🎁 Бесплатно");
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "";

    let notificationSent = false;

    if (profile.telegram_id) {
      const notificationResult = await sendTelegramMessage({
        chatId: profile.telegram_id,
        text: [
          "🛒 <b>Покупка выполнена</b>",
          "",
          `<b>${escapeTelegramHtml(itemName)}</b>`,
          "",
          "<b>Списано:</b>",
          ...paymentLines,
          "",
          "<b>Текущий баланс:</b>",
          `👣 ${newSteps.toLocaleString("ru-RU")} шагов`,
          `♟ ${newMoves.toLocaleString("ru-RU")} ходов`,
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
    console.error("Buy item route error:", error);

    return NextResponse.json(
      {
        error: "Произошла ошибка при покупке товара.",
      },
      { status: 500 }
    );
  }
}