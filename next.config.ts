import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // why: --no-agents-md only covers the scaffold. From 16.3, `next dev`
  // regenerates AGENTS.md and CLAUDE.md whenever it detects a coding agent
  // in the environment.
  agentRules: false,
};

export default nextConfig;
