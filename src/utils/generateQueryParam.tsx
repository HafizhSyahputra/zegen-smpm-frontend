/**
 * This utility for generate query parameter
 *
 * Usage :
 *  useGenerateQueryParam({ foo : "foo" , bar : "bar" })
 * Result:
 *  foo=foo&bar=bar
 * @param payload
 */
export const GenerateQueryparam = (payload: Record<string, string>): string => {
  return Object.keys(payload)
    .map((k) => k + "=" + encodeURIComponent(payload[k]))
    .join("&");
};
