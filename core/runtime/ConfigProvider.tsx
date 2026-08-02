import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { assertValidConfig, type ClientConfig, type SubjectConfig } from '../config/schema';

/**
 * Makes the active client config available to the app, and pushes its palette
 * into CSS custom properties so styling follows the theme without every
 * component reaching for the config object.
 *
 * The config is validated at mount rather than at build only. A build that is
 * wired to the wrong config should fail loudly on the first render, not present
 * a half-themed app to a child.
 */

const ConfigContext = createContext<ClientConfig | null>(null);

export function ConfigProvider({
  config,
  children,
}: {
  config: ClientConfig;
  children: ReactNode;
}) {
  assertValidConfig(config);

  useEffect(() => {
    const root = document.documentElement;
    const { palette } = config;

    // Names match the variables the stylesheet already uses, so the theme
    // takes effect without rewriting the CSS for every client.
    root.style.setProperty('--bg-deep', palette.bgDeep);
    root.style.setProperty('--bg-mid', palette.bgMid);
    root.style.setProperty('--nebula-a', palette.nebulaA);
    root.style.setProperty('--nebula-b', palette.nebulaB);
    root.style.setProperty('--ink', palette.ink);
    root.style.setProperty('--ink-dim', palette.inkDim);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--accent-warm', palette.accentWarm);
    root.style.setProperty('--good', palette.good);
    root.style.setProperty('--bad', palette.bad);

    document.title = config.appName;
  }, [config]);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ClientConfig {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('useConfig was called outside ConfigProvider. Wrap the app in it.');
  }
  return config;
}

/**
 * Capitalise a themed noun for the start of a sentence.
 *
 * Needed because a configured noun does not know where it will be used, and
 * "sea glass is earned from every shell" is a sentence starting in lower case.
 * Only the first letter is touched, so "Bible study" does not become
 * "Bible Study".
 */
export function sentenceCase(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}

/** The themed nouns. Kept separate because copy uses these constantly. */
export function useTerms() {
  return useConfig().terms;
}

export function useSubjects(): SubjectConfig[] {
  return useConfig().subjects;
}

export function useSubject(id: string): SubjectConfig | undefined {
  const subjects = useSubjects();
  return useMemo(() => subjects.find((s) => s.id === id), [subjects, id]);
}

/**
 * Format an amount of currency with the right singular or plural noun.
 *
 * Exists because getting this wrong is the most visible way a themed build
 * looks unfinished: "1 stardusts", "3 piece of sea glass". Copy should never
 * concatenate the noun by hand.
 */
export function useCurrency() {
  const { currency, currencyOne, currencyIcon } = useTerms();
  return useMemo(
    () => ({
      icon: currencyIcon,
      /** "3,500 stardust" */
      amount: (n: number) => `${n.toLocaleString()} ${n === 1 ? currencyOne : currency}`,
      /** "✨ 3,500" — for tight spaces like a header chip. */
      short: (n: number) => `${currencyIcon} ${n.toLocaleString()}`,
    }),
    [currency, currencyOne, currencyIcon],
  );
}
