const googleTTS = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "talkvm",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Send an AI-generated voice message from text.",
  commandCategory: "utility",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5 // seconds to activate again
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const text = args.join(' ');

  if (!text) {
    return api.sendMessage("Usage: talkvm <text>", threadID, messageID);
  }

  try {
    // Generate TTS URL
    const url = googleTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });

    // Download the audio file
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const audioPath = path.resolve(__dirname, 'audio.mp3');
    fs.writeFileSync(audioPath, response.data);

    // Send the audio file as a voice message
    api.sendMessage(
      {
        body: '',
        attachment: fs.createReadStream(audioPath)
      },
      threadID,
      () => {
        fs.unlinkSync(audioPath); // Delete the file after sending
      },
      messageID
    );
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while generating the voice message.", threadID, messageID);
  }
};