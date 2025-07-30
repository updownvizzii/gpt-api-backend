async function generateImage() {
  const prompt = document.getElementById("promptInput").value;
  if (!prompt.trim()) return alert("Enter a prompt!");

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("imageGrid").innerHTML = "";

  const res = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  if (data?.images?.length) {
    data.images.forEach((url) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <img src="${url}" alt="Generated Image" class="rounded shadow" />
        <a href="${url}" download target="_blank" class="block mt-2 text-sm text-pink-400 hover:underline">Download</a>
      `;
      document.getElementById("imageGrid").appendChild(div);
    });
  } else {
    alert("No images returned.");
  }

  document.getElementById("loading").classList.add("hidden");
}
