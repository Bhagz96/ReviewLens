export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { data_id, api_key, next_page_token } = req.query;
  if (!data_id || !api_key) return res.status(400).json({ error: "Missing params" });
  try {
    await new Promise(r => setTimeout(r, 1500));
    let url = `https://serpapi.com/search.json?engine=google_maps_reviews&data_id=${encodeURIComponent(data_id)}&api_key=${encodeURIComponent(api_key)}&hl=en&sort_by=relevance`;
    if (next_page_token) url += `&next_page_token=${encodeURIComponent(next_page_token)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) return res.status(200).json({ error: data.error });
    return res.status(200).json({
      place_info: data.place_info,
      reviews: data.reviews || [],
      next_page_token: data.serpapi_pagination?.next_page_token || null
    });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
