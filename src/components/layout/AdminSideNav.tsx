"use client"

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BookOpen, Users, Home, PlusCircle, User } from "lucide-react";

const navLinks = [
	{ href: "/admin", label: "Dashboard", icon: Home },
	{ href: "/admin/courses", label: "Courses", icon: BookOpen },
	{ href: "/admin/courses/new", label: "New Course", icon: PlusCircle },
	{ href: "/account", label: "Account", icon: User },
];

export function AdminSideNav({ visible = true, onClose }: { visible?: boolean; onClose?: () => void }) {
	const pathname = usePathname();

	if (!visible) return null;

	return (
		<nav className="flex flex-col gap-2 py-8 px-4 bg-primary/5 border-r border-border min-h-screen">
			<div className="mb-6 text-lg font-bold tracking-tight text-primary">
				Panel
			</div>
			{/* Bouton pour fermer sur mobile */}
			{onClose && (
				<button
					className="mb-4 self-end md:hidden text-primary"
					onClick={onClose}
					aria-label="Close sidebar"
				>
					✕
				</button>
			)}
			{navLinks.map(({ href, label, icon: Icon }) => (
				<Link
					key={href}
					href={href}
					className={cn(
						"flex items-center gap-3 rounded px-3 py-2 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary",
						pathname === href
							? "bg-primary/10 text-primary font-semibold"
							: "text-muted-foreground"
					)}
				>
					<Icon className="h-5 w-5" />
					{label}
				</Link>
			))}
		</nav>
	);
}