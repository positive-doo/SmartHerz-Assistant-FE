import {
  getExperienceFilterById,
  getExperienceFilterDescendantIds,
  getExperienceFilterIdForQuizPersona,
  getExperienceFilterLabel,
  isQuizPersonaCode,
  quizPersonaCodes,
  type ExperienceFilterId,
  type QuizPersonaCode,
} from "@/data/experienceFilters";

type QuizRoute = {
  title: string;
  slug: string;
};

type QuizPersonaDetails = {
  name: string;
  route: {
    primary: QuizRoute;
    secondary: QuizRoute;
  };
};

export type QuizScores = Record<QuizPersonaCode, number>;

export type QuizContext = {
  persona: QuizPersonaCode;
  scores: QuizScores;
  hasScores: boolean;
  rankedPersonaCodes: QuizPersonaCode[];
  activeFilterPersonaCodes: QuizPersonaCode[];
};

const quizPersonaDetails: Record<QuizPersonaCode, QuizPersonaDetails> = {
  H: {
    name: "Istraživač istorije",
    route: {
      primary: {
        title: "Putevima starih civilizacija",
        slug: "putevima-starih-civilizacija",
      },
      secondary: {
        title: "Put hercegovačkog vina",
        slug: "put-hercegovackog-vina",
      },
    },
  },
  T: {
    name: "Planinar / Trekker",
    route: {
      primary: {
        title: "Planinska Hercegovina",
        slug: "planinska-hercegovina",
      },
      secondary: {
        title: "Hercegovina u pokretu",
        slug: "hercegovina-u-pokretu",
      },
    },
  },
  A: {
    name: "Avanturista",
    route: {
      primary: {
        title: "Hercegovina u pokretu",
        slug: "hercegovina-u-pokretu",
      },
      secondary: {
        title: "Planinska Hercegovina",
        slug: "planinska-hercegovina",
      },
    },
  },
  G: {
    name: "Gastro turist",
    route: {
      primary: {
        title: "Put hercegovačkog vina",
        slug: "put-hercegovackog-vina",
      },
      secondary: {
        title: "Hercegovina za sve generacije",
        slug: "hercegovina-za-sve-generacije",
      },
    },
  },
  F: {
    name: "Porodičan odmor",
    route: {
      primary: {
        title: "Hercegovina za sve generacije",
        slug: "hercegovina-za-sve-generacije",
      },
      secondary: {
        title: "Putevima starih civilizacija",
        slug: "putevima-starih-civilizacija",
      },
    },
  },
};

const emptyScores = (): QuizScores =>
  Object.fromEntries(quizPersonaCodes.map((code) => [code, 0])) as QuizScores;

const parseScore = (value: string | null) => {
  if (value === null || value.trim() === "") {
    return null;
  }

  const score = Number(value);

  return Number.isFinite(score) && score >= 0 ? Math.round(score) : null;
};

const getRankedPersonaCodes = (
  scores: QuizScores,
  preferredPersona: QuizPersonaCode
) =>
  quizPersonaCodes
    .filter((code) => scores[code] > 0 || code === preferredPersona)
    .sort((firstCode, secondCode) => {
      const scoreDelta = scores[secondCode] - scores[firstCode];

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      if (firstCode === preferredPersona) {
        return -1;
      }

      if (secondCode === preferredPersona) {
        return 1;
      }

      return (
        quizPersonaCodes.indexOf(firstCode) - quizPersonaCodes.indexOf(secondCode)
      );
    });

const resolvePersonaFromScores = (scores: QuizScores): QuizPersonaCode =>
  quizPersonaCodes.reduce((winner, code) =>
    scores[winner] >= scores[code] ? winner : code
  );

export const getQuizContextFromSearchParams = (
  searchParams: URLSearchParams
): QuizContext | null => {
  const normalizedPersona = searchParams.get("persona")?.trim().toUpperCase();
  const scores = emptyScores();
  let hasScores = false;

  quizPersonaCodes.forEach((code) => {
    const score =
      parseScore(searchParams.get(`score_${code}`)) ??
      parseScore(searchParams.get(`score_${code.toLowerCase()}`));

    if (score !== null) {
      scores[code] = score;
      hasScores = true;
    }
  });

  if (!isQuizPersonaCode(normalizedPersona) && !hasScores) {
    return null;
  }

  const hasPositiveScore = quizPersonaCodes.some((code) => scores[code] > 0);

  if (!isQuizPersonaCode(normalizedPersona) && !hasPositiveScore) {
    return null;
  }

  const persona = isQuizPersonaCode(normalizedPersona)
    ? normalizedPersona
    : resolvePersonaFromScores(scores);
  const rankedPersonaCodes = getRankedPersonaCodes(scores, persona);
  const maxScore = hasScores
    ? Math.max(...quizPersonaCodes.map((code) => scores[code]))
    : 0;
  const activeFilterPersonaCodes =
    hasScores && maxScore > 0
      ? quizPersonaCodes.filter((code) => scores[code] === maxScore)
      : [persona];

  return {
    persona,
    scores,
    hasScores,
    rankedPersonaCodes,
    activeFilterPersonaCodes: activeFilterPersonaCodes.includes(persona)
      ? activeFilterPersonaCodes
      : [persona, ...activeFilterPersonaCodes],
  };
};

export const getExperienceFilterIdsForQuizContext = (
  quizContext: QuizContext
): ExperienceFilterId[] =>
  Array.from(
    new Set(
      quizContext.activeFilterPersonaCodes
        .map(getExperienceFilterIdForQuizPersona)
        .filter((id): id is ExperienceFilterId => Boolean(id))
        .flatMap((id) => {
          const filter = getExperienceFilterById(id);

          return filter ? [id, ...getExperienceFilterDescendantIds(filter)] : [id];
        })
    )
  );

const formatRoute = (route: QuizRoute) =>
  `${route.title} (/rute/${route.slug})`;

const formatPersonaRoutes = (code: QuizPersonaCode) => {
  const details = quizPersonaDetails[code];

  return `${details.name} (${code}) -> primarna: ${formatRoute(
    details.route.primary
  )}; alternativna: ${formatRoute(details.route.secondary)}`;
};

export const buildQuizContextMessage = (quizContext: QuizContext) => {
  const scoreSummary = quizPersonaCodes
    .map((code) => `${code}=${quizContext.scores[code]}`)
    .join(", ");
  const rankedSummary = quizContext.rankedPersonaCodes
    .map(
      (code) =>
        `${quizPersonaDetails[code].name} (${code}, ${quizContext.scores[code]})`
    )
    .join(" > ");
  const activeInterests = getExperienceFilterIdsForQuizContext(quizContext)
    .map((id) => getExperienceFilterLabel(id, "bh"))
    .join(", ");
  const secondaryRoutePersonas = quizContext.rankedPersonaCodes.filter(
    (code) => code !== quizContext.persona && quizContext.scores[code] > 0
  );
  const secondaryRoutes = secondaryRoutePersonas
    .map(formatPersonaRoutes)
    .join("\n");
  const messageParts = [
    "Kontekst kviza putnika:",
    `Pobjednička persona: ${
      quizPersonaDetails[quizContext.persona].name
    } (${quizContext.persona}). Persona parametar je rezultat tie-break logike iz kviza kada su bodovi izjednačeni.`,
  ];

  if (quizContext.hasScores) {
    messageParts.push(`Bodovi po personama: ${scoreSummary}.`);
    messageParts.push(`Rang preferencija prema skoru: ${rankedSummary}.`);
  }

  if (activeInterests) {
    messageParts.push(`Aktivna interesovanja iz kviza: ${activeInterests}.`);
  }

  messageParts.push(
    `Ruta pobjedničke persone: ${formatPersonaRoutes(quizContext.persona)}.`
  );

  if (secondaryRoutes) {
    messageParts.push(
      `Sekundarne rute prema dodatnim bodovima:\n${secondaryRoutes}`
    );
  }

  messageParts.push(
    "Pri odgovoru kombinuj pobjedničku personu i sekundarne preferencije proporcionalno bodovima. Predlaži smještaj, mjesta za odmor, obroke i kratke stanke duž rute, ne samo samu rutu."
  );

  return messageParts.join("\n");
};
