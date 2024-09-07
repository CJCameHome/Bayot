const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports.config = {
    name: "hanime",
    version: "1.0.0",
    hasPermission: 0,
    credits: "CJ",
    description: "Search and save videos from hanime.tv",
    usePrefix: true,
    commandCategory: "nsfw",
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const searchQuery = args.join(" ");
    const url = `https://hanime.tv/search?search=${encodeURI(searchQuery)}`;
    api.sendMessage(`🔍 | Searching for "${searchQuery}"...`, event.threadID, event.messageID);

    try {
        // Launch Puppeteer browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the search URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the search results to load
        await page.waitForSelector('.video-card');  // Adjust selector if necessary

        // Extract search results
        const videoLinks = await page.evaluate(() => {
            const videos = [];
            document.querySelectorAll('.video-card').forEach((element) => {
                const title = element.querySelector('.video-card-title')?.innerText.trim();
                const link = element.querySelector('a')?.href;
                const thumbnail = element.querySelector('img')?.getAttribute('data-src');
                if (title && link) {
                    videos.push({
                        title: title,
                        link: link,
                        thumbnail: thumbnail
                    });
                }
            });
            return videos;
        });

        await browser.close();

        // Handle case when no results are found
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