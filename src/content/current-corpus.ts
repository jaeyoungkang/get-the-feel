import be from "../../assets/content/be.json";
import come from "../../assets/content/come.json";
import get from "../../assets/content/get.json";
import go from "../../assets/content/go.json";
import have from "../../assets/content/have.json";
import keep from "../../assets/content/keep.json";
import make from "../../assets/content/make.json";
import out from "../../assets/content/out.json";
import phrasalUp from "../../assets/content/phrasal-up.json";
import take from "../../assets/content/take.json";
import up from "../../assets/content/up.json";

import type { ContentFile } from "./content-types";

export const CURRENT_CONTENT = {
  be: be as ContentFile,
  come: come as ContentFile,
  get: get as ContentFile,
  go: go as ContentFile,
  have: have as ContentFile,
  keep: keep as ContentFile,
  make: make as ContentFile,
  out: out as ContentFile,
  "phrasal-up": phrasalUp as ContentFile,
  take: take as ContentFile,
  up: up as ContentFile,
} satisfies Record<string, ContentFile>;

export type CurrentContentKey = keyof typeof CURRENT_CONTENT;
