'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/common/button'
import { LogOut } from 'lucide-react'
import { Loader } from '@/components/ui/common/loader'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { LogoutDialog } from '../dialogs/LogoutDialog'

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
