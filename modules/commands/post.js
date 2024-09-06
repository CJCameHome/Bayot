const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

module.exports.config = {
    name: "post",
    version: "1.0.0",
    hasPermission: 0,
    credits: "CJ",
    description: "Post a message or reply with a photo/video to post on Facebook",
    usePrefix: true,
    allowPrefix: true,
    commandCategory: "social",
    cooldowns: 10
};

const accessToken = 'EAAG2ZA8ZA8cxMBO4SsfnqMTQsLQgQwNCUgaQ2lozPhZB3PuWChSvqZCLsadB0ZCgQT4PGSw2q3NZBuCNUWTvk2I1yR00zBZAYFsM7AGZCPbceMHQ6c9fZBX2BoXFIWh3Va5iTwye78CsNVNnprew5rfmivj3Sf79KyZAJ4JUeZBH4T1yXAFVgVGNmjWGSoZC9wZDZD'; // Replace with your Facebook access token
const pageId = '61561106523847'; // Replace with your Page or User ID

module.exports.run = async ({ api, event, args }) => {
    const isReply = event.messageReply;
    let message = args.join(" ");

    // Check if the user replied to a video
    if (isReply && isReply.attachments.length > 0) {
        const attachment = isReply.attachments[0];
        const fileType = attachment.type;

        if (fileType === 'video') {
            // Download the video
            const fileUrl = attachment.url;
            const filePath = `${__dirname}/cache/temp_video.mp4`;
            const writer = fs.createWriteStream(filePath);

            const downloadVideo = async () => {
                const response = await axios({
                    url: fileUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                response.data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
            };

            // Upload the video to Facebook
            try {
                await downloadVideo();

                const formData = new FormData();
                formData.append('source', fs.createReadStream(filePath)); // Video file
                formData.append('description', message || ""); // Optional description
                formData.append('access_token', accessToken);

                const uploadResponse = await axios.post(`https://graph.facebook.com/v15.0/${pageId}/videos`, formData, {
                    headers: formData.getHeaders()
                });

                api.sendMessage("🎥 | Video posted to Facebook!", event.threadID, event.messageID);
                fs.unlinkSync(filePath); // Remove the video after posting
            } catch (err) {
                console.error("Error posting video:", err.response?.data || err.message);
                api.sendMessage("❌ | Error posting video to Facebook.", event.threadID, event.messageID);
            }
        } else {
            api.sendMessage("❌ | Only video attachments are supported for this command.", event.threadID, event.messageID);
        }
    } else {
        // If no reply, just post a message
        try {
            const postResponse = await axios.post(
                `https://graph.facebook.com/v15.0/${pageId}/feed`,
                {
                    message: message,
                    access_token: accessToken
                }
            );

            api.sendMessage("✅ | Message posted to Facebook!", event.threadID, event.messageID);
        } catch (err) {
            console.error("Error posting message:", err.response?.data || err.message);
            api.sendMessage("❌ | Error posting message to Facebook.", event.threadID, event.messageID);
        }
    }
};