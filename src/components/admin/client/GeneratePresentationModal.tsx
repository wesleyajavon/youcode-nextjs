"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

type GenerateLessonModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResult: (content: string) => void;
};

export function GeneratePresentationModal({ open, onOpenChange, onResult }: GenerateLessonModalProps) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Merci de saisir un prompt.");
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            // Appel à ton API IA (à adapter selon ton backend)
            const res = await fetch(`/api/admin/courses/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            if (!res.ok) throw new Error("Erreur lors de la génération");
            const data = await res.json();
            setResult(data.content);
        } catch (e) {
            toast.error("Erreur lors de la génération du contenu.");
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
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe the lesson you want to generate..."
                        rows={3}
                        disabled={loading}
                    />
                    <Button onClick={handleGenerate} disabled={loading} className="w-full mt-2">
                        {loading ? <Loader className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
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