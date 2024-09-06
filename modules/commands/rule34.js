const axios = require('axios');
const fs = require('fs');
const request = require('request');
const xml2js = require('xml2js');

module.exports.config = {
	name: "rule34",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Jonell Magallanes and Nethanel Debulgado",
    usePrefix: true,
    allowPrefix: true,
	description: "Search and save rule34 image with title",
	commandCategory: "nsfw",
	cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
 api.sendMessage("📪 | Sending Please Wait...", event.threadID, event.messageID);
  const searchTitle = args.join(" ");
    const parser = new xml2js.Parser();

    try {
        const response = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURI(searchTitle)}`);
        parser.parseStringPromise(response.data).then((result) => {
            const posts = result.posts.post;
            posts.forEach((post, index) => {
                const imgUrl = post.$.file_url;
                const imgPath = __dirname + `/cache/rule34_${index}.jpg`;
                request(imgUrl).pipe(fs.createWriteStream(imgPath)).on("close", () => {
                    api.sendMessage({ body: `Image ${index+1}: ${searchTitle}`,
                        attachment: fs.createReadStream(imgPath)},
                        event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
                });
            });
        });
    } catch (err) {
        api.sendMessage("API error, please try again later", event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    }

};