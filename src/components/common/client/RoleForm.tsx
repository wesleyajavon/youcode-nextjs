"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/common/button";
import { Typography } from "@/components/ui/common/typography";
import { CardContent, CardFooter } from "@/components/ui/common/card";
import Link from "next/link";
import { updateRoleAction } from "@/app/account/edit/_actions/account.query";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/common/select";
import { Form } from "@/components/ui/common/form";
import { EditRoleFormValues, Role } from "@/types/role";

// This component is used to edit a user's role in the account settings.
// It allows the user to change their role between "Student" and "Teacher".
export function EditRoleForm({ id, role }: { id: string; role: Role }) {
    const [isPending, startTransition] = useTransition();
    const form = useForm<EditRoleFormValues>({
        defaultValues: { role }
    });
    const router = useRouter();

    const handleSubmit = async (data: EditRoleFormValues) => {
        startTransition(async () => {
            const res = await updateRoleAction(id, data.role);
            if (res.success) {
                toast.success(`Role updated successfully to: ${data.role === "ADMIN" ? "Teacher" : "Student"} !`);
                router.push(`/account`);
                router.refresh();
            } else {
                toast.error("Failed to update role..");
            }
        });
    };

    return (
        <Form form={form} onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4 mb-30">
                <div>
                    <Typography variant="small">Role</Typography>
                    <Controller
                        name="role"
                        control={form.control}
                        defaultValue={role}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">Student</SelectItem>
                                    <SelectItem value="ADMIN">Teacher</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 mt-4 ml-30">
                <Button type="submit" disabled={isPending}>Save</Button>
                <Button asChild variant="outline">
                    <Link href="/account">Cancel</Link>
                </Button>
            </CardFooter>
        </Form>
    );
}