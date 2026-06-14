import { CURRENT_CONTENT } from "./current-corpus";
import type { ContentAxis, TrainingItem, ValidationStrength } from "./content-types";

export type TrainerSense = {
  id: string;
  itemKey: string;
  item: string;
  axis: ContentAxis;
  ko: string;
  image: string;
  boundary_ko?: string;
  validationStrength: ValidationStrength;
};

export type TrainerQuestion = TrainingItem & {
  itemKey: string;
  item: string;
  axis: ContentAxis;
  source: "training" | "transfer";
  sense: TrainerSense;
};

export const TRAINER_SENSES: TrainerSense[] = Object.entries(CURRENT_CONTENT).flatMap(
  ([itemKey, content]) =>
    content.senses.map((sense) => ({
      id: sense.id,
      itemKey,
      item: content.item,
      axis: content.axis,
      ko: sense.ko,
      image: sense.image,
      boundary_ko: sense.boundary_ko,
      validationStrength: sense.validation.strength,
    })),
);

const senseById = new Map(TRAINER_SENSES.map((sense) => [`${sense.itemKey}:${sense.id}`, sense]));

export const TRAINER_QUESTIONS: TrainerQuestion[] = Object.entries(CURRENT_CONTENT).flatMap(
  ([itemKey, content]) => {
    function attach(items: TrainingItem[], source: "training" | "transfer") {
      return items.map((item) => {
        const sense = senseById.get(`${itemKey}:${item.sense_id}`);
        if (!sense) {
          throw new Error(`Missing sense ${itemKey}:${item.sense_id}`);
        }
        return {
          ...item,
          itemKey,
          item: content.item,
          axis: content.axis,
          source,
          sense,
        };
      });
    }

    return [...attach(content.training_items, "training"), ...attach(content.transfer_items, "transfer")];
  },
);
