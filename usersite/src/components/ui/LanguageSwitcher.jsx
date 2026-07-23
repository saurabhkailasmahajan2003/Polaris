import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher({ className = '', compact = false }) {
  const { lang, setLang, t, languages } = useLanguage();

  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      {!compact && (
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted whitespace-nowrap">
          {t.language}
        </span>
      )}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label={t.language}
        className="bg-white/5 border border-white/15 rounded-lg px-2 py-1.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary/50 max-w-[9.5rem]"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="bg-night text-text-primary">
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
