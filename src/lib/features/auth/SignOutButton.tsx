'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { Loader } from '@/components/ui/loader'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function SignOutButton() {

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
    )
}
