const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "hanime",
    version: "1.0.0",
    hasPermission: 0,
    credits: "CJ",
    description: "Search and save videos from Hanime.tv",
    usePrefix: true,
    commandCategory: "nsfw",
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const searchQuery = args.join(" ");
    
    if (!searchQuery) {
        return api.sendMessage("❌ | Please provide a search query!", event.threadID, event.messageID);
    }
    
    api.sendMessage(`🔍 | Searching for "${searchQuery}"...`, event.threadID, event.messageID);

    try {
        // Use the Replit API URL here (replace with your Replit URL)
        const apiUrl = `https://your-hanime-api-project.repl.co/api/v1/video?search=${encodeURIComponent(searchQuery)}`;
        const response = await axios.get(apiUrl);
        
        const videos = response.data.hits || [];

        if (videos.length === 0) {
            return api.sendMessage("❌ | No results found.", event.threadID, event.messageID);
        }

        // Prepare the first video result
        const firstVideo = videos[0];
        const videoTitle = firstVideo.name;
        const videoThumbnail = firstVideo.poster_url;
        const videoLink = firstVideo.hentai_video_id ? `https://hanime.tv/videos/hentai/${firstVideo.hentai_video_id}` : '';

        // Download the video thumbnail image
        const imgPath = path.join(__dirname, `/cache/hanime_thumbnail.jpg`);
        const imgResponse = await axios({
            url: videoThumbnail,
            responseType: 'stream',
        });
        imgResponse.data.pipe(fs.createWriteStream(imgPath)).on('close', () => {
            // Send the video details along with the thumbnail
            api.sendMessage({
                body: `🔞 | Title: ${videoTitle}\n🌐 | Link: ${videoLink}`,
                attachment: fs.createReadStream(imgPath),
            }, event.threadID, event.messageID, () => fs.unlinkSync(imgPath));
        });

    } catch (error) {
        console.error("Error during the search:", error.message);
        api.sendMessage("❌ | Error occurred while searching for videos.", event.threadID, event.messageID);
    }
};