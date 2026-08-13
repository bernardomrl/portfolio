// src/app/[locale]/[...rest]/page.tsx
import { notFound } from 'next/navigation';

// why: a pathname that matches no route is a routing 404, and the App Router
// answers it with the global 404 rather than with the not-found boundary of
// `[locale]` — that boundary is only reached by an explicit notFound() raised
// inside the segment. This catch-all is that call, and it is what makes the
// localized 404 reachable from a URL (D-131).
export const dynamicParams = true;

export default function CatchAllNotFound(): never {
  notFound();
}
