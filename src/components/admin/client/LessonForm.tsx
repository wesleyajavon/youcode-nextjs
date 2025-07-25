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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { lessonActionCreate, lessonActionEdit } from '../../../app/admin/courses/[id]/lessons/[lessonId]/edit/lesson.action';
import { LESSON_STATE, LessonFormSchema } from '../../../app/admin/courses/[id]/lessons/[lessonId]/edit/lesson.schema';



export type LessonFormProps = {
    defaultValue?: LessonFormSchema & {
        id: string;
    };
};

export const LessonForm = ({ defaultValue }: LessonFormProps) => {

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
                    router.push(`/admin/courses/${data.lesson.courseId}/lessons/`);
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
            <Button asChild variant="outline">
                <a href={`/admin/courses/${defaultValue?.courseId}/lessons`}>Cancel</a>
            </Button>
        </Form>
    );
};