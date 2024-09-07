const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

module.exports.config = {
    name: "hanime",
    version: "1.0.0",
    hasPermission: 0,
    credits: "CJ",
    description: "Search and save videos from hanime(.)tv",
    usePrefix: true,
    commandCategory: "nsfw",
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const searchQuery = args.join(" ");
    const url = `https://hanime.tv/search?search=${encodeURI(searchQuery)}`;
    api.sendMessage(`🔍 | Searching for "${searchQuery}"...`, event.threadID, event.messageID);

    try {
        // Fetch the search page HTML
        const response = await axios.get(url);
        const html = response.data;

        // Parse the HTML using cheerio
        const $ = cheerio.load(html);

        // Find and extract the first search result video link
        const videoLinks = [];
        $('.video-card').each((i, element) => {
            const title = $(element).find('.video-card-title').text().trim();
            const link = $(element).find('a').attr('href');
            const thumbnail = $(element).find('img').attr('data-src');
            if (link) {
                videoLinks.push({
                    title: title,
                    link: `https://hanime.tv${link}`,
                    thumbnail: thumbnail
                });
            }
        });

        if (videoLinks.length === 0) {
            return api.sendMessage("❌ | No results found.", event.threadID, event.messageID);
        }

        // Save results to a file (optional)
        fs.writeFileSync(`${__dirname}/cache/hanime_results.json`, JSON.stringify(videoLinks, null, 2));

        // Send the first result to the chat
        const firstResult = videoLinks[0];
        api.sendMessage(
            `🔞 | Title: ${firstResult.title}\n🌐 | Link: ${firstResult.link}`,
            event.threadID,
            event.messageID
        );

    } catch (error) {
        console.error("Error during the search:", error.message);
        api.sendMessage("❌ | Error occurred while searching for videos.", event.threadID, event.messageID);
    }
};