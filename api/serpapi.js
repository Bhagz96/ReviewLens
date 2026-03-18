export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { data_id, api_key } = req.query;
  if (!data_id || !api_key) return res.status(400).json({ error: "Missing params" });
  const url = `https://serpapi.com/search.json?engine=google_maps_reviews&data_id=${encodeURIComponent(data_id)}&api_key=${encodeURIComponent(api_key)}&hl=en&sort_by=newestFirst`;
  const response = await fetch(url);
  const data = await response.json();
  return res.status(200).json(data);
}
