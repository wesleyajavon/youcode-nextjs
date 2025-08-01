"use client"

import { useState } from "react"
import {
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import * as AlertDialog from "@radix-ui/react-alert-dialog";

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
import { Typography } from "@/components/ui/typography";

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
                    <Button variant="outline" size="sm">
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
