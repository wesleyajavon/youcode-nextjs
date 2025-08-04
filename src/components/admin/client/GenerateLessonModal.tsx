"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/common/dialog";
import { Button } from "@/components/ui/common/button";
import { Textarea } from "@/components/ui/common/textarea";
import { Loader } from "@/components/ui/common/loader";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { GenerateLessonModalProps } from "@/types/lesson";

// This component is used to generate lesson content using AI.
// It provides a modal interface where users can input a prompt for the AI to generate lesson content.
// The generated content can then be used to populate the lesson form.
// The modal includes a text area for the prompt, a button to generate the content,
// and a button to validate and use the generated content.

export function GenerateLessonModal({ courseId, open, onOpenChange, onResult }: GenerateLessonModalProps) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            // Call your AI API (adapt to your backend)
            const res = await fetch(`/api/admin/courses/${courseId}/lessons/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            if (!res.ok) throw new Error("Error during generation");
            const data = await res.json();
            setResult(data.content);
        } catch (e) {
            toast.error("Error generating content.");
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = () => {
        if (result) {
            onResult(result);
            onOpenChange(false);
            setPrompt("");
            setResult(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Sparkles className="inline-block mr-2 text-primary" />
                        Generate a lesson with AI
                    </DialogTitle>
                    <DialogDescription>
                        Describe the lesson that you want to create. Our AI will generate a clear and engaging presentation based on your prompt.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="I want to create a lesson about..."
                        rows={3}
                        disabled={loading}
                    />
                    <Button onClick={handleGenerate} disabled={loading} className="w-full mt-2">
                        {loading ? <Loader />: <Sparkles className="mr-2 h-4 w-4" />}
                        Generate
                    </Button>
                    {result && (
                        <div className="border rounded p-3 bg-muted mt-2 max-h-60 overflow-auto whitespace-pre-line">
                            <strong>Generated content:</strong>
                            <div className="mt-2">{result}</div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleValidate} disabled={!result || loading}>
                        Use this content
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}