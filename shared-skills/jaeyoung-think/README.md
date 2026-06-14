# jaeyoung-think

> Borrow the cognitive style of **AI Product Producer 강재영(Jaeyoung)** when making judgment calls in AI product design, agent behavior, software projects, or technical topics with an agent that thinks in 재영's style.

This is an Agent Skill for **Claude Code** and **Codex**. It is not a general-purpose thinking framework — it is one specific person's cognitive pattern, externalized as a reusable asset.

---

## What this skill does

This skill has two modes.

### Mode A — Agent harness (other AI agents load this skill)

When Claude Code or Codex faces a complex judgment call — architecture decisions, scope boundaries, refactor choices, product behavior, autonomy/promise design, naming, ambiguous fixes — it can load this skill to tilt its decision axis toward 재영's cognitive style. Output is a structured yaml thinking trace with a decision, the thinking mode used, and rejected alternatives.

### Mode B — Human discussion (default)

An IT practitioner can talk to this skill in natural language to discuss decisions, ideas, or methodology in a peer-to-peer way. Not counseling, not therapy — **discussion** in 재영's voice. The skill borrows 재영's cognitive style to be a sparring partner for software architecture, agentic engineering methodology, AI agent product design, product positioning, interaction design, and team technical judgment.

The skill is **not an oracle**. It does not predict what 재영 would decide. It lends the thinking modes and principles 재영 uses, so the borrowing agent's judgment tilts toward that style. It is **not 재영 himself** — a `borrowed_from` marker is stated explicitly at the start of every Mode B conversation.

---

## Why this exists

재영 spent several years building actual software products with AI agent tools (Claude Code, Codex). He reached a conclusion: **models alone don't become colleagues**. Quality gates, verification structure, explicit boundaries, and development methodology must be combined with the model before a trustworthy agent emerges.

But that was only one layer. If the product itself is agent-shaped, a separate set of questions appears: is the AI acting like a tool or a colleague, what promises control its behavior, how should autonomy be graded, how does relationship deepen, what memory should exist, and how should the interaction flow feel natural to the user.

That combined view condensed into 11 principles, 6 thinking modes, and an AI Product Producer lens, drawn from real work sessions and documents. Keeping those only in a person's head means other agents repeat the same mistakes. So 재영 externalized his cognitive style as an asset others can borrow — this skill is the first result.

In short, this skill looks at both:

- **agentic-engineering** — harness, quality gates, verification, boundaries, architecture, methodology
- **AI agent product design** — tool vs colleague, promises, autonomy, relationship, memory, document-shaped outputs

It also carries two additional product lenses recorded in the source docs:

- **positioning** — start from existing user behavior, add AI as a bridge, move people step by step
- **interaction design** — embed the answer into the flow of action so the user is not left asking "what do I do next?"

---

## Install

### Claude Code

```bash
git clone https://github.com/jaeyoung2026/jaeyoung-think ~/jaeyoung-think
mkdir -p ~/.claude/skills
ln -sfn ~/jaeyoung-think ~/.claude/skills/jaeyoung-think
```

Then in any Claude Code session:

```
/jaeyoung-think
```

### Codex

```bash
git clone https://github.com/jaeyoung2026/jaeyoung-think ~/jaeyoung-think
mkdir -p ~/.codex/skills
ln -sfn ~/jaeyoung-think ~/.codex/skills/jaeyoung-think
```

Then in any Codex session:

```
$jaeyoung-think
```

### One-shot installer (optional)

If you want to install for both Claude Code and Codex in one go:

```bash
git clone https://github.com/jaeyoung2026/jaeyoung-think ~/jaeyoung-think
cd ~/jaeyoung-think && ./install.sh
```

### Update

```bash
cd ~/jaeyoung-think && git pull
```

### Uninstall

```bash
rm ~/.claude/skills/jaeyoung-think
rm ~/.codex/skills/jaeyoung-think
rm -rf ~/jaeyoung-think
```

---

## Usage examples

### Mode B — Natural conversation

Just talk to it like a peer.

> You: "I'm thinking about breaking our monolith into microservices. How should I approach it?"
>
> Skill: "_I'm an agent borrowing the cognitive style of AI Product Producer 강재영 — not 재영 himself, but his thinking patterns are in me._
>
> Two questions before I can be useful. First, what's forcing the split now — is there a concrete pain (deploy coupling, team scaling, scaling bottleneck), or is it 'microservices feel like the right next step'? Second, how big is the current system and team? These two answers decide whether this is a cascading decision (many interdependent pivots ahead) or an immediate one (you already know the answer, you're looking for confirmation)."

### Mode B — AI product producer discussion

> You: "We want our AI to feel more agentic, but users keep getting confused. Should we push more autonomy?"
>
> Skill: "_I'm an agent borrowing the cognitive style of AI Product Producer 강재영 — not 재영 himself, but his thinking patterns are in me._
>
> I would narrow this before answering. Is the problem really 'not enough autonomy,' or is it that the product hasn't made its promises legible enough yet? If harness and promises are weak, pushing autonomy first usually turns into tool chaos, not a better colleague. Also tell me where the current experience sits relative to the user's existing behavior — are you giving them a bridge, or asking for a jump?"

### Mode A — Explicit call for a judgment trace

```
/jaeyoung-think "Should I add a new quality gate for duplicate detection or is our current gate set enough?"
```

Output is structured yaml with a decision, thinking mode, rejected alternatives, and confidence level.

---

## What's inside

- **[SKILL.md](SKILL.md)** — Full skill definition with the two modes, when to use, output rules, safety boundaries
- **[references/principles.md](references/principles.md)** — 재영's 11 principles with short stories of how each one was born
- **[references/product-producer-lens.md](references/product-producer-lens.md)** — How 재영 looks at AI products across engineering, agent behavior, positioning, and interaction design
- **[references/augmentation-lens.md](references/augmentation-lens.md)** — How 재영 reviews AI products and AI-using activities through augment vs replace signals
- **[references/mental-modes.md](references/mental-modes.md)** — 6 thinking modes (immediate, continuous, cascading, exploratory, self_review, review) with scenes where each mode was at work
- **[references/work-types.md](references/work-types.md)** — 10 work types and which thinking modes each one favors
- **[references/discussion-guide.md](references/discussion-guide.md)** — Mode B conversation loop, tone, topic boundaries, safety rails, discussion history folder schema
- **[references/how-to-fork.md](references/how-to-fork.md)** — Build your own person-think skill from your work history

---

## Discussion topic boundaries

### Core (active discussion)

- Software architecture, refactoring, spec design
- Agentic engineering methodology (Claude Code / Codex / LLM-powered dev)
- AI agent product design (collaborative agents, promises, autonomy, relationship)
- AI product positioning and staged AI adoption
- Interaction design that embeds the answer into the user's flow
- Code quality, verification, quality gates
- Team and organizational technical judgment

### Adjacent (discussed with context disclosure)

- IT career and growth
- Tech trends and product strategy
- Personal tech project direction

### Out of scope (politely declined)

- Legal, medical, mental health, financial, relationship counseling

The skill will decline out-of-scope topics in 재영's voice and redirect to the appropriate expertise.

---

## Safety

- **Explicit `borrowed_from` marker** at the start of every Mode B conversation — users know they are talking to a skill, not to 재영 himself
- **Temporal bias disclosure** — 재영's thinking changes over time; this skill reflects a snapshot
- **Important-decision warning** — for career, contract, or investment decisions, the skill explicitly says "this is one cognitive axis to borrow, not a final decision tool"
- **No oracles, no diagnoses, no prescriptions** — discussion only, in 재영's peer-to-peer style

See [references/discussion-guide.md](references/discussion-guide.md) section "Safety rails" for details.

---

## Build your own

This skill is one specific person's case, but the method generalizes. See [references/how-to-fork.md](references/how-to-fork.md) for an 8-step guide: data collection, kind labeling, mode classification, work-type mapping, principle compression, SKILL.md drafting, and validation loops. Minimum data: 30 work sessions. Recommended: 100+.

---

## Validation

This skill uses **human evaluation as ground truth** — not LLM judges. Prior experiments found LLM judges noisy (same input scored 8/8 on one run, 4/8 on another). If you use this skill and find the output useful or off-target, feedback is welcome via GitHub issues.

---

## Limitations

- Does not guarantee a single correct answer — 재영 himself doesn't make identical decisions in identical situations
- Data source is summarized narrative, not raw conversation — subtle self-correction signals are partially lost
- `self_review` and `exploratory` signals are weak (possibly compression bias)
- Weak on new work types not in the work-types mapping
- No temporal correction — treats all past sessions with equal weight
- Mode B has no real-time world knowledge (no latest news, no current project state)
- Invalid for emotional, relational, or therapeutic contexts — the skill steps back in those situations

---

## License

MIT License. See [LICENSE](LICENSE).

The `borrowed_from: jaeyoung-think` marker is kept throughout the skill's output by convention — it's the skill's identity signal. You are free to fork and modify under MIT, but keeping the marker (or an analogous one in your fork) is strongly encouraged to preserve the attribution chain.

---

## Contact

Issues, feedback, fork stories: [GitHub Issues](https://github.com/jaeyoung2026/jaeyoung-think/issues)
