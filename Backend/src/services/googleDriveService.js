const { google } = require('googleapis');
const stream = require('stream');
require('dotenv').config(); // Ensure you have installed dotenv

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const PAYMENT_SCREENSHOTS_FOLDER_ID = process.env.GOOGLE_DRIVE_PAYMENT_SCREENSHOTS_FOLDER_ID;
const PROFILE_PICTURES_FOLDER_ID = process.env.GOOGLE_DRIVE_PROFILE_PICTURES_FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const uploadToGoogleDrive = async (fileObject, purpose) => {
    try {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);

        const driveService = google.drive({ version: 'v3', auth: oauth2Client });

        const { data } = await driveService.files.create({
            media: {
                mimeType: fileObject.mimetype,
                body: bufferStream,
            },
            requestBody: {
                name: `user-${Date.now()}-${fileObject.originalname}`,
                parents: [purpose==="payment_screenshot" ? PAYMENT_SCREENSHOTS_FOLDER_ID  : PROFILE_PICTURES_FOLDER_ID], // Uploads to your specific folder
            },
            fields: 'id, name, webContentLink, webViewLink',
        });

        // Make the file publicly readable so the HTML <img> tag can load it
        await driveService.permissions.create({
            fileId: data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Use 'uc?export=view' to make it a direct image source
        return `https://drive.google.com/uc?export=view&id=${data.id}`;

    } catch (error) {
        console.error("Google Drive API Error:", error.message);
        throw new Error("Failed to upload image to Google Drive");
    }
};

module.exports = { uploadToGoogleDrive };