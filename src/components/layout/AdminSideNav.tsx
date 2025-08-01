"use client"

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BookOpen, Home, PlusCircle, User, LogOut, ArrowLeft } from "lucide-react";
import { Typography } from "../ui/typography";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Loader } from "../ui/loader";


const navLinks = [
	{ href: "/admin", label: "Dashboard", icon: Home },
	{ href: "/admin/courses", label: "Hub", icon: BookOpen },
	{ href: "/admin/courses/new", label: "New Course", icon: PlusCircle },
	{ href: "/account", label: "Account", icon: User },
];

export function AdminSideNav({ visible = true, onClose }: { visible?: boolean; onClose?: () => void }) {
	const pathname = usePathname() ?? "";
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


	if (!visible) return null;

	return (
		<>
			<nav className="flex flex-col gap-2 py-8 px-4 bg-primary/5 border-r border-border min-h-screen justify-between" aria-label="Admin main navigation">
				<div>
					<div className="flex items-center justify-between mb-4">
						<Typography variant="h2">Panel</Typography>
						{onClose && (
							<Button
								variant="ghost"
								className=" ml-2"
								onClick={onClose}
								aria-label="Masquer la navigation"
								type="button"
							>
								<ArrowLeft className="h-6 w-6" />
							</Button>
						)}
					</div>
					<ul className="flex flex-col gap-2 mt-2">
						{navLinks.map(({ href, label, icon: Icon }) => {
							let isActive = false;
							if (href === "/admin") {
								isActive = pathname === "/admin";
							} else if (href === "/admin/courses/new") {
								isActive = pathname === "/admin/courses/new";
							} else if (href === "/admin/courses") {
								isActive =
									pathname?.startsWith("/admin/courses") &&
									pathname !== "/admin/courses/new";
							} else {
								isActive = pathname === href;
							}

							return (
								<li key={href}>
									<Link
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
					{/* Affichage du rôle */}
					<span className="text-xs text-muted-foreground px-3 py-2 rounded bg-primary/10 w-fit mx-auto">
						<Typography variant="small">
							Logged in as: <strong>Admin</strong>
						</Typography>
					</span>
					<span className="text-xs text-muted-foreground px-3 py-2 rounded w-fit mx-auto">
						<button
							onClick={() => setOpen(true)}
							className="flex items-center gap-3 rounded  text-base font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
						>
							<LogOut className="h-5 w-5" />
							Log out
						</button>
					</span>
				</div>
			</nav>
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
									mutation.mutate();
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
	);
}