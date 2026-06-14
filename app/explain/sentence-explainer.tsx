"use client";

import { useMemo, useState } from "react";

import { explainSentence, type ExplanationMatch } from "@/src/content/explanation-index";

// @promise promise:sentence-explanation-to-practice
// @check acceptance-check:sentence-explanation-practice-link
type SentenceExplainerProps = {
  seedMatches: ExplanationMatch[];
};

type AnswerState = Record<string, number>;

const SAMPLE_SENTENCES = [
  "I got a text from my sister this morning.",
  "The kids got tired after the long hike.",
  "Please clean up your desk before dinner.",
  "She kept the door open.",
];

function axisLabel(axis: ExplanationMatch["axis"]) {
  if (axis === "core-verbs") return "core verb";
  if (axis === "particles") return "particle";
  if (axis === "phrasal-verbs") return "phrasal verb";
  return "word order";
}

export function SentenceExplainer({ seedMatches }: SentenceExplainerProps) {
  const [sentence, setSentence] = useState(SAMPLE_SENTENCES[0]);
  const [selectedMatchId, setSelectedMatchId] = useState(seedMatches[0]?.id ?? "");
  const [selectedSenseId, setSelectedSenseId] = useState(
    seedMatches[0]?.senses[0]?.id ?? "",
  );
  const [answers, setAnswers] = useState<AnswerState>({});

  const matches = useMemo(() => explainSentence(sentence), [sentence]);
  const activeMatch = matches.find((match) => match.id === selectedMatchId) ?? matches[0];
  const activeSense =
    activeMatch?.senses.find((sense) => sense.id === selectedSenseId) ??
    activeMatch?.senses[0];

  function analyze(nextSentence = sentence) {
    const nextMatches = explainSentence(nextSentence);
    setAnswers({});
    setSelectedMatchId(nextMatches[0]?.id ?? "");
    setSelectedSenseId(nextMatches[0]?.senses[0]?.id ?? "");
  }

  function applySample(sample: string) {
    setSentence(sample);
    analyze(sample);
  }

  function selectMatch(match: ExplanationMatch) {
    setSelectedMatchId(match.id);
    setSelectedSenseId(match.senses[0]?.id ?? "");
    setAnswers({});
  }

  return (
    <section className="explain-workspace" aria-label="Sentence explanation workspace">
      <div className="sentence-panel">
        <label htmlFor="sentence-input">English sentence</label>
        <textarea
          id="sentence-input"
          value={sentence}
          onChange={(event) => setSentence(event.target.value)}
          rows={4}
        />
        <div className="sentence-actions">
          <button type="button" onClick={() => analyze()}>
            Analyze
          </button>
          <a href="#practice">Practice</a>
        </div>
        <div className="sample-row" aria-label="Sample sentences">
          {SAMPLE_SENTENCES.map((sample) => (
            <button key={sample} type="button" onClick={() => applySample(sample)}>
              {sample}
            </button>
          ))}
        </div>
      </div>

      <div className="analysis-panel">
        {matches.length === 0 ? (
          <div className="empty-state">
            <h2>아직 걸린 감각이 없습니다</h2>
            <p>현재 코퍼스의 have/get/take/make/keep/be/go/come/up/out/V+up에 닿을 때 해설합니다.</p>
          </div>
        ) : (
          <>
            <div className="match-tabs" aria-label="Detected targets">
              {matches.map((match) => (
                <button
                  key={match.id}
                  type="button"
                  className={match.id === activeMatch?.id ? "is-active" : ""}
                  onClick={() => selectMatch(match)}
                >
                  {match.item}
                </button>
              ))}
            </div>

            {activeMatch && activeSense ? (
              <article className="sense-card">
                <div className="sense-card-header">
                  <p className="eyebrow">
                    {axisLabel(activeMatch.axis)} · {activeMatch.matchedText}
                  </p>
                  <h2>{activeMatch.item}</h2>
                  <span className="confidence-pill">
                    {activeMatch.confidence === "exact-corpus-sentence"
                      ? "corpus exact"
                      : "target detected"}
                  </span>
                </div>

                {activeMatch.senses.length > 1 ? (
                  <div className="sense-options" aria-label="Possible senses">
                    {activeMatch.senses.map((sense) => (
                      <button
                        key={sense.id}
                        type="button"
                        className={sense.id === activeSense.id ? "is-active" : ""}
                        onClick={() => {
                          setSelectedSenseId(sense.id);
                          setAnswers({});
                        }}
                      >
                        {sense.id}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="explanation-block">
                  <h3>감각</h3>
                  <p>{activeSense.ko}</p>
                </div>
                <div className="explanation-block">
                  <h3>그림</h3>
                  <p>{activeSense.image}</p>
                </div>
                {activeSense.boundary_ko ? (
                  <div className="explanation-block">
                    <h3>경계</h3>
                    <p>{activeSense.boundary_ko}</p>
                  </div>
                ) : null}
              </article>
            ) : null}
          </>
        )}
      </div>

      {activeSense ? (
        <section id="practice" className="practice-panel" aria-label="Practice questions">
          <div className="practice-heading">
            <p className="eyebrow">Practice link</p>
            <h2>{activeSense.id}</h2>
          </div>
          <div className="practice-list">
            {activeSense.practiceItems.map((item) => {
              const selected = answers[item.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === item.answer_index;

              return (
                <article key={item.id} className="practice-card">
                  <p className="practice-source">{item.source}</p>
                  <h3>{item.sentence}</h3>
                  <p className="translation">{item.sentence_ko}</p>
                  <p className="prompt">{item.prompt}</p>
                  <div className="choice-list">
                    {item.choices.map((choice, index) => (
                      <button
                        key={choice}
                        type="button"
                        className={
                          isAnswered && index === item.answer_index
                            ? "is-correct"
                            : isAnswered && index === selected
                              ? "is-wrong"
                              : ""
                        }
                        onClick={() =>
                          setAnswers((current) => ({ ...current, [item.id]: index }))
                        }
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  {isAnswered ? (
                    <div className={isCorrect ? "feedback is-correct" : "feedback is-wrong"}>
                      <strong>{isCorrect ? "맞음" : "다시 보기"}</strong>
                      <p>{item.why_ko}</p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </section>
  );
}
