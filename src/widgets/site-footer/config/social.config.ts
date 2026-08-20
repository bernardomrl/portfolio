/**
 * External destinations of the Connect and Legal columns of §3.3.
 *
 * why: slice-local rather than in `shared/config/`. §2.4 gives `config/` to
 * slice-local constants, and there is exactly one consumer today. The Reach out
 * panel of T-40 is the second; Regra C holds the lift to `shared/` for whoever
 * meets the third.
 */
export const SOCIAL_LINKS = {
  github: 'https://github.com/bernardomrl',
  linkedin: 'https://www.linkedin.com/in/bernardoamrl',
  email: 'mailto:contato@bernardomrl.dev',
} as const;

export const REPOSITORY_LINKS = {
  source: 'https://github.com/bernardomrl/portfolio',
  license: 'https://github.com/bernardomrl/portfolio/blob/main/LICENSE',
} as const;
