import { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  buildFallbackComparison,
  resolveComparison,
} from '../../lib/i18n';

/**
 * Side-by-side table: real-world action so far vs AI world decision.
 * Uses Judge plainComparison (simple words) + language translations when present.
 */
export default function RealVsAiTable({ caseDoc, verdict, showLanguage = true }) {
  const { lang, t } = useLanguage();

  const comparison = useMemo(() => {
    if (!verdict) return null;
    const fromJudge = resolveComparison(verdict.plainComparison, lang);
    if (fromJudge?.rows?.length) return fromJudge;
    return buildFallbackComparison(caseDoc, verdict);
  }, [caseDoc, verdict, lang]);

  if (!verdict || !comparison) {
    return (
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm text-text-muted">{t.noVerdictYet}</p>
      </div>
    );
  }

  const simpleDecision =
    t.decisionSimple?.[verdict.decision] || verdict.decision;

  return (
    <section className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-white/[0.08] flex flex-wrap items-center gap-3 justify-between bg-white/[0.02]">
        <div className="min-w-0">
          <h2 className="font-heading font-semibold text-sm sm:text-base">{t.realVsAiTitle}</h2>
          <p className="text-xs text-text-muted mt-0.5">{t.realVsAiHint}</p>
        </div>
        {showLanguage && <LanguageSwitcher compact />}
      </div>

      <div className="px-4 sm:px-5 py-3 flex flex-wrap gap-2 items-center border-b border-white/[0.06]">
        <span className="text-xs font-mono text-text-muted">{t.resultsTitle}:</span>
        <span className="text-sm font-medium text-primary">{simpleDecision}</span>
        {verdict.confidence != null && (
          <span className="text-xs text-text-muted ml-auto">
            {t.confidence}: {verdict.confidence}%
          </span>
        )}
      </div>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden divide-y divide-white/[0.06]">
        {(comparison.rows || []).map((row, i) => (
          <div key={i} className="p-4 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-text-muted">{row.topic}</p>
            <div>
              <p className="text-[10px] font-semibold text-warning/90 mb-1">{t.colRealWorld}</p>
              <p className="text-sm leading-relaxed text-text-primary">{row.realWorld}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-primary/90 mb-1">{t.colAiWorld}</p>
              <p className="text-sm leading-relaxed text-text-primary">{row.aiWorld}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <th className="px-5 py-3 font-medium w-[18%]">{t.colTopic}</th>
              <th className="px-5 py-3 font-medium w-[41%] text-warning/80">{t.colRealWorld}</th>
              <th className="px-5 py-3 font-medium w-[41%] text-primary/80">{t.colAiWorld}</th>
            </tr>
          </thead>
          <tbody>
            {(comparison.rows || []).map((row, i) => (
              <tr key={i} className="border-b border-white/[0.05] align-top">
                <td className="px-5 py-3.5 font-medium text-text-secondary whitespace-nowrap">{row.topic}</td>
                <td className="px-5 py-3.5 leading-relaxed">{row.realWorld}</td>
                <td className="px-5 py-3.5 leading-relaxed">{row.aiWorld}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {comparison.bottomLine && (
        <div className="px-4 sm:px-5 py-4 bg-primary/5 border-t border-primary/20">
          <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-1">{t.bottomLine}</p>
          <p className="text-sm sm:text-base leading-relaxed font-medium">{comparison.bottomLine}</p>
        </div>
      )}
    </section>
  );
}
