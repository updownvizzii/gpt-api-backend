export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
