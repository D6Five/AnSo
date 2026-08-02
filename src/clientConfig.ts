import { resolveClient } from '../core/clients';

/**
 * The client this build is for.
 *
 * Chosen at build time by `VITE_CLIENT_ID`, not at runtime by hostname. One
 * deploy serves one customer: their data, their domain and their uptime stay
 * separate, and a mistake in one client's config cannot reach another client's
 * children.
 *
 *   VITE_CLIENT_ID=reef npm run build
 *
 * Defaults to AnSo so the existing app and its deployment keep working with no
 * environment set.
 */
export const CLIENT = resolveClient(import.meta.env.VITE_CLIENT_ID as string | undefined);
