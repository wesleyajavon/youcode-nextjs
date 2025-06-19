// src/components/layout/Header.
import { SiteConfig } from '../../lib/site-config';
import Link from 'next/link';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Typography } from '../ui/typography';
import { LoginButton } from '@/lib/features/auth/LoginButton';
import { AuthButton } from '@/lib/features/auth/AuthButton';

export function Header() {
    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b">
            <div className="container mx-auto flex items-center justify-between h-16 px-0 sm:px-0 lg:px-0">
                {/* Left side - site title */}
                <div className="flex items-center gap-1 md:gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/logo.svg" // Put logo.png inside your /public folder
                            alt="Site logo"
                            className="h-16 w-12 object-contain"
                        />
                    </Link>

                    <Typography variant="h3" as={Link} href="/">
                        {SiteConfig.title}
                    </Typography>

                </div>

                {/* Right side - nav / theme toggle */}
                <nav className="flex items-center space-x-1">
                    <AuthButton />
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
