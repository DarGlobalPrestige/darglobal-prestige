import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";

/**
 * Server-side Wix client for admin/CMS operations.
 * Use only in Server Components or API routes. Never expose API key to the client.
 * Configure: WIX_API_KEY, WIX_ACCOUNT_ID, WIX_SITE_ID, WIX_CLIENT_ID
 */
export function getWixClient() {
  const apiKey = process.env.WIX_API_KEY;
  const accountId = process.env.WIX_ACCOUNT_ID;
  const siteId = process.env.WIX_SITE_ID;

  if (!apiKey || !accountId) {
    console.warn("Wix: missing WIX_API_KEY or WIX_ACCOUNT_ID. Using read-only mock.");
    return null;
  }

  return createClient({
    auth: ApiKeyStrategy({
      apiKey,
      accountId,
      ...(siteId && { siteId }),
    }),
    modules: {
      collections,
      items,
    },
  });
}

export type WixClient = NonNullable<ReturnType<typeof getWixClient>>;
