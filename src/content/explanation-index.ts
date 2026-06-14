import { CURRENT_CONTENT } from "./current-corpus";
import type { ContentAxis, TrainingItem, ValidationStrength } from "./content-types";

// @promise promise:sentence-explanation-to-practice
// @aspect aspect:content-provenance
// @check acceptance-check:sentence-explanation-supported-scope
export type ExplanationPracticeItem = Pick<
  TrainingItem,
  | "id"
  | "sense_id"
  | "sentence"
  | "sentence_ko"
  | "subject_label"
  | "object_label"
  | "prompt"
  | "choices"
  | "answer_index"
  | "why_ko"
  | "type"
> & {
  source: "training" | "transfer";
};

export type ExplanationSense = {
  id: string;
  itemKey: string;
  item: string;
  axis: ContentAxis;
  ko: string;
  image: string;
  boundary_ko?: string;
  validationStrength: ValidationStrength;
  practiceItems: ExplanationPracticeItem[];
};

export type ExplanationMatch = {
  id: string;
  itemKey: string;
  item: string;
  axis: ContentAxis;
  matchedText: string;
  confidence: "exact-corpus-sentence" | "target-word-detected";
  senses: ExplanationSense[];
};

type Matcher = {
  itemKey: keyof typeof CURRENT_CONTENT;
  pattern: RegExp;
  axis: ContentAxis;
};

const MATCHERS: Matcher[] = [
  { itemKey: "phrasal-up", pattern: /\b[a-z]+(?:ed|ing|s)?\s+up\b/i, axis: "phrasal-verbs" },
  { itemKey: "have", pattern: /\b(?:have|has|had|having)\b/i, axis: "core-verbs" },
  { itemKey: "get", pattern: /\b(?:get|gets|got|gotten|getting)\b/i, axis: "core-verbs" },
  { itemKey: "take", pattern: /\b(?:take|takes|took|taken|taking)\b/i, axis: "core-verbs" },
  { itemKey: "make", pattern: /\b(?:make|makes|made|making)\b/i, axis: "core-verbs" },
  { itemKey: "keep", pattern: /\b(?:keep|keeps|kept|keeping)\b/i, axis: "core-verbs" },
  { itemKey: "be", pattern: /\b(?:am|is|are|was|were|be|been|being)\b/i, axis: "core-verbs" },
  { itemKey: "go", pattern: /\b(?:go|goes|went|gone|going)\b/i, axis: "core-verbs" },
  { itemKey: "come", pattern: /\b(?:come|comes|came|coming)\b/i, axis: "core-verbs" },
  { itemKey: "up", pattern: /\bup\b/i, axis: "particles" },
  { itemKey: "out", pattern: /\bout\b/i, axis: "particles" },
];

function normalizeSentence(sentence: string) {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function practiceForSense(itemKey: keyof typeof CURRENT_CONTENT, senseId: string) {
  const content = CURRENT_CONTENT[itemKey];
  const training = content.training_items
    .filter((item) => item.sense_id === senseId)
    .slice(0, 3)
    .map((item) => ({ ...item, source: "training" as const }));
  const transfer = content.transfer_items
    .filter((item) => item.sense_id === senseId)
    .slice(0, 2)
    .map((item) => ({ ...item, source: "transfer" as const }));

  return [...training, ...transfer].map(
    ({
      id,
      sense_id,
      sentence,
      sentence_ko,
      subject_label,
      object_label,
      prompt,
      choices,
      answer_index,
      why_ko,
      type,
      source,
    }) => ({
      id,
      sense_id,
      sentence,
      sentence_ko,
      subject_label,
      object_label,
      prompt,
      choices,
      answer_index,
      why_ko,
      type,
      source,
    }),
  );
}

function sensesForItem(itemKey: keyof typeof CURRENT_CONTENT): ExplanationSense[] {
  const content = CURRENT_CONTENT[itemKey];
  return content.senses.map((sense) => ({
    id: sense.id,
    itemKey,
    item: content.item,
    axis: content.axis,
    ko: sense.ko,
    image: sense.image,
    boundary_ko: sense.boundary_ko,
    validationStrength: sense.validation.strength,
    practiceItems: practiceForSense(itemKey, sense.id),
  }));
}

function rankSensesForInput(
  input: string,
  itemKey: keyof typeof CURRENT_CONTENT,
  senses: ExplanationSense[],
) {
  const normalized = normalizeSentence(input);
  const priority = new Map<string, number>();

  if (itemKey === "phrasal-up") {
    if (/\b(?:clean|drink|eat|finish|use|pack|wrap|heat|save)\w*\s+up\b/.test(normalized)) {
      priority.set("compose-completion", 0);
    }
    if (/\b(?:get|stand|sit|look|pick|lift|wake)\w*\s+up\b/.test(normalized)) {
      priority.set("compose-vertical", 0);
    }
  }

  if (itemKey === "get") {
    if (/\b(?:get|gets|got|getting)\s+(?:tired|cold|old|better|worse|ready|angry|dark)\b/.test(normalized)) {
      priority.set("get-state-change", 0);
    }
    if (/\b(?:get|gets|got|getting)\s+(?:dressed|married|started|lost|paid|hurt|stuck)\b/.test(normalized)) {
      priority.set("get-into-state", 0);
    }
  }

  if (priority.size === 0) return senses;
  return [...senses].sort(
    (left, right) => (priority.get(left.id) ?? 1) - (priority.get(right.id) ?? 1),
  );
}

function exactCorpusMatches(input: string): ExplanationMatch[] {
  const normalizedInput = normalizeSentence(input);
  if (!normalizedInput) return [];

  const matches: ExplanationMatch[] = [];
  for (const [itemKey, content] of Object.entries(CURRENT_CONTENT)) {
    const corpusItems = [...content.training_items, ...content.transfer_items];
    const exactItem = corpusItems.find(
      (item) => normalizeSentence(item.sentence) === normalizedInput,
    );
    if (!exactItem) continue;

    const sense = sensesForItem(itemKey as keyof typeof CURRENT_CONTENT).find(
      (candidate) => candidate.id === exactItem.sense_id,
    );
    if (!sense) continue;

    matches.push({
      id: `${itemKey}:${exactItem.sense_id}`,
      itemKey,
      item: content.item,
      axis: content.axis,
      matchedText: exactItem.sentence,
      confidence: "exact-corpus-sentence",
      senses: [sense],
    });
  }

  return matches;
}

function detectedTargetMatches(input: string): ExplanationMatch[] {
  const seen = new Set<string>();

  return MATCHERS.flatMap((matcher) => {
    const match = input.match(matcher.pattern);
    if (!match || seen.has(matcher.itemKey)) return [];
    seen.add(matcher.itemKey);

    const content = CURRENT_CONTENT[matcher.itemKey];
    const senses = rankSensesForInput(input, matcher.itemKey, sensesForItem(matcher.itemKey));
    return [
      {
        id: `${matcher.itemKey}:detected`,
        itemKey: matcher.itemKey,
        item: content.item,
        axis: matcher.axis,
        matchedText: match[0],
        confidence: "target-word-detected" as const,
        senses,
      },
    ];
  });
}

export function explainSentence(input: string): ExplanationMatch[] {
  const exact = exactCorpusMatches(input);
  if (exact.length > 0) return exact;
  return detectedTargetMatches(input);
}

export const explanationSeedMatches = explainSentence(
  "I got a text from my sister this morning.",
);
