import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/common/typography';

export const Layout = (props: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        // Responsive: padding, gap, max width, vertical on mobile, horizontal on desktop
        'w-full max-w-[80vw] md:max-w-3xl flex flex-col gap-4 m-auto px-2 sm:px-4 mt-2 sm:mt-4',
        props.className
      )}
    />
  );
};

export const LayoutHeader = (props: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        // Responsive: vertical on mobile, horizontal on desktop
        'flex flex-col md:flex-row items-start gap-2 w-full md:flex-1 min-w-[160px]',
        props.className
      )}
    />
  );
};

export const LayoutTitle = (props: ComponentPropsWithoutRef<'h1'>) => {
  return (
    <Typography
      {...props}
      variant="h4"
      className={cn("text-lg sm:text-xl font-semibold", props.className)}
    />
  );
};

export const LayoutDescription = (props: ComponentPropsWithoutRef<'p'>) => {
  return <Typography {...props} className={cn("text-sm sm:text-base", props.className)} />;
};

export const LayoutActions = (props: ComponentPropsWithoutRef<'div'>) => {
  return <div {...props} className={cn('flex flex-col sm:flex-row items-center gap-2', props.className)} />;
};

export const LayoutContent = (props: ComponentPropsWithoutRef<'div'>) => {
  return <div {...props} className={cn('w-full', props.className)} />;
};