export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { data_id, api_key } = req.query;
  if (!data_id || !api_key) return res.status(400).json({ error: "Missing params" });

  let allReviews = [];
  let place_info = null;
  let nextToken = null;
  const maxPages = 3;

  for (let page = 0; page < maxPages; page++) {
    let url = `https://serpapi.com/search.json?engine=google_maps_reviews&data_id=${encodeURIComponent(data_id)}&api_key=${encodeURIComponent(api_key)}&hl=en&sort_by=newestFirst`;
    if (nextToken) url += `&next_page_token=${encodeURIComponent(nextToken)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) { if (page === 0) return res.status(200).json({ error: data.error }); break; }
      if (page === 0) place_info = data.place_info;
      allReviews = allReviews.concat(data.reviews || []);
      nextToken = data.serpapi_pagination?.next_page_token;
      if (!nextToken) break;
    } catch(e) {
      if (page === 0) return res.status(500).json({ error: e.message });
      break;
    }
  }
  return res.status(200).json({ place_info, reviews: allReviews });
}
