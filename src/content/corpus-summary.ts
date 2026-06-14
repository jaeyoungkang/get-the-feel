import { CURRENT_CONTENT } from "./current-corpus";

const files = Object.values(CURRENT_CONTENT);

export const currentCorpusSummary = {
  files: files.length,
  senses: files.reduce((total, file) => total + file.senses.length, 0),
  trainingItems: files.reduce((total, file) => total + file.training_items.length, 0),
  transferItems: files.reduce((total, file) => total + file.transfer_items.length, 0),
  items: files.reduce(
    (total, file) => total + file.training_items.length + file.transfer_items.length,
    0,
  ),
  validation: files
    .flatMap((file) => file.senses)
    .reduce(
      (summary, sense) => {
        const strength = sense.validation.strength;
        summary[strength] += 1;
        return summary;
      },
      { strong: 0, weak: 0 },
    ),
};
