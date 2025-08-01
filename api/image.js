// /api/image.js

export default async function handler(req, res) {
  // Debug: Ensure API key is loaded
  console.log("🔑 OPENAI_API_KEY set?", !!process.env.OPENAI_API_KEY);
  console.log("👉 Received prompt:", req.body.prompt);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, count = 3 } = req.body;
  if (!prompt) {
    console.warn("🚨 Prompt is missing in request body");
    return res.status(400).json({ error: "Prompt is required" });
  }

  const maxImages = Math.min(count, 3);
  const imageUrls = [];

  try {
    // DALL·E 3 only supports n = 1 per request, so loop for each image
    for (let i = 0; i < maxImages; i++) {
      const apiRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1
        }),
      });

      const data = await apiRes.json();
      if (!apiRes.ok) {
        console.error("🔴 OpenAI API error:", data.error);
        return res
          .status(apiRes.status)
          .json({ error: data.error?.message || "OpenAI API error" });
      }

      const url = data.data?.[0]?.url;
      if (url) {
        imageUrls.push(url);
      } else {
        console.warn(`⚠️ No URL returned for generation #${i + 1}`, data);
      }
    }

    console.log("✅ Generated image URLs:", imageUrls);
    return res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error("❌ Unexpected error in image handler:", error);
    return res.status(500).json({ error: "Failed to generate images" });
  }
}
