import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { LessonForm } from '../client/LessonForm'; // adapte le chemin si besoin



export async function AdminLessonCreateUI(params: { courseId: string }) {

    return (
        <Card>
            <CardHeader>
                <Typography variant="h2">Ready to create a new lesson? ✏️</Typography>
                <Typography variant="small" className="mt-2">
                    Feel free to use AI to generate lesson content, or create it manually.
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
