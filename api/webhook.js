
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("K2A Lesson Reminder Bot is running.");
  }

  try {
    const token = process.env.BOT_TOKEN;

    if (!token) {
      console.error("BOT_TOKEN is not configured.");
      return res.status(500).json({ ok: false });
    }

    const update = req.body;
    const message = update && update.message;
    const chatId = message && message.chat && message.chat.id;
    const text = message && message.text ? message.text.trim() : "";

    if (
      chatId &&
      (text === "/start" || text.startsWith("/start "))
    ) {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text:
              "Welcome to K2A Lesson Reminder Bot! 🎓\n\n" +
              "You are connected to the lesson reminder service.\n\n" +
              "Your Telegram Chat ID is: " + chatId + "\n\n" +
              "Your lesson reminders, lesson summaries, and Google Docs links " +
              "will be sent here automatically before your lessons.\n\n" +
              "You do not need to type any commands. Sit back and let the bot " +
              "keep you informed.\n\n" +
              "If your reminders are not activated yet, please contact the school administrator."
          })
        }
      );

      if (!telegramResponse.ok) {
        const error = await telegramResponse.text();
        console.error("Telegram sendMessage failed:", error);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(200).json({ ok: true });
  }
};
