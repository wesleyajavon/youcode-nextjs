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
import { LogoutDialog } from './LogoutDialog'

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
            <LogoutDialog
                open={open}
                setOpen={setOpen}
                isPending={mutation.isPending}
                onConfirm={() => mutation.mutate()}
            />
        </>
    )
}
