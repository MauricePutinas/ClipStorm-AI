import { getCurrentUser } from "@/lib/auth";
import { ok, handleError, readJson } from "@/lib/api";
import { hookGenerateSchema } from "@/lib/validation";
import { getAIProvider } from "@/lib/ai/provider";
import { hashString } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await getCurrentUser();
    const body = await readJson(req);
    const input = hookGenerateSchema.parse(body);

    const provider = getAIProvider();
    const seed = hashString(input.topic) % 1000;
    const variants = await provider.generateHooks(input.topic, input.language, seed);

    return ok(variants);
  } catch (error) {
    return handleError(error);
  }
}
