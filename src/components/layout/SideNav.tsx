"use client"

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BookOpen, Home, User, LogOut, ArrowLeft } from "lucide-react";
import { Typography } from "@/components/ui/common/typography";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/common/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LogoutDialog } from "@/lib/features/dialogs/LogoutDialog";


const userNavLinks = [
    { href: "/user", label: "Dashboard", icon: Home },
    { href: "/user/courses", label: "My Hub", icon: BookOpen },
    { href: "/account", label: "Account", icon: User },
];

const adminNavLinks = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/courses", label: "Hub", icon: BookOpen },
    { href: "/account", label: "Account", icon: User },
];

type Role = "USER" | "ADMIN";

export function SideNav({ role, visible = false, onClose }: { role: Role; visible?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false)
    const mutation = useMutation({
        mutationFn: async () => {
            await signOut({
                callbackUrl: '/',
            })
        },
        onSuccess: () => {
            localStorage.setItem("showSignOutToast", "1");
        },
    })

    if (!visible) return null;

    return (

        <nav
            aria-label="Side navigation bar"
            className="flex flex-col gap-2 py-8 px-4 bg-primary/5 border-r border-border min-h-screen justify-between"
        >
            <div>
                {/* Header with navigation title and close button */}
                <div className="flex items-center justify-between mb-4">
                    <Typography variant="h2">Panel</Typography>
                    {onClose && (
                        <Button
                            variant="ghost"
                            className="ml-2"
                            onClick={onClose}
                            aria-label="Hide side navigation bar"
                            type="button"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    )}
                </div>

                {/* Navigation links based on user role */}
                <ul className="flex flex-col gap-2 mt-2">
                    {role === "USER" && userNavLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = href === "/user"
                            ? pathname === "/user"
                            : pathname?.startsWith(href);

                        return (
                            <li key={href}>
                                <Link
                                    aria-label={`Go to ${label} page`}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 rounded px-3 py-2 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                                        isActive
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon className="h-5 w-5" />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                    {role === "ADMIN" && adminNavLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = href === "/admin"
                            ? pathname === "/admin"
                            : pathname?.startsWith(href);

                        return (
                            <li key={href}>
                                <Link
                                    aria-label={`Go to ${label} page`}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 rounded px-3 py-2 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                                        isActive
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon className="h-5 w-5" />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="flex flex-col gap-6 mb-2">
                {/* Role */}
                <span className="text-xs text-muted-foreground px-3 py-2 rounded bg-primary/10 w-fit mx-auto">
                    <Typography variant="small">
                        Logged in as: <strong>{role === "ADMIN" ? "Teacher" : "Student"}</strong>
                    </Typography>
                </span>

                {/* Logout button */}
                <span className="text-xs text-muted-foreground px-3 py-2 rounded w-fit mx-auto">
                    <button
                        aria-label="Log out"
                        type="button"
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-3 rounded  text-base font-medium text-destructive hover:bg-destructive/10 hover:text-destructive  hover:cursor-pointer"
                    >
                        <LogOut className="h-5 w-5" />
                        Log out
                    </button>
                </span>
            </div>


            <LogoutDialog
                open={open}
                setOpen={setOpen}
                isPending={mutation.isPending}
                onConfirm={() => mutation.mutate()}
            />
        </nav>

    );
}