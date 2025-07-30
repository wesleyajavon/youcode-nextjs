"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { updateRoleAction } from "@/app/account/edit/_actions/account.query";
import { Form } from "../../ui/form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type Role = "USER" | "ADMIN";

type EditRoleFormValues = {
    role: Role;
};

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
                toast.success("Role updated successfully !");
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
                    <select
                        {...form.register("role")}
                        className="mt-2 block w-full rounded-md border px-3 py-2"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
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