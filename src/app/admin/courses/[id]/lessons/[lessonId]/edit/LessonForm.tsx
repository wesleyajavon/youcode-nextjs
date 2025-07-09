'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useZodForm,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { lessonActionCreate, lessonActionEdit } from './lesson.action';
import { LESSON_STATE, LessonFormSchema } from './lesson.schema';
import { useEffect, useState } from 'react';



export type LessonFormProps = {
    defaultValue?: LessonFormSchema & {
        id: string;
    };
};

export const LessonForm = ({ defaultValue }: LessonFormProps) => {

    // Ajoute ce hook pour charger les cours (exemple avec fetch API)
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        fetch("/api/courses") // Crée une API route qui retourne la liste des cours
            .then((res) => res.json())
            .then((data) => setCourses(data));
    }, []);

    const form = useZodForm({
        schema: LessonFormSchema,
        defaultValues: defaultValue,
    });
    const router = useRouter();

    return (
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
                    router.push(`/admin/courses/${data.lesson.courseId}/lessons/${data.lesson.id}`);
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
                            <Input placeholder="NextReact" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                            <Textarea placeholder="## Some content" {...field} />
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

            <Button type="submit">Submit</Button>
        </Form>
    );
};