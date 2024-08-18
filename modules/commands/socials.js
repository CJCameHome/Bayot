module.exports.config = {
  name: "socials",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Sends the social media profiles of the bot's owner.",
  usePrefix: true, // Set to true to enable the use of prefix while false if not.
  allowPrefix: true, // Set to true to allow prefix even if usePrefix is false, this doesn't do anything if the usePrefix is true.
  commandCategory: "about",
  cooldowns: 5 // seconds to activate again
};

module.exports.run = function ({ api, event, box }) {
  const socialsMessage = `
𝗖𝗝'𝘀 𝗦𝗼𝗰𝗶𝗮𝗹𝘀:

  - 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/cjcamehome251
  - 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺: https://www.instagram.com/cjc4m3h0m3?igsh=YzljYTk1ODg3Zg==
  - 𝗬𝗼𝘂𝗧𝘂𝗯𝗲: https://www.youtube.com/@cjc4m3h0m3
  - 𝗚𝗶𝘁𝗛𝘂𝗯: https://github.com/CJCameHome
  `;

  api.sendMessage(socialsMessage, event.threadID);
};