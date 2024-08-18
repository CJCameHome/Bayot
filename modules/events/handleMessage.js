module.exports.config = {
  name: "handleMessage",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-call",
    "log:thread-icon",
    "log:thread-color",
    "log:link-status",
    "log:magic-words",
    "log:thread-approval-mode",
    "log:thread-poll"
  ],
  version: "1.0.0",
  credits: "CJ",
  description: "Message Response",
  envConfig: {
    autoUnsend: false,
    sendNoti: true,
    timeToUnsend: 10
  }
};

module.exports.run = async function({ event, api, Threads, Users }) {
  const { author, threadID, logMessageType, logMessageData, logMessageBody } = event;
  const { setData, getData } = Threads;
  const fs = require("fs");
  const iconPath = __dirname + "/cache/emoji.json";
  if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));
  if (author === threadID) return;

  try {
    let dataThread = (await getData(threadID)).threadInfo;

    // --- Keyword-Based Response System ---
    const responseMap = {
      "yoo": "Wassup niggas",
      "how are you": "I'm doing well, thanks for asking!",
      "what's up": "Not much, just hanging out in this group."
    };

    for (const keyword in responseMap) {
      if (logMessageBody.toLowerCase().includes(keyword.toLowerCase())) {
        api.sendMessage(responseMap[keyword], threadID);
        return; // Stop processing further after a match
      }
    }
    // --- End Keyword-Based Response System ---

    switch (logMessageType) {
      // ... (Rest of your existing code) ...
    }

    await setData(threadID, { threadInfo: dataThread });
  } catch (error) {
    console.log(error);
  }
};