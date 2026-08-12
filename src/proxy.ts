import createMiddleware from 'next-intl/middleware';

import { routing } from '@/shared/config/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // why: everything except Next.js internals, Vercel internals and any pathname
  // carrying a dot, which is how static assets are told apart from routes. The
  // `trpc` entry of the upstream example is dropped — there is no tRPC here.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
