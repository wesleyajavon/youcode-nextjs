import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { LessonForm } from '@/components/admin/client/LessonForm';

// This component is used as a wrapper for the lesson creation form.
// It provides a header with instructions and renders the LessonForm component.
// The form allows the user to create a new lesson with all necessary details.
// The default values for the lesson form include an empty name, hidden state, empty content,
// and the course ID passed as a parameter. The lesson ID is set to an empty string
// since this is for creating a new lesson.
export async function AdminLessonCreateUI(params: { courseId: string }) {

    return (
        <Card>
            <CardHeader>
                <Typography variant="h2">Ready to create a lesson? 🆕</Typography>
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
