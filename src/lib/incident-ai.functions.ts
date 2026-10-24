import { createServerFn } from "@tanstack/react-start";
import { screenNotes, timelineSchema, INSTRUCTIONS, type Timeline } from "./incident-notes";

// Off unless the owner sets INCIDENT_AI_ENABLED=true (not set in the private preview).
export const getIncidentAiStatus = createServerFn({ method: "GET" }).handler(async () => ({
  enabled: process.env["INCIDENT_AI_ENABLED"] === "true",
}));

type Result = { ok: true; timeline: Timeline } | { ok: false; error: string };

export const organizeIncidentNotes = createServerFn({ method: "POST" })
  .inputValidator((input: { notes: string }) => ({ notes: String(input?.notes ?? "") }))
  .handler(async ({ data }): Promise<Result> => {
    if (process.env["INCIDENT_AI_ENABLED"] !== "true")
      return { ok: false, error: "AI organizing is disabled in this private preview until the owner authorizes it." };
    const problem = screenNotes(data.notes);
    if (problem) return { ok: false, error: problem };
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "AI service is not configured." };

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText, Output } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions: INSTRUCTIONS,
        messages: [{ role: "user", content: data.notes }],
        output: Output.object({ schema: timelineSchema }),
        maxRetries: 0,
        providerOptions: {
          openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
        },
      });
      return { ok: true, timeline: (await result.output) as Timeline };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      console.error("incident organize failed", status); // status only — never log notes
      if (status === 402) return { ok: false, error: "AI credits are used up. Add credits in Settings → Plans & credits." };
      if (status === 429) return { ok: false, error: "Too many requests right now. Try again in a minute." };
      if (status === 403) return { ok: false, error: "The AI service declined this request." };
      return { ok: false, error: "Couldn't organize the notes. Please try again later." };
    }
  });
