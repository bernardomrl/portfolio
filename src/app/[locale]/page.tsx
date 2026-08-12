import { ThemeToggle } from '@/features/theme-toggle';

export default function Home() {
  return (
    <main>
      <div>Hello world!</div>
      {/* why: provisional host. widgets/ does not exist until T-22 and app/ is
          routing only (§2.1) — the site-header of T-22 is the permanent mount
          and removes this (D-102). */}
      <ThemeToggle />
    </main>
  );
}
