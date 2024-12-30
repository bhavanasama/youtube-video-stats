


const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


function extractVideoId(url) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/) || 
                url.match(/(?:https?:\/\/)?youtu\.be\/([^&]+)/);
  return match ? match[1] : null;
}


function formatNumber(number) {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1) + "M"; 
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1) + "K"; 
  }
  return number.toString(); 
}


app.post("/video-stats", async (req, res) => {
  const { videoUrl } = req.body;
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
    const response = await axios.get(apiUrl);

    const stats = response.data.items[0].statistics;
    const likes = stats.likeCount;
    const views = stats.viewCount;


    const formattedLikes = formatNumber(Number(likes));
    const formattedViews = formatNumber(Number(views));


    res.json({
      original: {
        likes,
        views,
      },
      formatted: {
        likes: formattedLikes,
        views: formattedViews,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch video stats" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
