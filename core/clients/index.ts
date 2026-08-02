import type { ClientConfig } from '../config/schema';
import { ansoConfig } from './anso.config';
import { reefConfig } from './reef.config';

/**
 * Every client this codebase can build.
 *
 * Which one a build uses is decided at build time by CLIENT_ID, not at runtime
 * by hostname. One deploy serves one customer: it keeps their data, their
 * domain and their uptime separate, and means a mistake in one client's config
 * cannot reach another client's children.
 */
export const CLIENTS: Record<string, ClientConfig> = {
  anso: ansoConfig,
  reef: reefConfig,
};

export function resolveClient(id: string | undefined): ClientConfig {
  const key = (id ?? 'anso').trim();
  const config = CLIENTS[key];
  if (!config) {
    throw new Error(
      `Unknown CLIENT_ID "${key}". Known clients: ${Object.keys(CLIENTS).join(', ')}.`,
    );
  }
  return config;
}

export { ansoConfig, reefConfig };
