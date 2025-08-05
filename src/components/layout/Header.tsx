import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Typography } from '@/components/ui/common/typography';
import { AuthButton } from '@/lib/features/auth/AuthButton';
import { SiteConfig } from '@/lib/site-config';

export function Header() {
    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 px-2 sm:px-4">
                {/* Left side - site title */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start py-2 sm:py-0">
                    <Link aria-label='Go to home page' href="/" className="flex items-center gap-2">
                        <img
                            src="/logo-2.png"
                            alt="Site logo"
                            className="h-12 w-10 sm:h-16 sm:w-12 object-contain"
                        />
                    </Link>
                    <Typography
                        variant="h4"
                        as={Link}
                        href="/"
                        className="text-base sm:text-2xl font-bold"
                    >
                        {SiteConfig.title}
                    </Typography>
                </div>

                {/* Right side - nav / theme toggle */}
                <nav
                    aria-label="Header navigation"
                    className="flex items-center gap-2 justify-center sm:justify-end w-full sm:w-auto py-2 sm:py-0"
                >
                    <AuthButton />
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}