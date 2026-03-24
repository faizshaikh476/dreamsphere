import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface DreamAIResult {
  story_text: string;
  tags: string[];
  ai_emotion: string;
  summary: string;
}

export async function enrichDreamWithAI(dreamText: string, mood: string): Promise<DreamAIResult> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackDreamAI(dreamText, mood);
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You structure dream journal entries. Return strict JSON with keys: story_text, tags, ai_emotion, summary. Tags must be an array of 3-6 short lowercase terms."
      },
      {
        role: "user",
        content: `Mood: ${mood}\nDream: ${dreamText}`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "dream_enrichment",
        strict: true,
        schema: {
          type: "object",
          properties: {
            story_text: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 6
            },
            ai_emotion: { type: "string" },
            summary: { type: "string" }
          },
          required: ["story_text", "tags", "ai_emotion", "summary"],
          additionalProperties: false
        }
      }
    }
  });

  const rawText = response.output_text;
  return JSON.parse(rawText) as DreamAIResult;
}

function fallbackDreamAI(dreamText: string, mood: string): DreamAIResult {
  const tags = dreamText
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length > 4)
    .slice(0, 5);

  return {
    story_text: `In this dream, the scene unfolds with a ${mood} undertone. ${dreamText.trim()} The memory feels symbolic, cinematic, and slightly unfinished, as if your mind is replaying a message that still wants attention.`,
    tags: Array.from(new Set(tags.length ? tags : ["dream", "memory", mood])),
    ai_emotion: mood,
    summary: dreamText.slice(0, 140)
  };
}
