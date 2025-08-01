'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { Loader } from '@/components/ui/loader'
import { useMutation } from '@tanstack/react-query'
import {
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { toast } from 'sonner'
import { useState } from 'react'
import { Typography } from '@/components/ui/typography'

export default function SignOutButton() {

    const [open, setOpen] = useState(false)

    const mutation = useMutation({
        mutationFn: async () => {
            await signOut({
                callbackUrl: '/', // Change this to wherever you want users to land after logout
            })

        },
        onSuccess: () => {
            localStorage.setItem("showSignOutToast", "1");
        },
    })


    return (
        <>
            <Button
                variant="destructive"
                disabled={mutation.isPending}
                onClick={() => setOpen(true)}>
                {mutation.isPending ? (
                    <Loader className="ml-1" size={12} />
                ) :
                    <LogOut className="ml-1" size={12} />}
                Log out
            </Button>
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
                    <AlertDialogContent>
                        <AlertDialogHeader className="items-center text-center">
                            <LogOut className="mx-auto mb-2 h-8 w-8 text-destructive" />
                            <AlertDialogTitle className="text-lg font-bold">
                                Are you sure you want to log out?
                            </AlertDialogTitle>
                            <Typography variant="small" className="text-muted-foreground mt-2">
                                You will be redirected to the homepage and will need to log in again to access your courses.
                            </Typography>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-row gap-2 justify-center mt-4">
                            <AlertDialogCancel asChild>
                                <Button variant="outline">Cancel</Button>
                            </AlertDialogCancel>
                            <Button
                                variant="destructive"
                                disabled={mutation.isPending}
                                onClick={() => mutation.mutate()}
                            >
                                {mutation.isPending ? (
                                    <Loader className="mr-2" size={16} />
                                ) : (
                                    <LogOut className="mr-2" size={16} />
                                )}
                                Log out
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    )
}
