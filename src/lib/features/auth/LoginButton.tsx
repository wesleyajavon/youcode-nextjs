'use client'

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { useMutation } from "@tanstack/react-query"
import { LogIn } from "lucide-react"
import { signIn } from "next-auth/react"

export const LoginButton = () => {

    const mutation = useMutation({
        mutationFn: async () => signIn(),
    })

    return (
        <Button
            variant={"outline"}
            size={'sm'}
            disabled={mutation.isPending}
            onClick={() => {
                signIn()
            }}>
            {mutation.isPending ? (
                <Loader className="ml-1" size={12} />
            ) : <LogIn className="ml-1" size={12} />}

            Login
        </Button>
    )
}