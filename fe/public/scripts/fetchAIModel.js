import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Bypass SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  try {
    const ai = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
    const data = await ai.json();
    console.log("AVAILABLE MODELS:", data.models?.map(m => m.name).filter(n => n.includes("gemini")));
  } catch (e) {
    console.error("Fetch models failed:", e.message);
  }
}

run();
