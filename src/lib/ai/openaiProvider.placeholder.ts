// PLATZHALTER: OpenAI-Provider.
// Nicht aktiv. Die App nutzt standardmäßig den Template-Provider.
//
// So aktivierst du diesen Provider später:
//   1. `npm install openai`
//   2. In .env: AI_PROVIDER="openai" und OPENAI_API_KEY="sk-..."
//   3. Die Methoden unten implementieren (Prompt -> JSON -> in die Typen mappen).
//   4. `openaiImplemented` auf `true` setzen.
import type { AIProvider } from "./provider";

export const openaiImplemented = false;

function notImplemented(): never {
  throw new Error(
    "[ClipStorm AI] OpenAI-Provider ist noch nicht implementiert. " +
      "Bitte src/lib/ai/openaiProvider.placeholder.ts ausimplementieren.",
  );
}

export const openaiProvider: AIProvider = {
  name: "openai",
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
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async generateClips(ctx) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Du bist ein Short-Form-Content-Stratege. Antworte als JSON." },
      { role: "user", content: buildClipPrompt(ctx) },
    ],
  });
  return parseClips(res.choices[0].message.content);
}
*/
