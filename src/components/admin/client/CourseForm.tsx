'use client';

import { courseActionCreate, courseActionEdit } from '@/lib/actions/admin/course.action';
import { COURSE_STATE, CourseFormSchema } from '@/lib/validations/course.schema';
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
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { CourseFormProps } from '@/types/course';
import { GeneratePresentationModal } from '@/components/ai/GeneratePresentationModal';

// This component is used to create or edit a course in the admin panel.
// It renders a form for course details including name, image, presentation, and state.
// The form uses Zod for validation and handles submission to create or edit a course.

export const CourseForm = ({ defaultValue }: CourseFormProps) => {
  const form = useZodForm({
    schema: CourseFormSchema,
    defaultValues: defaultValue,
  });
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Form
        form={form}
        className="flex flex-col gap-4"
        onSubmit={async (values) => {

          const { data, serverError } = defaultValue?.id
            ? await courseActionEdit({
              data: values,
              courseId: defaultValue.id,
            })
            : await courseActionCreate(values);

          if (data) {
            toast.success(data.message);
            router.push(`/admin/courses/${data.course.id}`);
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder="https://icons8.com/icons" {...field} />
              </FormControl>
              <FormDescription>
                Recommendation: Use{' '}
                <Link
                  aria-label="Icons8"
                  className='hover:underline'
                  href="https://icons8.com/icons">icons8.com</Link>. Provide a link to a .PNG image that represents your course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Javascript" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <div className="flex items-center justify-between">
          <FormLabel>Presentation</FormLabel>
          <Button
            aria-label='Generate presentation with AI'
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
          name="presentation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Introduce your course. What will students learn? 🧠" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

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
                <FormDescription>
                  Draft: Not published yet. <br />
                  Published: Available to all users. <br />
                </FormDescription>
                <SelectContent>
                  {COURSE_STATE.map((state) => (
                    <SelectItem key={state} value={state} className="capitalize">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

        <Button aria-label='Submit form' type="submit">Submit</Button>
        <Button aria-label='Cancel form' asChild variant="outline">
          <a href="/admin/courses">Cancel</a>
        </Button>
      </Form>
      <GeneratePresentationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onResult={(presentation) => {
          form.setValue('presentation', presentation);
        }} />
    </>
  );
};