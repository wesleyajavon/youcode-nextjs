'use client';

import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { useEffect } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (localStorage.getItem("showSignOutToast") === "1") {
      toast.success("Successfully logged out !");
      localStorage.removeItem("showSignOutToast");
    }
  }, []);


  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <SessionProvider>
          <Toaster />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
};