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
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                You confirm log out ?
                            </AlertDialogTitle>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button variant="secondary">Cancel</Button>
                            </AlertDialogCancel>
                            <Button
                                variant="destructive"
                                disabled={mutation.isPending}
                                onClick={() => {
                                    mutation.mutate()
                                }}>
                                {mutation.isPending ? (
                                    <Loader className="ml-1" size={12} />
                                ) :
                                    <LogOut className="ml-1" size={12} />}
                                Log out
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    )
}
