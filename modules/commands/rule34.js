const axios = require('axios');
const fs = require('fs');
const request = require('request');
const xml2js = require('xml2js');

module.exports.config = {
	name: "rule34",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Jonell Magallanes and Nethanel Debulgado modified by CJ",
	description: "Search and save rule34 image with title",
	commandCategory: "nsfw",
	cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    api.sendMessage("📪 | Sending Please Wait...", event.threadID, event.messageID);
    const searchTitle = args.join(" ");
    const parser = new xml2js.Parser();
    const imgPaths = [];

    try {
        const response = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURI(searchTitle)}`);
        parser.parseStringPromise(response.data).then((result) => {
            const posts = result.posts.post;
            const promises = posts.map((post, index) => {
                return new Promise((resolve, reject) => {
                    const imgUrl = post.$.file_url;
                    const imgPath = __dirname + `/cache/rule34_${index}.jpg`;
                    request(imgUrl)
                        .pipe(fs.createWriteStream(imgPath))
                        .on("close", () => {
                            imgPaths.push(imgPath);
                            resolve();
                        })
                        .on("error", (err) => reject(err));
                });
            });

            // After all images are downloaded
            Promise.all(promises).then(() => {
                const attachments = imgPaths.map((path) => fs.createReadStream(path));
                api.sendMessage(
                    {
                        body: `Search results for: ${searchTitle}`,
                        attachment: attachments
                    },
                    event.threadID,
                    () => {
                        // Delete all files after sending
                        imgPaths.forEach((path) => fs.unlinkSync(path));
                    },
                    event.messageID
                );
            }).catch((err) => {
                api.sendMessage("Error downloading images, please try again.", event.threadID, event.messageID);
            });
        });
    } catch (err) {
        api.sendMessage("API error, please try again later", event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    }
};