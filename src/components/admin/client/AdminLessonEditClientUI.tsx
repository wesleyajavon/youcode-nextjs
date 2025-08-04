"use client";

import { useState } from "react";
import { Button } from "@/components/ui/common/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/common/card";
import { Sparkles } from "lucide-react";
import { Typography } from "@/components/ui/common/typography";
import { GenerateLessonModal } from "./GenerateLessonModal";
import { Textarea } from "@/components/ui/common/textarea";
import { LessonForm } from "@/components/admin/client/LessonForm";

// This component is used to edit a lesson in the admin panel.
// It allows the user to customize the lesson content using a form.
// The form includes fields for lesson name, state, and content.
// It also provides a button to generate lesson content using AI.
// The component uses a modal to display the AI generation options and updates the lesson content accordingly.

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