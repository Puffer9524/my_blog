export function getTagHref(tag: string): string {
  // A literal '+' is valid in a path (unlike a query string). Astro's route
  // matcher keeps encoded reserved characters, so C++ must not become C%2B%2B.
  return `/tag/${encodeURIComponent(tag).replace(/%2B/g, '+')}`;
}
