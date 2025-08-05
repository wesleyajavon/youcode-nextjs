'use client';

import { Button } from '@/components/ui/common/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useZodForm,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select';
import { Textarea } from '@/components/ui/common/textarea';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { lessonActionCreate, lessonActionEdit } from '../../../app/admin/courses/[id]/lessons/[lessonId]/edit/lesson.action';
import { LESSON_STATE, LessonFormSchema } from '../../../app/admin/courses/[id]/lessons/[lessonId]/edit/lesson.schema';
import { GenerateLessonModal } from '../../../lib/features/ai/GenerateLessonModal';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { LessonFormProps } from '@/types/lesson';

// This component is used to create or edit a lesson in the admin panel.
// It renders a form for lesson details including name, content, and state. 

export const LessonForm = ({ defaultValue }: LessonFormProps) => {
    const form = useZodForm({
        schema: LessonFormSchema,
        defaultValues: defaultValue,
    });
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className='max-h-[700px]'>
            <Form
                form={form}
                className="flex flex-col gap-4"
                onSubmit={async (values) => {

                    const { data, serverError } = defaultValue?.id
                        ? await lessonActionEdit({
                            data: values,
                            lessonId: defaultValue.id,
                        })
                        : await lessonActionCreate(values);

                    if (data) {
                        toast.success(data.message);
                        router.push(`/admin/courses/${data.lesson.courseId}/lessons/${defaultValue?.id || data.lesson.id}`);
                        router.refresh();
                        return;
                    }

                    toast.error('Some error occurred', {
                        description: serverError,
                    });
                    return;
                }}
            >

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="JS Fundamentals" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-between">
                    <FormLabel>Content</FormLabel>
                    <Button
                        aria-label='Generate content with AI'
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setModalOpen(true)}
                    >
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI generation
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea className="min-h-[120px] max-h-[350px] resize-vertical"
                                    placeholder="## Some content 📝" {...field} />
                            </FormControl>
                            <FormDescription>Markdown is supported.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {LESSON_STATE.map((state) => (
                                        <SelectItem key={state} value={state} className="capitalize">
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button aria-label='Submit form' type="submit">Submit</Button>
                <Button aria-label='Cancel form' asChild variant="outline">
                    <a href={`/admin/courses/${defaultValue?.courseId}/lessons`}>Cancel</a>
                </Button>
                <GenerateLessonModal
                    courseId={defaultValue?.courseId}
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    onResult={(content) => {
                        form.setValue('content', content);
                    }}
                />
            </Form>


        </div>
    );
};