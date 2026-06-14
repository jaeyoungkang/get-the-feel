# Story Chain Authority Contract Map

This map answers: who owns each class of Story Chain decision in agentic-base?

It does not define Story Chain concepts. It points to the files that do.

## Authority Split

| Authority | Owns | Agent may advance? | Main sources |
| --- | --- | --- | --- |
| Human | Product meaning, Promise existence, Aspect meaning, bootstrap approval | No | Story Chain concepts, pilot lifecycle |
| Agent | Drafting, propagation, Evidence Ledger wiring, Engineering Assurance wiring, operations routing, code/test targets | Yes | Promise/Aspect/Evidence Ledger files, Engineering Assurance contracts, operations runbooks |
| Evaluator | Deterministic checks and live judges after a project has them | Yes | Evidence Ledger, project tests |
| System | CI, release gates, Story Chain validators | No | package scripts, Mission Control |

Sources:

- [`docs/contracts/story-chain/concepts.md`](../contracts/story-chain/concepts.md)
- [`docs/pilot-lifecycle.md`](../pilot-lifecycle.md)

## Product Meaning

Product meaning starts in Product docs, samples, Experience, Moment, Promise,
and Aspect documents. Agents can draft text, but approval of a new Promise or
Aspect meaning is Human authority.

When the question is "should the product promise this?", stop at Human
authority. When the question is "how do we propagate an approved promise?",
Agent authority can continue.

## Evidence

Evidence Ledger is the audit trail between approved meaning and executable
proof. It is not a future feature spec. It answers what currently proves a
Promise or Aspect.

When a project uses Engineering Assurance, Evidence Ledger may also cite
Assurance Claims, Controls, and evidence kinds that support a verdict. These
citations do not create product meaning; they make internal invariants and
operational controls visible to Mission Control.

Operations runbooks are procedure authority only. If a runbook changes product
meaning, internal invariants, or release gates, it must route to the owning
Story Chain, Engineering Assurance, or quality gate surface instead of creating
a parallel contract.

Sources:

- [`docs/contracts/story-chain/concepts.md`](../contracts/story-chain/concepts.md)
- [`docs/contracts/story-chain/evidence-ledgers/_TEMPLATE.ledger.md`](../contracts/story-chain/evidence-ledgers/_TEMPLATE.ledger.md)
- [`docs/contracts/engineering/README.md`](../contracts/engineering/README.md)
- [`docs/operations/README.md`](../operations/README.md)

## Read Path

For a new product-facing commitment:

1. Product identity and sample evidence.
2. Story Chain concepts.
3. Affected Experience, Moment, Promise, and Aspect.
4. Covering Evidence Ledger.
5. Code/test targets after bootstrap.

Do not use this map as the approval artifact.
