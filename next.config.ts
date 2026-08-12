import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // why: --no-agents-md only covers the scaffold. From 16.3, `next dev`
  // regenerates AGENTS.md and CLAUDE.md whenever it detects a coding agent
  // in the environment.
  agentRules: false,
};

// why: the plugin's default lookup is `i18n/request.ts` at the root or under
// `src/`. The FSD hierarchy puts the file in `shared/config/`, so the path is
// passed explicitly (D-107).
const withNextIntl = createNextIntlPlugin('./src/shared/config/i18n/request.ts');

export default withNextIntl(nextConfig);
