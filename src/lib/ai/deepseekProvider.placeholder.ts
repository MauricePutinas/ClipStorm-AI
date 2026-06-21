// PLATZHALTER: DeepSeek-Provider.
// Nicht aktiv. Die App nutzt standardmäßig den Template-Provider.
//
// So aktivierst du diesen Provider später:
//   1. DeepSeek ist OpenAI-kompatibel -> `npm install openai`
//   2. In .env: AI_PROVIDER="deepseek" und DEEPSEEK_API_KEY="..."
//   3. Die Methoden unten implementieren (baseURL: https://api.deepseek.com).
//   4. `deepseekImplemented` auf `true` setzen.
import type { AIProvider } from "./provider";

export const deepseekImplemented = false;

function notImplemented(): never {
  throw new Error(
    "[ClipStorm AI] DeepSeek-Provider ist noch nicht implementiert. " +
      "Bitte src/lib/ai/deepseekProvider.placeholder.ts ausimplementieren.",
  );
}

export const deepseekProvider: AIProvider = {
  name: "deepseek",
  async generateClips() {
    return notImplemented();
  },
  async generateHooks() {
    return notImplemented();
  },
  async adaptToPlatform() {
    return notImplemented();
  },
};

/*
Beispiel-Skizze einer echten Implementierung:

import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

async generateClips(ctx) {
  const res = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "Du bist ein Short-Form-Content-Stratege. Antworte als JSON." },
      { role: "user", content: buildClipPrompt(ctx) },
    ],
  });
  return parseClips(res.choices[0].message.content);
}
*/
