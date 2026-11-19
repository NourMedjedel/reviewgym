import { repairLocales } from './repair-locales.js?v=0.3.4';
import { uiCopy } from './ui-copy.js?v=0.3.4';

export const locales = Object.fromEntries(['en', 'fr', 'de'].map((language, i) => [language,
  { ...repairLocales[language], ...Object.fromEntries(Object.entries(uiCopy).map(([key, values]) => [key, values[i]])) },
]));

export function translate(language, key, values = {}) {
  const template = locales[language]?.[key];
  if (template === undefined) throw new Error(`Unknown translation: ${language}/${key}`);
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}
