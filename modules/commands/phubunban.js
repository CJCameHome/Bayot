const fs = require('fs');
const bannedUsersPath = __dirname + '/cache/phban/bannedUsers.json';

module.exports.config = {
  name: "phubunban",
  version: "1.0.0",
  hasPermission: 2, // Only admins can use this command
  credits: "CJ",
  description: "Unban a user who used the pornhub command.",
  commandCategory: "admin",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5 // seconds to activate again
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageReply, mentions } = event;

  if (!messageReply && Object.keys(mentions).length === 0 && args.length === 0) {
    return api.sendMessage("Usage: Reply to a user's message, mention a user, or provide their UID to unban them.", threadID, event.messageID);
  }

  let userID;

  if (messageReply) {
    userID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    const mentionKeys = Object.keys(mentions);
    if (mentionKeys.length > 1) {
      return api.sendMessage("Please mention only one user.", threadID, event.messageID);
    }
    userID = mentionKeys[0];
  } else if (args.length > 0) {
    userID = args[0];
  }

  // Load the list of banned users
  let bannedUsers = [];
  if (fs.existsSync(bannedUsersPath)) {
    bannedUsers = JSON.parse(fs.readFileSync(bannedUsersPath, 'utf8'));
  }

  // Ensure bannedUsers is an array
  if (!Array.isArray(bannedUsers)) {
    bannedUsers = [];
  }

  // Remove the user from the banned list
  bannedUsers = bannedUsers.filter(id => id !== userID);

  // Save the updated banned list
  fs.writeFileSync(bannedUsersPath, JSON.stringify(bannedUsers, null, 2));

  // Notify the user
  return api.sendMessage(`User ${userID} has been unbanned.`, threadID, event.messageID);
};