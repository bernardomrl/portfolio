/**
 * Runs before the document paints and decides whether this is the first view of the
 * session.
 *
 * why: a string executed inline in the document rather than an effect. The gate has to
 * be known before the first paint — read after hydration, the site would appear, vanish
 * and fade back in, which is worse than no effect at all. It is the same mechanism
 * `next-themes` uses for the theme class, for the same reason (D-105).
 *
 * why: `sessionStorage` and not `localStorage`. The intro belongs to the arrival, not to
 * the visitor: a reader coming back a week later is arriving again. Session scope
 * survives every route and locale change inside the tab and dies with it.
 *
 * why: the attribute is written on a delay on the first view rather than immediately.
 * Client-side navigation does not re-run this script, so an attribute set at once would
 * still be absent when the locale switch remounts the tree and the animation would
 * replay. The delay covers the run and closes the gate for everything after it.
 *
 * why: wrapped in try/catch. `sessionStorage` throws rather than returning null under
 * Safari's private mode and under a third-party cookie block, and an intro is not worth
 * a script error on the first line of the document. The catch degrades to playing it.
 */
export const INTRO_SCRIPT = `try{var k='bm:intro';var d=document.documentElement;if(sessionStorage.getItem(k)){d.dataset.intro='done'}else{sessionStorage.setItem(k,'1');setTimeout(function(){d.dataset.intro='done'},1000)}}catch(e){}`;
