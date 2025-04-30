export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Link kosong." });

  try {
    const base = "https://api.tikmate.app/api/lookup";
    const encoded = encodeURIComponent(url);
    const lookup = await fetch(`${base}?url=${encoded}`);
    const json = await lookup.json();

    if (!json || !json.token || !json.id) {
      return res.status(500).json({ error: "Gagal mengambil data." });
    }

    const downloadLink = `https://tikmate.app/download/${json.token}/${json.id}.mp4`;

    return res.status(200).json({ video: downloadLink });
  } catch (err) {
    return res.status(500).json({ error: "Gagal mengambil video." });
  }
}
