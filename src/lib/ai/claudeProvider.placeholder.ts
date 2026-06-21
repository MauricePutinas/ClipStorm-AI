// PLATZHALTER: Anthropic Claude-Provider.
// Nicht aktiv. Die App nutzt standardmäßig den Template-Provider.
//
// So aktivierst du diesen Provider später:
//   1. `npm install @anthropic-ai/sdk`
//   2. In .env: AI_PROVIDER="claude" und ANTHROPIC_API_KEY="sk-ant-..."
//   3. Die Methoden unten implementieren (Prompt -> JSON -> in die Typen mappen).
//   4. `claudeImplemented` auf `true` setzen.
import type { AIProvider } from "./provider";

export const claudeImplemented = false;

function notImplemented(): never {
  throw new Error(
    "[ClipStorm AI] Claude-Provider ist noch nicht implementiert. " +
      "Bitte src/lib/ai/claudeProvider.placeholder.ts ausimplementieren.",
  );
}

export const claudeProvider: AIProvider = {
  name: "claude",
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

import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async generateClips(ctx) {
  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4000,
    system: "Du bist ein Short-Form-Content-Stratege. Antworte ausschließlich als JSON.",
    messages: [{ role: "user", content: buildClipPrompt(ctx) }],
  });
  return parseClips(msg.content);
}
*/
