"use client"

import { useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { LogOut, User } from "lucide-react"
import { Session } from "next-auth"
import { useMutation } from "@tanstack/react-query"
import { signOut } from "next-auth/react"
import { Loader } from "@/components/ui/loader"
import { redirect } from "next/navigation"

export type LoggedInButtonProps = {
    user: Session["user"]
}

export const LoggedInButton = (props: LoggedInButtonProps) => {
    const [open, setOpen] = useState(false)
    const mutation = useMutation({
        mutationFn: async () => {
            signOut()
        }
    })

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{props.user?.name?.[0]}</AvatarFallback>
                            {props.user.image && (
                                <AvatarImage
                                    src={props.user.image}
                                    alt={props.user.name ?? "user picture"}
                                />
                            )}
                        </Avatar>
                        {props.user.name}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => redirect('/account')}>
                        <User className="" size={12} />
                        My account
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setOpen(true)}>
                        <LogOut className="" size={12} />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to log out?
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
            </AlertDialog>
        </>
    )
}
