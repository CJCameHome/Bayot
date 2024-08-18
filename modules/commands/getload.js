module.exports.config = {
  name: "getload",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Sends load",
  usePrefix: true,
  allowPrefix: true,
  commandCategory: "utility",
  cooldowns: 5 // seconds to activate again
};

module.exports.run = async function({ api, event, args }) {
  const ownerID = "100088657757304";
  const { threadID, senderID } = event;

  if (args.length < 2) {
    return api.sendMessage("Usage: getload <mobile number> <amount>", threadID, event.messageID);
  }

  const mobileNumber = args[0];
  const amount = args[1];

  const messageToOwner = `Mobile Number that the user sent: ${mobileNumber}`;

  // Send message to the owner
  await api.sendMessage(messageToOwner, ownerID);

  // Notify the user
  return api.sendMessage("Your mobile number has been sent to the owner successfully.", threadID, event.messageID);
};