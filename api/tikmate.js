export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL tidak ditemukan" });
  }

  try {
    const apiRes = await fetch(`https://tikmate.app/api/lookup?url=${encodeURIComponent(url)}`);
    const data = await apiRes.json();

    if (data && data.token && data.id) {
      res.status(200).json(data);
    } else {
      res.status(500).json({ error: "Gagal mengambil data dari TikMate" });
    }
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data" });
  }
      }
