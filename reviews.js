export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { data_id } = req.query;
  const apiKey = req.query.api_key;

  if (!data_id || !apiKey) {
    return res.status(400).json({ error: 'Missing data_id or api_key' });
  }

  try {
    const url = `https://serpapi.com/search.json?engine=google_maps_reviews&data_id=${encodeURIComponent(data_id)}&api_key=${encodeURIComponent(apiKey)}&num=20&hl=en`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
