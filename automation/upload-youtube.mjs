import fs from "node:fs";
import { google } from "googleapis";

const videoPath = process.env.VIDEO_PATH || "out/short.mp4";
const title = process.env.VIDEO_TITLE || "Sinal perdido | Senhor Vale";
const description = process.env.VIDEO_DESCRIPTION || "Um fragmento do universo Senhor Vale.\n\n#Shorts #SenhorVale #ARG";
const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
if (!refreshToken) throw new Error("YOUTUBE_REFRESH_TOKEN não configurado");
const auth = new google.auth.OAuth2(process.env.YOUTUBE_CLIENT_ID, process.env.YOUTUBE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: refreshToken });
const youtube = google.youtube({ version: "v3", auth });
const publishAt = process.env.PUBLISH_AT;
const result = await youtube.videos.insert({
  part: ["snippet", "status"],
  requestBody: {
    snippet: { title, description, categoryId: "20", tags: ["Shorts","Senhor Vale","ARG","horror"] },
    status: {
      privacyStatus: publishAt ? "private" : (process.env.PRIVACY_STATUS || "private"),
      publishAt: publishAt || undefined,
      selfDeclaredMadeForKids: false
    }
  },
  media: { body: fs.createReadStream(videoPath) }
});
console.log(JSON.stringify({ uploaded: true, videoId: result.data.id, publishAt: result.data.status?.publishAt, privacyStatus: result.data.status?.privacyStatus }));
