import { translations } from './translations';

export function t(key: string, language: string = 'en', variables?: Record<string, string | number>): string {
  const dict = language === 'od' ? translations.od : translations.en;
  let text = dict[key] || translations.en[key] || key;

  if (variables) {
    Object.entries(variables).forEach(([name, value]) => {
      text = text.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value));
    });
  }

  return text;
}
