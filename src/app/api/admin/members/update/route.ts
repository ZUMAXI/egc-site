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

function formatDelta(value: number) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const telegramId = cookieStore.get("egc_user")?.value;

    if (!telegramId) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const { data: currentUser, error: currentUserError } =
      await supabaseAdmin
        .from("profiles")
        .select(
          "id, nickname, telegram_name, telegram_username, access_role"
        )
        .eq("telegram_id", telegramId)
        .maybeSingle();

    if (currentUserError) {
      console.error("Current user error:", currentUserError);

      return NextResponse.json(
        { error: "Не удалось проверить администратора." },
        { status: 500 }
      );
    }

    const currentAccessRole = currentUser?.access_role || "guest";

    if (
      currentAccessRole !== "host" &&
      currentAccessRole !== "admin"
    ) {
      return NextResponse.json(
        { error: "No access" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { data: oldProfile, error: oldProfileError } =
      await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", body.id)
        .maybeSingle();

    if (oldProfileError) {
      console.error("Old profile error:", oldProfileError);

      return NextResponse.json(
        { error: "Не удалось получить профиль участника." },
        { status: 500 }
      );
    }

    if (!oldProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      position: body.position,
      rank: body.rank || "ГОСТЬ",
      steps: Number(body.steps || 0),
      moves: Number(body.moves || 0),
      bio: body.bio,
      avatar_url: body.avatar_url,
    };

    if (currentAccessRole === "host") {
      updateData.access_role = body.access_role;
    }

    const { data: updatedProfile, error: updateError } =
      await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .eq("id", body.id)
        .select("*")
        .single();

    if (updateError) {
      console.error("Profile update error:", updateError);

      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    const adminName = getName(currentUser);
    const targetName = getName(oldProfile);
    const logs: any[] = [];

    function addLog(data: any) {
      logs.push({
        admin_profile_id: currentUser?.id || null,
        admin_name: adminName,
        ...data,
      });
    }

    const oldSteps = Number(oldProfile.steps || 0);
    const newSteps = Number(updatedProfile.steps || 0);
    const oldMoves = Number(oldProfile.moves || 0);
    const newMoves = Number(updatedProfile.moves || 0);

    const stepsDiff = newSteps - oldSteps;
    const movesDiff = newMoves - oldMoves;

    const positionChanged =
      oldProfile.position !== updatedProfile.position;

    const rankChanged =
      oldProfile.rank !== updatedProfile.rank;

    const accessChanged =
      currentAccessRole === "host" &&
      oldProfile.access_role !== updatedProfile.access_role;

    const currencyChanged =
      oldSteps !== newSteps || oldMoves !== newMoves;

    if (positionChanged) {
      addLog({
        action_type: "position",
        target_name: targetName,
        old_value: oldProfile.position || "Guest",
        new_value: updatedProfile.position || "Guest",
        action: `Изменил должность участника "${targetName}": "${
          oldProfile.position || "Guest"
        }" → "${updatedProfile.position || "Guest"}"`,
      });
    }

    if (rankChanged) {
      addLog({
        action_type: "rank",
        target_name: targetName,
        old_value: oldProfile.rank || "ГОСТЬ",
        new_value: updatedProfile.rank || "ГОСТЬ",
        action: `Изменил ранг участника "${targetName}": "${
          oldProfile.rank || "ГОСТЬ"
        }" → "${updatedProfile.rank || "ГОСТЬ"}"`,
      });
    }

    if (accessChanged) {
      addLog({
        action_type: "access",
        target_name: targetName,
        old_value: oldProfile.access_role || "guest",
        new_value: updatedProfile.access_role || "guest",
        action: `Изменил доступ участника "${targetName}": "${
          oldProfile.access_role || "guest"
        }" → "${updatedProfile.access_role || "guest"}"`,
      });
    }

    if (currencyChanged) {
      if (body.reward_reason) {
        addLog({
          action_type: "reward",
          target_name: targetName,
          reward_reason: body.reward_reason,
          steps_delta: stepsDiff,
          moves_delta: movesDiff,
          action: `Начислил награду "${body.reward_reason}" участнику "${targetName}": шаги ${formatDelta(
            stepsDiff
          )}, ходы ${formatDelta(movesDiff)}`,
        });
      } else {
        addLog({
          action_type: "currency",
          target_name: targetName,
          old_value: `Шаги ${oldSteps}, ходы ${oldMoves}`,
          new_value: `Шаги ${newSteps}, ходы ${newMoves}`,
          steps_delta: stepsDiff,
          moves_delta: movesDiff,
          action: `Вручную изменил валюту участника "${targetName}": шаги ${oldSteps} → ${newSteps}, ходы ${oldMoves} → ${newMoves}`,
        });
      }
    }

    if (oldProfile.bio !== updatedProfile.bio) {
      addLog({
        action_type: "bio",
        target_name: targetName,
        action: `Изменил описание профиля участника "${targetName}"`,
      });
    }

    if (oldProfile.avatar_url !== updatedProfile.avatar_url) {
      addLog({
        action_type: "avatar",
        target_name: targetName,
        action: `Изменил аватар участника "${targetName}"`,
      });
    }

    if (logs.length > 0) {
      const { error: logsError } = await supabaseAdmin
        .from("admin_logs")
        .insert(logs);

      if (logsError) {
        console.error("Admin logs insert error:", logsError);
      }
    }

    const notifications: string[] = [];

    if (currencyChanged) {
      const currencyLines: string[] = [];

      if (stepsDiff !== 0) {
        currencyLines.push(
          `👣 Шаги: <b>${formatDelta(stepsDiff)}</b>`
        );
      }

      if (movesDiff !== 0) {
        currencyLines.push(
          `♟ Ходы: <b>${formatDelta(movesDiff)}</b>`
        );
      }

      const reasonText = body.reward_reason
        ? `\n\nПричина: <b>${escapeTelegramHtml(
            body.reward_reason
          )}</b>`
        : "";

      notifications.push(
        [
          "🎁 <b>Ваш баланс изменён</b>",
          "",
          ...currencyLines,
          reasonText,
          "",
          "<b>Текущий баланс:</b>",
          `👣 ${newSteps.toLocaleString("ru-RU")} шагов`,
          `♟ ${newMoves.toLocaleString("ru-RU")} ходов`,
        ]
          .filter(Boolean)
          .join("\n")
      );
    }

    if (rankChanged) {
      notifications.push(
        [
          "🎖 <b>Ваш ранг изменён</b>",
          "",
          `Новый ранг:`,
          `<b>${escapeTelegramHtml(
            updatedProfile.rank || "ГОСТЬ"
          )}</b>`,
        ].join("\n")
      );
    }

    if (positionChanged) {
      notifications.push(
        [
          "💼 <b>Ваша должность изменена</b>",
          "",
          `Новая должность:`,
          `<b>${escapeTelegramHtml(
            updatedProfile.position || "Guest"
          )}</b>`,
        ].join("\n")
      );
    }

    let notificationSent = false;

    if (
      notifications.length > 0 &&
      oldProfile.telegram_id
    ) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        "";

      const notificationText = notifications.join(
        "\n\n━━━━━━━━━━━━━━\n\n"
      );

      const notificationResult = await sendTelegramMessage({
        chatId: oldProfile.telegram_id,
        text: notificationText,
        button: siteUrl
          ? {
              text: "👤 Открыть профиль",
              url: `${siteUrl}/profile`,
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
    console.error("Update member error:", error);

    return NextResponse.json(
      { error: "Произошла ошибка при сохранении участника." },
      { status: 500 }
    );
  }
}