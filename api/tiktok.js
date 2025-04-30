import https from 'https';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    // Resolve shortlink
    const resolvedUrl = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          resolve(response.headers.location);
        } else {
          resolve(url);
        }
      }).on('error', reject);
    });

    const apiRes = await fetch(`https://api.tiklydown.me/download?url=${encodeURIComponent(resolvedUrl)}`);
    const data = await apiRes.json();

    if (!data || !data.video || !data.music) {
      return res.status(500).json({ error: 'Invalid API response' });
    }

    return res.status(200).json({
      video: data.video.no_watermark,
      audio: data.music.play_url
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
