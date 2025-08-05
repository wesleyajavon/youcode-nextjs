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
    <nav aria-label="Breadcrumb" >
      <ol className={'flex '}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? 'text-white-foreground' : 'text-gray-500',
            )}
          >
            <Link
              aria-label={`Go to ${breadcrumb.label} page`}
              href={breadcrumb.href}
            >
              {breadcrumb.icon && breadcrumb.label && (
                <span className="inline-flex items-center align-middle gap-2">
                  {breadcrumb.icon}
                  {breadcrumb.label}
                </span>
              )}
              {breadcrumb.label && !breadcrumb.icon && (
                <span className='inline-flex items-center align-middle'>{breadcrumb.label}</span>
              )}
              {breadcrumb.icon && !breadcrumb.label && (
                <span className='inline-flex items-center align-middle'>{breadcrumb.icon}</span>
              )}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-2 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
