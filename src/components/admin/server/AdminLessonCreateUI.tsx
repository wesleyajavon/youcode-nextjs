import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { LessonForm } from '../client/LessonForm'; // adapte le chemin si besoin

// This component is used to create a new lesson in the admin panel.
// It renders a form for creating a lesson and provides a header with instructions.
// The lesson form allows the user to input lesson details such as name, state, content,
// and course ID. The form is initialized with default values, which can be empty for a new lesson.
// If the lesson is successfully created, it redirects to the lesson details page and refreshes the page.
export async function AdminLessonCreateUI(params: { courseId: string }) {

    return (
        <Card>
            <CardHeader>
                <Typography variant="h2">Ready to create a new lesson? ✏️</Typography>
                <Typography variant="small" className="mt-2">
                    🤖 Feel free to use our latest AI lesson generator to help you get started quickly. 
                </Typography>
                <Typography variant="muted" className="mt-2">
                    Ensure all fields are filled out correctly before submitting.
                </Typography>

            </CardHeader>
            <CardContent>
                <LessonForm
                    defaultValue={{
                        name: '',
                        state: 'HIDDEN',
                        content: '',
                        courseId: params.courseId,
                        id: ''
                    }}
                />
            </CardContent>
        </Card>
    )
}
