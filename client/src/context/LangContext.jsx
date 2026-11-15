import { useCallback, useEffect, useMemo, useState } from 'react';
import translations from '../i18n/translations';
import LangContext from './langContext.js';

const LOCALES = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN' };

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('km_lang');
    return translations[saved] ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('km_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, vars) => {
      let text = translations[lang][key] ?? translations.en[key] ?? key;
      if (vars) {
        Object.keys(vars).forEach((k) => {
          text = text.replace('{' + k + '}', vars[k]);
        });
      }
      return text;
    },
    [lang]
  );

  const errMsg = useCallback(
    (err) => {
      const data = err && err.response && err.response.data;
      if (!data) return t('err.NETWORK');
      const codeKey = 'err.' + data.code;
      const base = translations[lang][codeKey] ? t(codeKey) : data.message || t('err.SERVER');
      if (data.code === 'VALIDATION' && data.field) {
        const fieldKey = 'field.' + data.field;
        return base + ': ' + (translations[lang][fieldKey] ? t(fieldKey) : data.field);
      }
      return base;
    },
    [lang, t]
  );

  const money = useCallback((n) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n || 0), []);

  const date = useCallback(
    (d) => (d ? new Date(d).toLocaleDateString(LOCALES[lang], { day: 'numeric', month: 'short', year: 'numeric' }) : ''),
    [lang]
  );

  const pick = useCallback((obj) => (obj ? obj[lang] || obj.en || '' : ''), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, errMsg, money, date, pick }), [lang, t, errMsg, money, date, pick]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
