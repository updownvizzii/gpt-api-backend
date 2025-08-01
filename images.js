// images.js

async function generateImage() {
  const promptInput = document.getElementById("prompt");
  const prompt = promptInput.value.trim();
  const loading = document.getElementById("loading");
  const output  = document.getElementById("output");

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  // Show loading state
  loading.classList.remove("hidden");
  output.innerHTML = "";

  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, count: 3 }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Display error message from API
      const errMsg = data.error || data;
      output.innerHTML = `<p class='text-red-500 text-center'>Error: ${JSON.stringify(errMsg)}</p>`;
      return;
    }

    const images = data.images || [];
    if (images.length === 0) {
      output.innerHTML = "<p class='text-center text-white'>No images returned.</p>";
      return;
    }

    // Render images
    images.forEach((url, index) => {
      const card = document.createElement("div");
      card.className = "break-inside-avoid mb-4 rounded-lg overflow-hidden shadow bg-gray-900 relative";

      card.innerHTML = `
        <img src="${url}" alt="Image ${index + 1}" class="w-full object-cover hover:scale-105 transition" />
        <a href="${url}" download="miru-${index + 1}.png"
           class="absolute bottom-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded shadow hover:bg-white font-semibold">
          ⬇️ Download
        </a>
      `;
      output.appendChild(card);
    });
  } catch (err) {
    console.error("Fetch error:", err);
    output.innerHTML = `<p class='text-red-500 text-center'>Something went wrong: ${err.message}</p>`;
  } finally {
    loading.classList.add("hidden");
  }
}