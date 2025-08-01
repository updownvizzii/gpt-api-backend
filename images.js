// images.js
async function generateImage() {
  const prompt = document.getElementById("prompt").value.trim();
  const loading = document.getElementById("loading");
  const output  = document.getElementById("output");

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  loading.classList.remove("hidden");
  output.innerHTML = "";

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Show the error from backend
      output.innerHTML = `<p class="text-red-500 text-center">Error: ${data.error}</p>`;
      console.error("Backend error:", data.error);
      return;
    }

    if (!data.images || data.images.length === 0) {
      output.innerHTML = `<p class="text-white text-center">No images returned.</p>`;
      return;
    }

    data.images.forEach((url, i) => {
      const card = document.createElement("div");
      card.className = "break-inside-avoid mb-4 rounded-lg overflow-hidden shadow bg-gray-900 relative";

      card.innerHTML = `
        <img src="${url}" alt="Image ${i+1}" class="w-full object-cover hover:scale-105 transition" />
        <a href="${url}" download="miru-${i+1}.png" class="
          absolute bottom-2 right-2 bg-white/90 text-black text-xs px-2 py-1
          rounded shadow hover:bg-white font-semibold
        ">⬇️ Download</a>
      `;
      output.appendChild(card);
    });
  } catch (err) {
    console.error("Fetch error:", err);
    output.innerHTML = `<p class="text-red-500 text-center">Something went wrong.</p>`;
  } finally {
    loading.classList.add("hidden");
  }
}
