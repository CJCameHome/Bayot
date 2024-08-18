module.exports.config = {
  name: "reload",
  version: "1.0.0",
  hasPermission: 1, // Require admin permission
  credits: "CJ",
  description: "Reloads all modules",
  usePrefix: true,
  allowPrefix: true,
  commandCategory: "Admin",
  cooldowns: 5 
};

module.exports.run = async function ({ api, event, args }) {
  try {
    // Get the path to the 'modules' folder
    const modulesPath = __dirname.replace(/commands/, ''); 

    // Get all files in the 'modules' folder
    const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== "commands"); 

    // Reload each module
    for (const module of modules) {
      const modulePath = path.join(modulesPath, module.name);
      delete require.cache[require.resolve(modulePath)];
      await require(modulePath); 
    }

    api.sendMessage("Modules reloaded successfully!", event.threadID);
  } catch (error) {
    console.error("Error reloading modules:", error);
    api.sendMessage("An error occurred while reloading modules.", event.threadID);
  }
};

// Require necessary modules
const fs = require("fs");
const path = require("path");