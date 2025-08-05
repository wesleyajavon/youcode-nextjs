import { clsx } from 'clsx';
import Link from 'next/link';
import React from 'react';

interface Breadcrumb {
  label?: string;
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="w-full px-2 py-2 bg-background rounded-md shadow-sm">
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm overflow-x-auto">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active ? "page" : undefined}
            className={clsx(
              "flex items-center",
              breadcrumb.active
                ? "font-bold text-primary"
                : "text-muted-foreground hover:text-primary transition-colors"
            )}
          >
            <Link
              aria-label={`Go to ${breadcrumb.label} page`}
              href={breadcrumb.href}
              className={clsx(
                "inline-flex items-center gap-1 px-2 py-1 rounded",
                breadcrumb.active ? "bg-primary/10" : ""
              )}
              tabIndex={0}
            >
              {breadcrumb.icon && (
                <span className="inline-flex items-center">{breadcrumb.icon}</span>
              )}
              {breadcrumb.label && (
                <span className="truncate max-w-[80px] sm:max-w-none">{breadcrumb.label}</span>
              )}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-1 text-muted-foreground select-none">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
