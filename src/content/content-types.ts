export type ContentAxis = "core-verbs" | "particles" | "phrasal-verbs" | "word-order";

export type ValidationStrength = "strong" | "weak";

export type ContentSense = {
  id: string;
  ko: string;
  image: string;
  boundary_ko?: string;
  source_refs: Array<{
    source_id: string;
    locator: string;
    claim: string;
  }>;
  validation: {
    method: string;
    strength: ValidationStrength;
    date: string;
    basis?: string;
  };
};

export type TrainingItem = {
  id: string;
  sense_id: string;
  sentence: string;
  sentence_ko: string;
  subject_label: string;
  object_label: string;
  prompt: string;
  choices: string[];
  answer_index: number;
  why_ko: string;
  type?: "sense-choice" | "verb-choice" | "sense-cloze" | "compose-choice";
  verb_label?: string;
};

export type ContentFile = {
  axis: ContentAxis;
  item: string;
  senses: ContentSense[];
  training_items: TrainingItem[];
  transfer_items: TrainingItem[];
};
