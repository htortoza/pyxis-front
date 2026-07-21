/** Same 900px breakpoint global-header.css/sidebar.ts/kpi-card.css use for the mobile layout switch. */
export const MOBILE_BREAKPOINT_QUERY = '(max-width: 900px)';

/** jsdom (the test environment) has no matchMedia implementation -- guards every call site,
 * not just `typeof window`, which alone isn't enough (window exists in jsdom, matchMedia doesn't). */
export function mobileMediaQueryList(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(MOBILE_BREAKPOINT_QUERY)
    : null;
}
