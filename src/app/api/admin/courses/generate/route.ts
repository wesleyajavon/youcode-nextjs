import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
        }

        // Appel à l'API Groq (compatible OpenAI)
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
You are an educational assistant. Write a concise, engaging, and well-written course description for students in under 30 words.
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
        console.error("Erreur lors de la génération de contenu IA (Groq):", e);
        return NextResponse.json({ error: "Erreur IA" }, { status: 500 });
    }
}