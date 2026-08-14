import type { ComponentType } from 'react';
import * as runtime from 'react/jsx-runtime';

import { MdxAnchor } from '@/shared/ui/mdx/mdx-anchor';

/**
 * Renders the MDX code Velite compiled at build time.
 *
 * why: this does not violate the absolute rule of §5.1. Parsing, GFM, the
 * rehype pass and the JSX transform all happen inside `velite build`; what
 * `.velite/` stores is JavaScript, and this module evaluates JavaScript. No
 * markdown parser exists in any bundle, which the build verifies by the absence
 * of `micromark` and `mdast-util` in the client chunks. The evaluation itself
 * runs on the server: this is a Server Component and every page is statically
 * generated (§4), so the call happens once at build and the browser receives
 * markup (D-142).
 *
 * why: the `.typeset` wrapper is applied here and nowhere else. §10 requires the
 * prose style to be defined once, and a class the consumer has to remember is
 * defined once only by convention. `.not-typeset` is the escape for a subtree
 * that must leave the style (D-146).
 *
 * why: the component map is a module constant with one entry rather than its
 * own module. Regra C — there is nothing to abstract until a second element
 * needs replacing, and `img` is not that element yet: §10 mandates `next/image`,
 * which needs dimensions the markdown body does not carry (D-147).
 */
const components = { a: MdxAnchor };

type MdxModule = {
  default: ComponentType<{ components: typeof components }>;
};

interface MdxContentProps {
  code: string;
}

export function MdxContent({ code }: MdxContentProps) {
  // why: the compiled body reads the jsx runtime off `arguments[0]` and returns
  // the module object, so the constructor's return type is `Function` and has
  // to be narrowed. `unknown` rather than `any` — Regra B.
  const createModule = new Function(code) as unknown as (jsxRuntime: typeof runtime) => MdxModule;
  const Content = createModule({ ...runtime }).default;

  return (
    <div className="typeset">
      <Content components={components} />
    </div>
  );
}
