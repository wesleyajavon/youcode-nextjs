"use client"


import { SiteConfig } from '@/lib/site-config';
import Link from 'next/link';
import { Typography } from '../ui/typography';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-border mt-5">
            <div className="m-auto w-full max-w-3xl px-2 py-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/logo.svg" // Put logo.png inside your /public folder
                                alt="Site logo"
                                className="h-16 w-12 object-contain"
                            />
                        </Link>
                        <Typography variant="base" as={Link} href="/">
                            {SiteConfig.title}
                        </Typography>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                        <Link className="hover:underline"
                            href="https://portfolio-wesleyajavon.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer">
                            Portfolio
                        </Link>
                        {/* <Link className="hover:underline"
                            href="https://youcode.sh"
                            target="_blank"
                            rel="noopener noreferrer">
                            YouCode.sh
                        </Link> */}
                        <div className="flex gap-6 justify-center text-2xl">
                            <a
                                href="https://github.com/wesleyajavon"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="hover:text-neutral-300"
                            >
                                {/* Remplace par ton icône GitHub si tu utilises Lucide ou Heroicons */}
                                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                            </a>
                            <a
                                href="https://linkedin.com/in/wesleyajv"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="hover:text-neutral-300"
                            >
                                {/* Remplace par ton icône LinkedIn si tu utilises Lucide ou Heroicons */}
                                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z" /></svg>
                            </a>
                        </div>

                    </div>
                </div>
                <div className="flex w-full items-center justify-center">
                    <Typography variant="base" className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Wesley Ajavon
                    </Typography>
                </div>
            </div>
        </footer>
    );
};