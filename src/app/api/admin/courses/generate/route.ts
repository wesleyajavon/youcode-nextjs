import { NextRequest, NextResponse } from "next/server";
import { ratelimitpresentation } from "@/lib/rate-limit";
import { getRequiredAuthSession } from "@/lib/auth";
import { fetchWithTimeout } from "@/lib/api/ai";

export async function POST(req: NextRequest) {
    const session = await getRequiredAuthSession()

    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        // Getting the prompt from the request body
        // The prompt should be a description of the course you want to generate
        // The generated content can then be used to populate the course form.
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: "Prompt needed" }, { status: 400 });
        }

        // Checking rate limit 
        // This will limit the user to 10 requests per hour
        // If the limit is exceeded, it will return a 429 status code
        // This is to prevent abuse of the AI generation feature
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { success } = await ratelimitpresentation.limit(ip);
        if (!success) {
            return NextResponse.json({ error: "Too many requests. You can only generate 10 requests per hour. Try again later." }, { status: 429 });
        }


        // Call to Groq API
        // This is where the AI generates the course presentation based on the prompt
        // Timeout is handled by the fetchWithTimeout function
        // Timeout is set to 15 seconds
        const groqRes = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
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
You are an educational assistant. Generate a clear, engaging, and student-friendly course description. Use simple language, highlight key benefits, and keep it under 300 characters. Do not generate any thing else but the course description.
`
                    },
                    { role: "user", content: prompt },
                ],
                max_tokens: 800,
                temperature: 0.7,
            }),
        } );

        if (!groqRes.ok) {
            const error = await groqRes.text();
            return NextResponse.json({ error }, { status: 500 });
        }

        const data = await groqRes.json();
        const content = data.choices?.[0]?.message?.content ?? "";

        return NextResponse.json({ content });
    } catch (error: any) {
        console.error("Error generating AI content (Groq):", error);
        return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
    }
}