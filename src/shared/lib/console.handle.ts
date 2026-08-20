'use client';

import { Dialog } from '@base-ui/react/dialog';

/**
 * Connects the Console trigger in the header to the Console overlay mounted in
 * the layout.
 *
 * why: `'use client'`. `createHandle()` returns a `ReactStore`, which is client
 * state and not the inert token this module first assumed. Without the
 * directive the module is evaluated during server data collection and the call
 * throws at module evaluation.
 *
 * why: a detached handle and not a React context. The trigger lives in
 * `widgets/site-header` and the overlay in `widgets/console`, and the boundary
 * policy grants a widget `shared`, `feature/index` and `entity/index` — never
 * another widget. Base UI's own mechanism for a trigger outside `Dialog.Root`
 * is `createHandle()`, so the two slices reach one module in `shared/` instead
 * of lifting open state into `bootstrap/`.
 *
 * why: no payload type argument. The only caller opens the overlay at its root
 * panel; the Reach out entry point of §3.2, which T-26 needs, is what would
 * make a payload real, and typing one now fixes its shape against an imagined
 * consumer — the surface D-163 and D-170 refused twice.
 */
export const consoleHandle = Dialog.createHandle();
