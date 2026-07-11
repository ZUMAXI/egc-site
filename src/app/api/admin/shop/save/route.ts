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
    "Администратор"
  );
}

async function sendShopBroadcast(item: {
  name: string;
  price_steps: number;
  price_moves: number;
}) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("telegram_id")
    .not("telegram_id", "is", null);

  if (error) {
    console.error("Shop broadcast profiles error:", error);

    return {
      total: 0,
      sent: 0,
      failed: 0,
    };
  }

  const telegramIds = Array.from(
    new Set(
      (profiles || [])
        .map((profile) =>
          String(profile.telegram_id || "").trim()
        )
        .filter(Boolean)
    )
  );

  if (telegramIds.length === 0) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "";

  const priceLines: string[] = [];

  if (item.price_steps > 0) {
    priceLines.push(
      `👣 ${item.price_steps.toLocaleString("ru-RU")} шагов`
    );
  }

  if (item.price_moves > 0) {
    priceLines.push(
      `♟ ${item.price_moves.toLocaleString("ru-RU")} ходов`
    );
  }

  if (priceLines.length === 0) {
    priceLines.push("🎁 Бесплатно");
  }

  const text = [
    "🛒 <b>Новый товар в магазине EgC</b>",
    "",
    `<b>${escapeTelegramHtml(item.name)}</b>`,
    "",
    "<b>Стоимость:</b>",
    ...priceLines,
    "",
    "Товар уже доступен в приложении.",
  ].join("\n");

  let sent = 0;
  let failed = 0;

  const batchSize = 15;

  for (
    let index = 0;
    index < telegramIds.length;
    index += batchSize
  ) {
    const batch = telegramIds.slice(
      index,
      index + batchSize
    );

    const results = await Promise.all(
      batch.map((chatId) =>
        sendTelegramMessage({
          chatId,
          text,
          button: siteUrl
            ? {
                text: "🛒 Открыть магазин",
                url: `${siteUrl}/shop`,
              }
            : undefined,
        })
      )
    );

    for (const result of results) {
      if (result.ok) {
        sent += 1;
      } else {
        failed += 1;
      }
    }
  }

  return {
    total: telegramIds.length,
    sent,
    failed,
  };
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const telegramId =
      cookieStore.get("egc_user")?.value;

    if (!telegramId) {
      return NextResponse.json(
        {
          error: "Необходимо войти в аккаунт.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: currentUser,
      error: currentUserError,
    } = await supabaseAdmin
      .from("profiles")
      .select(
        `
          id,
          nickname,
          telegram_name,
          telegram_username,
          access_role
        `
      )
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (currentUserError) {
      console.error(
        "Shop current user error:",
        currentUserError
      );

      return NextResponse.json(
        {
          error:
            "Не удалось проверить администратора.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !currentUser ||
      !["admin", "host"].includes(
        currentUser.access_role || ""
      )
    ) {
      return NextResponse.json(
        {
          error: "Недостаточно прав.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    const priceSteps = Number(
      body.price_steps || 0
    );

    const priceMoves = Number(
      body.price_moves || 0
    );

    const sortOrder = Number(
      body.sort_order || 1
    );

    const isAvailable =
      body.is_available === true;

    if (!name) {
      return NextResponse.json(
        {
          error: "Укажи название товара.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !description ||
      description === "<p></p>"
    ) {
      return NextResponse.json(
        {
          error: "Добавь описание товара.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(priceSteps) ||
      priceSteps < 0 ||
      !Number.isFinite(priceMoves) ||
      priceMoves < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Цена товара не может быть отрицательной.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(sortOrder) ||
      sortOrder < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Порядок отображения должен быть больше нуля.",
        },
        {
          status: 400,
        }
      );
    }

    const itemData = {
      name,
      description,
      image_url: imageUrl || null,
      price_steps: priceSteps,
      price_moves: priceMoves,
      sort_order: sortOrder,
      is_available: isAvailable,
    };

    const isEditing = Boolean(body.id);
    let savedItem;

    if (isEditing) {
      const itemId = Number(body.id);

      if (!Number.isFinite(itemId)) {
        return NextResponse.json(
          {
            error: "Некорректный ID товара.",
          },
          {
            status: 400,
          }
        );
      }

      const {
        data,
        error,
      } = await supabaseAdmin
        .from("shop_items")
        .update(itemData)
        .eq("id", itemId)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Shop item update error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось обновить товар.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedItem = data;
    } else {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("shop_items")
        .insert(itemData)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Shop item insert error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось создать товар.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedItem = data;
    }

    const adminName = getName(currentUser);

    const {
      error: logError,
    } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_profile_id:
          currentUser.id || null,
        admin_name: adminName,
        action_type: isEditing
          ? "shop_update"
          : "shop_create",
        target_name: name,
        action: isEditing
          ? `Изменил товар "${name}"`
          : `Создал товар "${name}"`,
      });

    if (logError) {
      console.error(
        "Shop item log error:",
        logError
      );
    }

    let notification = {
      total: 0,
      sent: 0,
      failed: 0,
    };

    /*
     * Рассылка выполняется только если:
     * 1. создаётся новый товар;
     * 2. товар сразу отмечен как доступный.
     *
     * При редактировании товара повторной
     * рассылки не будет.
     *
     * Если создать скрытый товар, бот также
     * ничего не отправит.
     */
    if (!isEditing && isAvailable) {
      notification = await sendShopBroadcast({
        name,
        price_steps: priceSteps,
        price_moves: priceMoves,
      });
    }

    return NextResponse.json({
      ok: true,
      item: savedItem,
      notification,
    });
  } catch (error) {
    console.error(
      "Save shop item error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Произошла ошибка при сохранении товара.",
      },
      {
        status: 500,
      }
    );
  }
}