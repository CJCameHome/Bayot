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

    // Check if the user replied to a photo or video
    if (isReply && isReply.attachments.length > 0) {
        const attachment = isReply.attachments[0];
        const fileType = attachment.type;

        if (fileType === 'photo') {
            // Download the photo
            const fileUrl = attachment.url;
            const filePath = `${__dirname}/cache/temp_photo.jpg`;
            const writer = fs.createWriteStream(filePath);

            const downloadPhoto = async () => {
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

            // Upload the photo to Facebook
            try {
                await downloadPhoto();

                const formData = new FormData();
                formData.append('source', fs.createReadStream(filePath));
                formData.append('caption', message);
                formData.append('access_token', accessToken);

                const uploadResponse = await axios.post(`https://graph.facebook.com/${pageId}/photos`, formData, {
                    headers: formData.getHeaders() // Correctly pass form headers here
                });

                api.sendMessage("📸 | Photo posted to Facebook!", event.threadID, event.messageID);
                fs.unlinkSync(filePath); // Remove the photo after posting
            } catch (err) {
                console.error("Error posting photo:", err);
                api.sendMessage("❌ | Error posting photo to Facebook.", event.threadID, event.messageID);
            }
        } else if (fileType === 'video') {
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
                formData.append('source', fs.createReadStream(filePath));
                formData.append('description', message);
                formData.append('access_token', accessToken);

                const uploadResponse = await axios.post(`https://graph.facebook.com/${pageId}/videos`, formData, {
                    headers: formData.getHeaders() // Correctly pass form headers here
                });

                api.sendMessage("🎥 | Video posted to Facebook!", event.threadID, event.messageID);
                fs.unlinkSync(filePath); // Remove the video after posting
            } catch (err) {
                console.error("Error posting video:", err);
                api.sendMessage("❌ | Error posting video to Facebook.", event.threadID, event.messageID);
            }
        } else {
            api.sendMessage("❌ | Only photo and video attachments are supported.", event.threadID, event.messageID);
        }
    } else {
        // If no reply, just post a message
        try {
            const postResponse = await axios.post(
                `https://graph.facebook.com/${pageId}/feed`,
                {
                    message: message,
                    access_token: accessToken
                }
            );

            api.sendMessage("✅ | Message posted to Facebook!", event.threadID, event.messageID);
        } catch (err) {
            console.error("Error posting message:", err);
            api.sendMessage("❌ | Error posting message to Facebook.", event.threadID, event.messageID);
        }
    }
};