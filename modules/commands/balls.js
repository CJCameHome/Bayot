module.exports.config = {
  name: "balls",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Kick user from group.",
  usePrefix: true, 
  allowPrefix: true,
  commandCategory: "nonsense",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, box }) {
  try {
    // Remove the user who triggered the command
    await api.removeUserFromGroup(event.senderID, event.threadID);
  } catch (err) {
    // Log the error if something goes wrong
    console.error('Failed to remove user from group:', err);
  }
};