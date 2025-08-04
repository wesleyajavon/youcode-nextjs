import { NextRequest, NextResponse } from "next/server";
import { ratelimitlesson } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        // Getting the prompt from the request body
        // The prompt should be a description of the course you want to generate
        // The generated content can then be used to populate the course form.
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: "Prompt needed" }, { status: 400 });
        }

        // Checking rate limit 
        // This will limit the user to 5 requests per hour
        // If the limit is exceeded, it will return a 429 status code
        // This is to prevent abuse of the AI generation feature
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { success } = await ratelimitlesson.limit(ip);
        if (!success) {
            return NextResponse.json({ error: "Too many requests. You can only generate 5 requests per hour. Try again later." }, { status: 429 });
        }

        // Call to Groq API (compatible OpenAI)
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama3-70b-8192", // ou "llama3-8b-8192", "mixtral-8x7b-32768", etc.
                messages: [
                    {
                        role: "system",
                        content: `
You are an educational assistant. Generate clear, structured, and engaging lesson content for students in markdown format.
- Use headings (#, ##, ###), bullet points, and numbered lists where appropriate.
- Always add a blank line between paragraphs, headings, and list items for readability.
- Use code blocks (\`\`\`) for code examples.
- Make sure the markdown is well spaced and easy to read when rendered.
- Do not include any frontmatter or metadata, only the lesson content.
`
                    },
                    { role: "user", content: prompt },
                ],
                max_tokens: 800,
                temperature: 0.7,
            }),
        });

        if (!groqRes.ok) {
            const error = await groqRes.text();
            return NextResponse.json({ error }, { status: 500 });
        }

        const data = await groqRes.json();
        const content = data.choices?.[0]?.message?.content ?? "";

        return NextResponse.json({ content });
    } catch (e) {
        console.error("Error generating AI content (Groq):", e);
        return NextResponse.json({ error: "AI Error" }, { status: 500 });
    }
}