// /api/image.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Debug logs
  console.log("🔑 OPENAI_API_KEY?", process.env.OPENAI_API_KEY ? "OK" : "MISSING");
  console.log("👉 Prompt:", req.body.prompt);

  const { prompt, count = 3 } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const maxImages = Math.min(count, 3);
  const imageUrls = [];

  try {
    for (let i = 0; i < maxImages; i++) {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model: "dall-e-3", prompt, n: 1 }),
      });

      const data = await response.json();
      console.log(`Response #${i + 1}:`, data);

      if (!response.ok) {
        console.error("🚨 OpenAI API error:", data.error);
        return res
          .status(response.status)
          .json({ error: data.error?.message || "OpenAI API error" });
      }

      const url = data.data?.[0]?.url;
      if (url) {
        imageUrls.push(url);
      } else {
        console.warn(`⚠️ No URL in response #${i + 1}`, data);
      }
    }

    console.log("✅ Generated image URLs:", imageUrls);
    return res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error("🔥 Unexpected error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate images" });
  }
}