import { z } from 'zod';

/**
 * Contract for the public environment. Every key declared here is inlined into
 * the client bundle at build time, so no secret may ever appear in this schema.
 * Secrets belong to `server-env.ts`, which does not exist in the MVP (D-31).
 */
const browserEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url({ protocol: /^https?$/ }).refine((value) => !value.endsWith('/'), {
    error: 'must not end with a trailing slash',
  }),
});

// why: Next.js inlines NEXT_PUBLIC_* by statically replacing literal
// `process.env.X` member expressions in the source text. Passing `process.env`
// itself, destructuring it, or indexing it with a variable defeats that
// analysis: the value still resolves on the server, the build still succeeds,
// and the browser receives `undefined`.
const parsed = browserEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  // why: ZodError does not extend Error in Zod 4, so rethrowing it as-is gives
  // the build reporter an object it cannot print as a failure.
  throw new Error(`Invalid browser environment:\n${z.prettifyError(parsed.error)}`);
}

/**
 * Validated public environment. Reading it cannot fail at render time, because
 * the module throws at import time.
 */
export const env = parsed.data;
