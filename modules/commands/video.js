const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "video",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Search for a video on YouTube and send the first result.",
  commandCategory: "utility",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5 // seconds to activate again
};

const YOUTUBE_API_KEY = 'AIzaSyDEE1-zZSRVI8lTaQOVsIAQFgL-_BJKvhk';

async function searchYouTube(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get(url);
  if (response.data.items.length === 0) {
    throw new Error('No results found.');
  }
  return response.data.items[0].id.videoId;
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage("Usage: video <search query>", threadID, messageID);
  }

  try {
    const videoId = await searchYouTube(query);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoTitle = videoInfo.videoDetails.title;
    const videoPath = path.resolve(__dirname, 'video.mp4');

    // Download the video
    const videoStream = ytdl(videoUrl, { filter: 'audioandvideo', quality: 'highestvideo' })
      .pipe(fs.createWriteStream(videoPath));

    videoStream.on('finish', () => {
      // Send the video file as an attachment
      api.sendMessage(
        {
          body: videoTitle,
          attachment: fs.createReadStream(videoPath)
        },
        threadID,
        () => {
          fs.unlinkSync(videoPath); // Delete the file after sending
        },
        messageID
      );
    });

    videoStream.on('error', (error) => {
      console.error(error);
      api.sendMessage("An error occurred while downloading the video.", threadID, messageID);
    });

  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the YouTube video: " + error.message, threadID, messageID);
  }
};