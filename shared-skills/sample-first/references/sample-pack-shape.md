# Sample Pack Shape

Use this structure when the repo or template needs a concrete sample artifact.

## Recommended Sections

1. `Purpose`
   - why this sample pack exists
   - what questions it must answer

2. `Inputs`
   - approved contract docs
   - current Story Chain candidates
   - real source artifacts or references

3. `Sample Matrix`
   - sample ID
   - type
   - source or reference
   - why it is included
   - what decision it helps answer

4. `Workflow Coverage`
   - `입력/source`
   - `파싱/정규화`
   - `근거/규칙/판단 basis`
   - `제품 판정`
   - `사용자-facing output`
   - `export/handoff`

5. `Representative Samples`
   - the most normal or target case

6. `Contrast / Anti-Examples`
   - things that clarify boundaries

7. `Edge / Failure Samples`
   - missing or malformed cases that should not surprise implementation later

8. `Candidate Surface Samples`
   - only when expression or presentation is the blocker

9. `Findings`
   - `locked`
   - `R&D required`
   - `unresolved`

10. `Next Handoff`
   - `project-bootstrap`
   - Story Chain nodes
   - `contract-authoring`

## Notes

- Keep the pack small and comparative.
- Prefer examples that are easy to point at in later engineering discussions.
- If a sample no longer answers a real question, remove it instead of keeping it for completeness.
