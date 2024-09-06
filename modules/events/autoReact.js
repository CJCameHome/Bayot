module.exports.config = {
  name: "autoReact",
  eventType: ["message"],
  version: "1.0.0",
  credits: "CJ",
  description: "Automatically react to new messages with random emojis"
};

const fs = require("fs");
const axios = require("axios");

const emojis = ["👍", "❤️", "😂", "😮", "🎉", "🥳", "😎", "🤯", "🥺", "😭"]; // Add more emojis here

module.exports.run = async function({ api, event }) {
  if (event.senderID === api.getCurrentUserID()) return; // Ignore own messages

  const randomIndex = Math.floor(Math.random() * emojis.length);
  const randomEmoji = emojis[randomIndex];

  api.setMessageReaction(randomEmoji, event.messageID, event.threadID);
};