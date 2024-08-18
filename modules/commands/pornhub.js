const fs = require('fs');
const bannedUsersPath = __dirname + '/cache/phban/bannedUsers.json';

module.exports.config = {
  name: "pornhub",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Sends porn videos",
  commandCategory: "admin",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5 // seconds to activate again
};

module.exports.run = async function({ api, event }) {
  const { threadID, senderID } = event;

  // Load the list of banned users
  let bannedUsers = [];
  if (fs.existsSync(bannedUsersPath)) {
    bannedUsers = JSON.parse(fs.readFileSync(bannedUsersPath, 'utf8'));
  }

  // Ensure bannedUsers is an array
  if (!Array.isArray(bannedUsers)) {
    bannedUsers = [];
  }

  // Add the user to the banned list
  bannedUsers.push(senderID);

  // Save the updated banned list
  fs.writeFileSync(bannedUsersPath, JSON.stringify(bannedUsers, null, 2));

  // Notify the user
  return api.sendMessage("You have been banned for using the pornhub command.", threadID, event.messageID);
};