/**
 * Validate every client config before a build runs.
 *
 * Run in CI ahead of `npm run build`. The failure this prevents is a client app
 * that compiles, deploys, issues a certificate, and only then turns out to have
 * two subjects the same colour or an empty currency noun — by which point a
 * customer has already seen it.
 *
 * Usage: npm run config:check
 */

import { build } from 'esbuild';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = join(tmpdir(), `d6five-configs-${Date.now()}.mjs`);

await build({
  entryPoints: ['core/config/validation-entry.ts'],
  outfile: out,
  bundle: true,
  format: 'esm',
  platform: 'node',
  logLevel: 'silent',
});

const { CLIENTS, validateConfig } = await import(pathToFileURL(out).href);

let failed = 0;
console.log('\n  D6Five — client config validation');
console.log('  ' + '─'.repeat(62));

for (const [key, config] of Object.entries(CLIENTS)) {
  const problems = validateConfig(config);
  if (problems.length === 0) {
    console.log(
      `  ok    ${key.padEnd(8)} ${String(config.subjects.length).padStart(2)} subjects · ` +
        `grades ${config.learner.grades.join('/')} · ${config.terms.currency} · ${config.domain}`,
    );
  } else {
    failed++;
    console.log(`  FAIL  ${key}`);
    for (const p of problems) console.log(`          ${p.path}: ${p.message}`);
  }
}

console.log('  ' + '─'.repeat(62));
console.log(`  ${Object.keys(CLIENTS).length - failed} valid, ${failed} invalid\n`);
process.exit(failed === 0 ? 0 : 1);
