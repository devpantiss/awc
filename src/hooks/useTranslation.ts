// ============================================================
// SMART ANGANWADI - USE TRANSLATION HOOK
// Simple utility to fetch translated strings from the dictionary
// ============================================================

import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../data/translations';

export function useTranslation() {
  const { language } = useAppStore();

  const t = useCallback((key: string, variables?: Record<string, string | number>): string => {
    const dict = language === 'od' ? translations.od : translations.en;
    
    let text = dict[key] || translations.en[key] || key;

    // Replace variables if provided
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  }, [language]);

  return { t, language };
}
