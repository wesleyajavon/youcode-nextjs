'use client';

import { courseActionCreate, courseActionEdit } from '@/app/admin/courses/[id]/edit/_actions/course.action';
import { COURSE_STATE, CourseFormSchema } from '@/app/admin/courses/[id]/edit/_actions/course.schema';
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


export type CourseFormProps = {
  defaultValue?: CourseFormSchema & {
    id: string;
  };
};

export const CourseForm = ({ defaultValue }: CourseFormProps) => {
  const form = useZodForm({
    schema: CourseFormSchema,
    defaultValues: defaultValue,
  });
  const router = useRouter();

  return (
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
              <Link className='hover:underline' href="https://icons8.com/icons">icons8.com</Link>. Provide a link to an image that represents your course 👆🏼
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
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
        )}
      />
      <FormField
        control={form.control}
        name="presentation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Presentation</FormLabel>
            <FormControl>
              <Textarea placeholder="Introduce your course. What will students learn? 🧠" {...field} />
            </FormControl>
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
                {COURSE_STATE.map((state) => (
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
        <a href="/admin/courses">Cancel</a>
      </Button>
    </Form>
  );
};