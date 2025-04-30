export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const resolve = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const realUrl = resolve.url;

    const api = await fetch(`https://api.tiklydown.me/download?url=${encodeURIComponent(realUrl)}`);
    const data = await api.json();

    if (!data || !data.video || !data.music) {
      return res.status(500).json({ error: 'Invalid response from API' });
    }

    return res.status(200).json({
      video: data.video.no_watermark,
      audio: data.music.play_url,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
