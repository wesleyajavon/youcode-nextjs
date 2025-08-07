"use client"

import { useState } from "react"
import { AvatarImage } from "@/components/ui/common/avatar"
import { Button } from "@/components/ui/common/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/common/dropdown-menu"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { LogOut, User } from "lucide-react"
import { Session } from "next-auth"
import { useMutation } from "@tanstack/react-query"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { LogoutDialog } from "../dialogs/LogoutDialog";

export type LoggedInButtonProps = {
    user: Session["user"]
}

export const LoggedInButton = (props: LoggedInButtonProps) => {
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button aria-label="User menu" variant="outline" size="sm">
                        <Avatar className="h-8 w-8 mr-2 rounded">
                            <AvatarFallback>{props.user?.name?.[0]}</AvatarFallback>
                            {props.user.image && (
                                <AvatarImage
                                    src={props.user.image}
                                    alt={props.user.name ?? "user picture"}
                                    className="rounded"
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

            <LogoutDialog
                open={open}
                setOpen={setOpen}
                isPending={mutation.isPending}
                onConfirm={() => mutation.mutate()}
            />
        </>
    )
}
