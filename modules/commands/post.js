const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "post",
  version: "1.0.0",
  hasPermission: 2, // Only admins or bot owners
  credits: "CJ",
  description: "Post something on Facebook.",
  commandCategory: "admin",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args.length) {
    return api.sendMessage("Usage: post <text>", threadID, messageID);
  }

  // Read the configuration file to get the access token
  let config;
  try {
    const configPath = __dirname + '/cache/config.json'; // Ensure the path is correct
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error("Failed to read configuration:", error);
    return api.sendMessage("Failed to read configuration.", threadID, messageID);
  }

  const accessToken = config.facebookAccessToken; // Read the access token from the config file
  const message = args.join(" ");

  try {
    // Post the message to the bot's timeline
    const response = await axios.post(
      `https://graph.facebook.com/me/feed`, // 'me' refers to the authenticated user
      {
        message: message,
        access_token: accessToken
      }
    );

    if (response.data.id) {
      api.sendMessage("Successfully posted on Facebook!", threadID, messageID);
    }
  } catch (error) {
    console.error("Error posting to Facebook:", error.response ? error.response.data : error);
    api.sendMessage("Failed to post on Facebook.", threadID, messageID);
  }
};