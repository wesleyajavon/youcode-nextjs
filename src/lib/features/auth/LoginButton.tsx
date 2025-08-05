'use client'

import { Button } from "@/components/ui/common/button"
import { Loader } from "@/components/ui/common/loader"
import { useMutation } from "@tanstack/react-query"
import { LogIn } from "lucide-react"
import { signIn } from "next-auth/react"

type LoginButtonProps = {
  label?: string
  className?: string
}

export const LoginButton = ({ label = "Sign in", className }: LoginButtonProps) => {
  const mutation = useMutation({
    mutationFn: async () => {
      await signIn()
      },
  })

  return (
    <Button
      aria-label="Sign in"
      variant="outline"
      size="sm"
      disabled={mutation.isPending}
      onClick={() => signIn()}
      className={className}
    >
      {mutation.isPending ? (
        <Loader className="ml-1" size={12} />
      ) : (
        <LogIn className="ml-1" size={12} />
      )}
      {label}
    </Button>
  )
}