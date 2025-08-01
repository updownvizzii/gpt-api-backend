// /api/image.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1) Check that the key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not set");
    return res.status(500).json({ error: "Server misconfiguration: missing API key" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const apiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 3,
      }),
    });

    const data = await apiRes.json();

    // 2) If OpenAI returns an error
    if (!apiRes.ok) {
      console.error("🔴 OpenAI API error:", data.error);
      return res.status(apiRes.status).json({ error: data.error?.message || "OpenAI API error" });
    }

    // 3) Map out the URLs
    const urls = (data.data || []).map((img) => img.url).filter(Boolean);

    if (urls.length === 0) {
      console.warn("⚠️ No images returned from OpenAI:", data);
    }

    return res.status(200).json({ images: urls });
  } catch (err) {
    console.error("🔥 Unexpected error calling OpenAI:", err);
    return res.status(500).json({ error: "Failed to generate images" });
  }
}
