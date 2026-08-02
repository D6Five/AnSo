/**
 * Bundle entry for the config validator.
 *
 * A committed file rather than one generated at run time: esbuild resolves
 * imports relative to the importing file, so a shim written to the system temp
 * directory cannot see the project at all.
 */
export { CLIENTS } from '../clients/index';
export { validateConfig } from './schema';
