/** UI strings + helpers for simple multi-language support. */

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
];

const STRINGS = {
  en: {
    feedTitle: 'Feed',
    feedSubtitle: 'Like posts to send them into the AI world',
    feedEmptyDeployedTitle: 'Feed is clear for now',
    feedEmptyDeployedBody:
      'The most liked posts were sent into the AI world. Go to the City to see the live action.',
    feedEmptyIdleTitle: 'No posts right now',
    feedEmptyIdleBody: 'When new events appear, like the ones you care about. Top liked posts go to the AI City.',
    goToCity: 'Go to the City',
    seeLiveCases: 'See live cases',
    loadingFeed: 'Loading feed…',
    squareEmpty: 'Top liked posts were sent to the AI world. Go to the City to watch.',
    realVsAiTitle: 'Real world vs AI world',
    realVsAiHint: 'Simple view of what happened in real life and what Polaris decided.',
    colTopic: 'Point',
    colRealWorld: 'Real world action so far',
    colAiWorld: 'AI world action',
    bottomLine: 'Bottom line',
    language: 'Language',
    awaitingVerdict: 'Still deciding…',
    noVerdictYet: 'No result yet. Agents are still talking.',
    keyPoints: 'Key points',
    confidence: 'How sure',
    resultsTitle: 'Case result',
    decisionSimple: {
      approved: 'Yes — go ahead',
      rejected: 'No — stop this',
      approved_with_conditions: 'Yes — but only with rules',
      delayed: 'Wait — look more first',
    },
  },
  hi: {
    feedTitle: 'फ़ीड',
    feedSubtitle: 'पोस्ट को लाइक करें ताकि वे एआई दुनिया में जाएँ',
    feedEmptyDeployedTitle: 'फ़ीड अभी खाली है',
    feedEmptyDeployedBody:
      'सबसे ज़्यादा लाइक वाली पोस्ट एआई दुनिया में भेज दी गईं। लाइव एक्शन देखने के लिए सिटी पर जाएँ।',
    feedEmptyIdleTitle: 'अभी कोई पोस्ट नहीं',
    feedEmptyIdleBody: 'जब नई घटनाएँ आएँ, जिन्हें आप चाहते हैं उन्हें लाइक करें। टॉप लाइक सिटी में जाती हैं।',
    goToCity: 'सिटी पर जाएँ',
    seeLiveCases: 'लाइव केस देखें',
    loadingFeed: 'फ़ीड लोड हो रही है…',
    squareEmpty: 'टॉप लाइक पोस्ट एआई दुनिया में चली गईं। देखने के लिए सिटी जाएँ।',
    realVsAiTitle: 'असली दुनिया बनाम एआई दुनिया',
    realVsAiHint: 'सरल नज़र: असल में क्या हुआ, और पोलारिस ने क्या तय किया।',
    colTopic: 'मुद्दा',
    colRealWorld: 'असल दुनिया में अब तक क्या हुआ',
    colAiWorld: 'एआई दुनिया का फ़ैसला',
    bottomLine: 'सीधी बात',
    language: 'भाषा',
    awaitingVerdict: 'अभी फ़ैसला हो रहा है…',
    noVerdictYet: 'अभी नतीजा नहीं। एजेंट बात कर रहे हैं।',
    keyPoints: 'मुख्य बातें',
    confidence: 'कितना यकीन',
    resultsTitle: 'केस का नतीजा',
    decisionSimple: {
      approved: 'हाँ — आगे बढ़ो',
      rejected: 'नहीं — रोक दो',
      approved_with_conditions: 'हाँ — लेकिन नियमों के साथ',
      delayed: 'रुको — पहले और देखो',
    },
  },
  es: {
    feedTitle: 'Feed',
    feedSubtitle: 'Dale like a los posts para enviarlos al mundo IA',
    feedEmptyDeployedTitle: 'El feed está vacío por ahora',
    feedEmptyDeployedBody:
      'Los posts con más likes fueron enviados al mundo IA. Ve a la Ciudad para ver la acción en vivo.',
    feedEmptyIdleTitle: 'No hay posts ahora',
    feedEmptyIdleBody: 'Cuando haya eventos nuevos, dale like a los que te importen. Los más votados van a la Ciudad.',
    goToCity: 'Ir a la Ciudad',
    seeLiveCases: 'Ver casos en vivo',
    loadingFeed: 'Cargando feed…',
    squareEmpty: 'Los posts top fueron al mundo IA. Ve a la Ciudad para mirar.',
    realVsAiTitle: 'Mundo real vs mundo IA',
    realVsAiHint: 'Vista simple: qué pasó en la vida real y qué decidió Polaris.',
    colTopic: 'Punto',
    colRealWorld: 'Acción en el mundo real hasta ahora',
    colAiWorld: 'Acción del mundo IA',
    bottomLine: 'En pocas palabras',
    language: 'Idioma',
    awaitingVerdict: 'Todavía decidiendo…',
    noVerdictYet: 'Aún no hay resultado. Los agentes siguen hablando.',
    keyPoints: 'Puntos clave',
    confidence: 'Qué tan seguro',
    resultsTitle: 'Resultado del caso',
    decisionSimple: {
      approved: 'Sí — adelante',
      rejected: 'No — detener esto',
      approved_with_conditions: 'Sí — pero con reglas',
      delayed: 'Esperar — mirar más primero',
    },
  },
};

export function getStrings(lang) {
  return STRINGS[lang] || STRINGS.en;
}

/** Pick comparison block for current language (falls back to English). */
export function resolveComparison(plainComparison, lang) {
  if (!plainComparison) return null;
  if (lang && lang !== 'en' && plainComparison.translations?.[lang]) {
    const t = plainComparison.translations[lang];
    return {
      bottomLine: t.bottomLine || plainComparison.bottomLine || '',
      rows: Array.isArray(t.rows) && t.rows.length ? t.rows : plainComparison.rows || [],
    };
  }
  return {
    bottomLine: plainComparison.bottomLine || '',
    rows: plainComparison.rows || [],
  };
}

const SIMPLE_DECISIONS = {
  approved: 'Yes — go ahead',
  rejected: 'No — stop this',
  approved_with_conditions: 'Yes — but only with rules',
  delayed: 'Wait — look more first',
};

/** Fallback table when Judge did not return plainComparison (older cases). */
export function buildFallbackComparison(caseDoc, verdict) {
  const decision = verdict?.decision || 'delayed';
  const real = (caseDoc?.description || caseDoc?.source || 'The real world started this issue.').slice(0, 180);
  return {
    bottomLine: verdict?.statement
      ? String(verdict.statement).slice(0, 160)
      : SIMPLE_DECISIONS[decision] || SIMPLE_DECISIONS.delayed,
    rows: [
      {
        topic: 'Main action',
        realWorld: real,
        aiWorld: SIMPLE_DECISIONS[decision] || SIMPLE_DECISIONS.delayed,
      },
      {
        topic: 'Why it matters',
        realWorld: caseDoc?.source
          ? `People are following news from: ${caseDoc.source}`
          : 'People are watching what happens next.',
        aiWorld: verdict?.justification
          ? String(verdict.justification).slice(0, 160)
          : 'AI experts talked and picked the safest fair path.',
      },
      {
        topic: 'What happens next',
        realWorld: 'Real-world leaders and groups may keep acting.',
        aiWorld: 'Polaris recorded this advice for the public archive.',
      },
    ],
  };
}
