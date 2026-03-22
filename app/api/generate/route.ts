import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { topic, targetAudience, duration, speaker, format } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const mins = parseInt(duration) || 60;
    const prompt = `You are an expert webinar strategist and content planner. Generate a complete webinar outline for: "${topic}".

Topic: ${topic}
Target Audience: ${targetAudience || "Professionals, intermediate level"}
Duration: ${mins} minutes
Speaker: ${speaker || "Expert presenter"}
Format: ${format || "Educational + Product demo"}

Generate a complete webinar plan in this JSON format (no markdown):
{
  "webinarTitle": "Catchy, specific webinar title",
  "subtitle": "One-liner value proposition",
  "totalDuration": "${mins} minutes",
  "sections": [
    {
      "section": "Section name (e.g. Opening, Topic 1, Q&A)",
      "startTime": "0:00",
      "endTime": "5:00",
      "durationMinutes": 5,
      "type": "Talking | Demo | Poll | Q&A | Break | CTA",
      "slideTitle": "Suggested slide title",
      "bulletPoints": ["3-5 key talking points for this section"],
      "tips": "Delivery tips for the presenter"
    }
  ],
  "polls": [
    {
      "question": "Poll question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "when": "When to run this poll (e.g. after min 10)",
      "purpose": "Why this poll matters for engagement or data"
    }
  ],
  "qnaPrompts": [
    "Pre-planned Q&A question 1 to seed the conversation",
    "Pre-planned Q&A question 2"
  ],
  "ctaMoments": [
    {
      "when": "At what minute mark",
      "ctaType": "Register | Subscribe | Book Call | Download | Share",
      "ctaCopy": "Exact CTA copy to say/use on screen",
      "offer": "What's being offered"
    }
  ],
  "technicalChecklist": [
    "Microphone test",
    "Screen sharing check",
    "Slides loaded",
    "Polls set up",
    "Backup internet ready"
  ]
}`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
