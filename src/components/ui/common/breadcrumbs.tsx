import Link from 'next/link';
import React from 'react';

interface Breadcrumb {
  label?: string;
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
}

function BreadcrumbItem({ breadcrumb, isLast }: { breadcrumb: Breadcrumb; isLast: boolean }) {
  const content = (
    <>
      {breadcrumb.icon && <span className="inline-flex items-center mr-1">{breadcrumb.icon}</span>}
      {breadcrumb.label && (
        <span className="truncate max-w-[80px] sm:max-w-none" title={breadcrumb.label}>
          {breadcrumb.label}
        </span>
      )}
      {!isLast && <span className="mx-1 text-muted-foreground select-none">/</span>}
    </>
  );

  if (breadcrumb.active) {
    return (
      <li aria-current="page" className="flex items-center font-bold text-primary">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10">{content}</span>
      </li>
    );
  }

  return (
    <li className="flex items-center text-muted-foreground hover:text-primary transition-colors">
      <Link
        href={breadcrumb.href}
        aria-label={`Go to ${breadcrumb.label ?? 'page'}`}
        className="inline-flex items-center gap-1 px-2 py-1 rounded"
      >
        {content}
      </Link>
    </li>
  );
}

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="w-full px-2 py-2 bg-background rounded-md shadow-sm">
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm overflow-x-auto">
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem
            key={breadcrumb.href}
            breadcrumb={breadcrumb}
            isLast={index === breadcrumbs.length - 1}
          />
        ))}
      </ol>
    </nav>
  );
}
