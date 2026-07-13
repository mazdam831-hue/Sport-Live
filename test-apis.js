// Test Unsplash API
async function testUnsplash() {
  const key = "NLb4Hb9of4AcwYCoxa_6xygu-4NxgE_s6r-Lod3IZqw";
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=football&per_page=1`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    const data = await res.json();
    console.log("✅ Unsplash OK:", data.results?.[0]?.urls?.regular);
  } catch (e) {
    console.log("❌ Unsplash FAILED:", e.message);
  }
}

// Test Pexels API
async function testPexels() {
  const key = "AGNyP5K6565kaKkxLwNsU6MmoJp5bEc1bGqRNrrtofm08v63ugQR8me8";
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=tennis&per_page=1`,
      { headers: { Authorization: key } }
    );
    const data = await res.json();
    console.log("✅ Pexels OK:", data.photos?.[0]?.src?.large);
  } catch (e) {
    console.log("❌ Pexels FAILED:", e.message);
  }
}

testUnsplash();
testPexels();
