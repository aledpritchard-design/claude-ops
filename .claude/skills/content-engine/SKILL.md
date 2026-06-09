---
name: content-engine
type: agent
domain: content
composed_of:
  - cos-truth-capture
  - cos-case-study
  - cos-article
gating: public
downloadable: true
status: proposed
summary: "Three-stage content pipeline — truth capture to case study to article — governed by cos-tov throughout."
---

# agent.content-engine

Takes raw work evidence and produces publishable content in three stages.

**Stage 1 — truth capture** (`cos-truth-capture`): facts are extracted from real source evidence — transcripts, logs, the work itself — and recorded as a traceable `tc.*` document before any prose is written. The capture creates the evidence layer the later stages draw from.

**Stage 2 — case study** (`cos-case-study`): the truth capture becomes structured case content, formatted per the output specs (snapshot / full / article / cv-entry) with the writing standard applied throughout.

**Stage 3 — article** (`cos-article`): the verified evidence is shaped into long-form argument for the careerOS writing surface and downstream syndication, grounded in the truth capture and avoiding the failure modes of thought-leadership prose.

`cos-tov` governs voice throughout all three stages: calm, precise, structurally confident. Outcome before adjective. British spelling. No inflation.
