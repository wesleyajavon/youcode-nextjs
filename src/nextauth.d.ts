import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession['user'] & {
      /** The user's id address. */
      id?: string;
      /** The user's role. */
      role?: 'USER' | 'ADMIN';
    };
  }
}