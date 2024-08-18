module.exports.config = {
  name: "botinfo",
  version: "1.0.1",
  hasPermission: 0,
  credits: "CJ",
  description: "Sends information about the bot and its owner",
  usePrefix: true, // Set to true to enable the use of prefix while false if not.
  allowPrefix: true, // Set to true to allow prefix even if usePrefix is false, this doesn't do anything if the usePrefix is true.
  commandCategory: "About",
  cooldowns: 5 // seconds to activate again
};

const fs = require('fs');
const path = require('path');

module.exports.run = function ({ api, event, box }) {
  const infoMessage = "Hello! I am TiteBot. My owner is CJ. I am here to assist you with various tasks and provide information as needed.";

  const dirPath = path.resolve(__dirname,'cache', 'botinfo');

  // Check if directory exists
  if (!fs.existsSync(dirPath)) {
    return api.sendMessage("Directory not found: " + dirPath, event.threadID);
  }

  // Read the directory and select a random file
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Error reading the directory:", err);
      return api.sendMessage("Error reading the directory.", event.threadID);
    }

    if (files.length === 0) {
      return api.sendMessage("No images found in the directory.", event.threadID);
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const imagePath = path.join(dirPath, randomFile);

    // Sending the bot info message
    api.sendMessage(infoMessage, event.threadID, () => {
      // Sending the random image
      const readStream = fs.createReadStream(imagePath);

      api.sendMessage({
        body: '',
        attachment: readStream
      }, event.threadID);
    });
  });
};