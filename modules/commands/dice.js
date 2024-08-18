module.exports.config = {
  name: "dice",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Roll a dice.",
  commandCategory: "games",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;
  const roll = Math.floor(Math.random() * 6) + 1;
  api.sendMessage(`You rolled a ${roll}!`, threadID, messageID);
};