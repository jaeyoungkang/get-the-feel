"use client";

import { useMemo, useState } from "react";

import { TRAINER_QUESTIONS, TRAINER_SENSES, type TrainerQuestion } from "@/src/content/training-index";

type Mode = "recognition" | "production";
type RecognitionRecord = { total: number; correct: number };
type ProductionRecord = { total: number };

const INITIAL_RECOGNITION: RecognitionRecord = { total: 0, correct: 0 };
const INITIAL_PRODUCTION: ProductionRecord = { total: 0 };

function axisLabel(axis: TrainerQuestion["axis"]) {
  if (axis === "core-verbs") return "core verb";
  if (axis === "particles") return "particle";
  if (axis === "phrasal-verbs") return "phrasal verb";
  return "word order";
}

function normalizeType(type: TrainerQuestion["type"]) {
  if (type === "verb-choice") return "verb";
  if (type === "sense-cloze") return "cloze";
  if (type === "compose-choice") return "compose";
  return "sense";
}

function questionPool(focusSenseId: string) {
  if (focusSenseId === "all") return TRAINER_QUESTIONS;
  return TRAINER_QUESTIONS.filter((question) => question.sense.id === focusSenseId);
}

export function Trainer() {
  const [mode, setMode] = useState<Mode>("recognition");
  const [focusSenseId, setFocusSenseId] = useState("all");
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [recognition, setRecognition] = useState<RecognitionRecord>(INITIAL_RECOGNITION);
  const [production, setProduction] = useState<ProductionRecord>(INITIAL_PRODUCTION);
  const [draft, setDraft] = useState("");
  const [checkedDraft, setCheckedDraft] = useState(false);

  const pool = useMemo(() => questionPool(focusSenseId), [focusSenseId]);
  const question = pool[cursor % pool.length] ?? TRAINER_QUESTIONS[0];
  const focusSense = TRAINER_SENSES.find((sense) => sense.id === focusSenseId);
  const isAnswered = selected !== null;
  const isCorrect = selected === question.answer_index;

  function choose(index: number) {
    if (isAnswered) return;
    setSelected(index);
    setRecognition((current) => ({
      total: current.total + 1,
      correct: current.correct + (index === question.answer_index ? 1 : 0),
    }));
  }

  function nextQuestion() {
    setSelected(null);
    setCheckedDraft(false);
    setDraft("");
    setCursor((current) => (current + 1) % pool.length);
  }

  function changeFocus(nextSenseId: string) {
    setFocusSenseId(nextSenseId);
    setCursor(0);
    setSelected(null);
    setCheckedDraft(false);
    setDraft("");
  }

  function checkProduction() {
    if (!draft.trim()) return;
    setCheckedDraft(true);
    setProduction((current) => ({ total: current.total + 1 }));
  }

  const accuracy =
    recognition.total === 0 ? "0%" : `${Math.round((recognition.correct / recognition.total) * 100)}%`;

  return (
    <section className="native-trainer" aria-label="Native sense trainer">
      <aside className="trainer-control-panel">
        <div>
          <p className="eyebrow">Mode</p>
          <div className="segmented-control" aria-label="Training mode">
            <button
              type="button"
              className={mode === "recognition" ? "is-active" : ""}
              onClick={() => setMode("recognition")}
            >
              Recognition
            </button>
            <button
              type="button"
              className={mode === "production" ? "is-active" : ""}
              onClick={() => setMode("production")}
            >
              Production
            </button>
          </div>
        </div>

        <label className="focus-picker">
          <span>Focus sense</span>
          <select value={focusSenseId} onChange={(event) => changeFocus(event.target.value)}>
            <option value="all">All senses</option>
            {TRAINER_SENSES.map((sense) => (
              <option key={`${sense.itemKey}:${sense.id}`} value={sense.id}>
                {sense.item} · {sense.id}
              </option>
            ))}
          </select>
        </label>

        <div className="stat-grid" aria-label="Training statistics">
          <div>
            <span>Recognition</span>
            <strong>{accuracy}</strong>
          </div>
          <div>
            <span>Answered</span>
            <strong>{recognition.total}</strong>
          </div>
          <div>
            <span>Production</span>
            <strong>{production.total}</strong>
          </div>
          <div>
            <span>Pool</span>
            <strong>{pool.length}</strong>
          </div>
        </div>
      </aside>

      <div className="trainer-main-panel">
        <div className="question-meta">
          <span>{axisLabel(question.axis)}</span>
          <span>{mode === "recognition" && !isAnswered ? "item hidden" : question.item}</span>
          <span>{normalizeType(question.type)}</span>
          <span>{question.source}</span>
        </div>

        {mode === "recognition" ? (
          <article className="question-card">
            <p className="prompt">{question.prompt}</p>
            <h2>{question.sentence}</h2>
            <div className="choice-list">
              {question.choices.map((choice, index) => (
                <button
                  key={`${question.id}:${choice}`}
                  type="button"
                  className={
                    isAnswered && index === question.answer_index
                      ? "is-correct"
                      : isAnswered && index === selected
                        ? "is-wrong"
                        : ""
                  }
                  onClick={() => choose(index)}
                >
                  {choice}
                </button>
              ))}
            </div>
            {isAnswered ? (
              <div className={isCorrect ? "feedback is-correct" : "feedback is-wrong"}>
                <strong>{isCorrect ? "맞음" : "다시 보기"}</strong>
                <p>{question.sentence_ko}</p>
                <p>{question.why_ko}</p>
              </div>
            ) : null}
          </article>
        ) : (
          <article className="question-card">
            <p className="prompt">Use this sense in your own English sentence.</p>
            <h2>{focusSense?.id ?? question.sense.id}</h2>
            <textarea
              className="production-box"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setCheckedDraft(false);
              }}
              rows={5}
            />
            <button className="primary-action" type="button" onClick={checkProduction}>
              Check against model
            </button>
            {checkedDraft ? (
              <div className="feedback">
                <strong>Self-check only</strong>
                <p>Model: {question.sentence}</p>
                <p>{question.sense.ko}</p>
              </div>
            ) : null}
          </article>
        )}

        {mode === "production" || isAnswered ? (
          <article className="sense-card">
            <div className="sense-card-header">
              <p className="eyebrow">Sense</p>
              <h2>{question.sense.id}</h2>
            </div>
            <div className="explanation-block">
              <h3>감각</h3>
              <p>{question.sense.ko}</p>
            </div>
            <div className="explanation-block">
              <h3>그림</h3>
              <p>{question.sense.image}</p>
            </div>
            {question.sense.boundary_ko ? (
              <div className="explanation-block">
                <h3>경계</h3>
                <p>{question.sense.boundary_ko}</p>
              </div>
            ) : null}
          </article>
        ) : null}

        <div className="trainer-actions">
          <button type="button" onClick={nextQuestion}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
