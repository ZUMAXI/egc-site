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

type AllyNotificationType = "created" | "status_changed";

async function sendAllyBroadcast(
  ally: {
    name: string;
    status: string;
    oldStatus?: string;
  },
  notificationType: AllyNotificationType
) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("telegram_id")
    .not("telegram_id", "is", null);

  if (error) {
    console.error("Allies broadcast profiles error:", error);

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

  const text =
    notificationType === "status_changed"
      ? [
          "🔄 <b>Изменился статус союза</b>",
          "",
          `Клан: <b>${escapeTelegramHtml(ally.name)}</b>`,
          "",
          "Было:",
          `<b>${escapeTelegramHtml(
            ally.oldStatus || "Не указан"
          )}</b>`,
          "",
          "Стало:",
          `<b>${escapeTelegramHtml(ally.status)}</b>`,
          "",
          "Подробности доступны в приложении EgC.",
        ].join("\n")
      : [
          "🤝 <b>Добавлен новый союз EgC</b>",
          "",
          `Клан: <b>${escapeTelegramHtml(ally.name)}</b>`,
          "",
          `Статус: <b>${escapeTelegramHtml(
            ally.status
          )}</b>`,
          "",
          "Подробная информация уже доступна в приложении.",
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
                text: "🤝 Открыть союзы",
                url: `${siteUrl}/allies`,
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
        "Allies current user error:",
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

    const status =
      typeof body.status === "string" &&
      body.status.trim()
        ? body.status.trim()
        : "🤝 Союз";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    const sortOrder = Number(
      body.sort_order || 1
    );

    const leaderProfileId =
      body.leader_profile_id
        ? Number(body.leader_profile_id)
        : null;

    if (!name) {
      return NextResponse.json(
        {
          error: "Укажи название союза.",
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
          error: "Добавь описание союза.",
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

    if (
      leaderProfileId !== null &&
      !Number.isFinite(leaderProfileId)
    ) {
      return NextResponse.json(
        {
          error: "Некорректный лидер союза.",
        },
        {
          status: 400,
        }
      );
    }

    const allyData = {
      name,
      status,
      description,
      image_url: imageUrl || null,
      sort_order: sortOrder,
      leader_profile_id: leaderProfileId,
    };

    const isEditing = Boolean(body.id);

    let previousAlly: any = null;
    let savedAlly;

    if (isEditing) {
      const allyId = Number(body.id);

      if (!Number.isFinite(allyId)) {
        return NextResponse.json(
          {
            error: "Некорректный ID союза.",
          },
          {
            status: 400,
          }
        );
      }

      const {
        data: oldAlly,
        error: oldAllyError,
      } = await supabaseAdmin
        .from("allies")
        .select(
          "id, name, status, description, image_url, sort_order, leader_profile_id"
        )
        .eq("id", allyId)
        .maybeSingle();

      if (oldAllyError) {
        console.error(
          "Allies old ally error:",
          oldAllyError
        );

        return NextResponse.json(
          {
            error:
              "Не удалось получить старые данные союза.",
          },
          {
            status: 500,
          }
        );
      }

      if (!oldAlly) {
        return NextResponse.json(
          {
            error: "Союз не найден.",
          },
          {
            status: 404,
          }
        );
      }

      previousAlly = oldAlly;

      const { data, error } = await supabaseAdmin
        .from("allies")
        .update(allyData)
        .eq("id", allyId)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Allies update error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось обновить союз.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedAlly = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("allies")
        .insert(allyData)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Allies insert error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось создать союз.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedAlly = data;
    }

    const statusChanged =
      isEditing &&
      previousAlly?.status !== status;

    const adminName = getName(currentUser);

    const { error: logError } =
      await supabaseAdmin
        .from("admin_logs")
        .insert({
          admin_profile_id:
            currentUser.id || null,
          admin_name: adminName,
          action_type: statusChanged
            ? "ally_status"
            : isEditing
              ? "ally_update"
              : "ally_create",
          target_name: name,
          old_value: statusChanged
            ? previousAlly?.status || "Не указан"
            : null,
          new_value: statusChanged
            ? status
            : null,
          action: statusChanged
            ? `Изменил статус союза "${name}": "${previousAlly?.status || "Не указан"}" → "${status}"`
            : isEditing
              ? `Изменил союз "${name}"`
              : `Создал союз "${name}"`,
        });

    if (logError) {
      console.error(
        "Allies log error:",
        logError
      );
    }

    let notification = {
      total: 0,
      sent: 0,
      failed: 0,
    };

    if (!isEditing) {
      notification =
        await sendAllyBroadcast(
          {
            name,
            status,
          },
          "created"
        );
    } else if (statusChanged) {
      notification =
        await sendAllyBroadcast(
          {
            name,
            status,
            oldStatus:
              previousAlly?.status ||
              "Не указан",
          },
          "status_changed"
        );
    }

    return NextResponse.json({
      ok: true,
      ally: savedAlly,
      statusChanged,
      notification,
    });
  } catch (error) {
    console.error(
      "Save ally error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Произошла ошибка при сохранении союза.",
      },
      {
        status: 500,
      }
    );
  }
}