// images.js

console.log("✅ images.js loaded");

async function generateImage() {
  const prompt = document.getElementById("prompt").value.trim();
  const output = document.getElementById("output");
  const loading = document.getElementById("loading");

  if (!prompt) return;

  output.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (data.images && data.images.length > 0) {
      data.images.forEach((url, index) => {
        const container = document.createElement("div");
        container.className = "break-inside-avoid mb-4 rounded-lg overflow-hidden shadow bg-gray-900 relative";

        const img = document.createElement("img");
        img.src = url;
        img.alt = `Generated Image ${index + 1}`;
        img.className =
          "w-full h-auto object-cover transition-transform duration-300 ease-in-out hover:scale-105";

        const download = document.createElement("a");
        download.href = url;
        download.download = `miru-img-${index + 1}.png`;
        download.textContent = "⬇️ Download";
        download.className =
          "absolute bottom-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded shadow hover:bg-white font-semibold";

        container.appendChild(img);
        container.appendChild(download);
        output.appendChild(container);
      });
    } else {
      output.innerHTML = "<p class='text-center text-white'>No images returned.</p>";
    }
  } catch (err) {
    console.error("Error:", err);
    output.innerHTML = "<p class='text-center text-red-500'>Something went wrong.</p>";
  } finally {
    loading.classList.add("hidden");
  }
}