"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { GenerateLessonModal } from "./GenerateLessonModal";
import { Textarea } from "@/components/ui/textarea";
import { LessonForm } from "@/components/admin/client/LessonForm";

export default function AdminLessonEditClientUI({ lesson }: { lesson: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState(lesson.content ?? "");

  return (
    <>
      <CardHeader>
        <CardTitle>
          <Typography variant="h2">Customize your lesson 📝</Typography>
          <Typography variant="muted" className="mt-2">
            Fill in the details below to edit the lesson.
          </Typography>
        </CardTitle>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setModalOpen(true)}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Générer avec l’IA
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={10}
        />
        <LessonForm defaultValue={{ ...lesson, content }} />
      </CardContent>
      <GenerateLessonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onResult={setContent}
      />
    </>
  );
}