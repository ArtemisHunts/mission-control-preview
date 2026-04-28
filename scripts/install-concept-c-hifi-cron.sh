#!/usr/bin/env bash
set -euo pipefail
cd /home/agent-artemis/clawd/mission-control-preview
openclaw cron add \
  --name concept-c-hifi-gold-loop \
  --description 'Autonomous Concept C hi-fi loop on concept-c-hifi until gold-standard visual gate.' \
  --every 30m \
  --session isolated \
  --agent main \
  --model openai-codex/gpt-5.4 \
  --thinking high \
  --timeout-seconds 1800 \
  --channel discord \
  --to channel:1477048876669075578 \
  --announce \
  --message 'Autonomous Concept C hi-fi loop tick. Work in /home/agent-artemis/clawd/mission-control-preview only. Required branch: concept-c-hifi. Do not touch main or deploy live. Follow docs/loops/concept-c-hifi-loop-prompt.md exactly. Execute one coherent hi-fi pass toward gold-standard Concept C, commit and push to origin/concept-c-hifi only if screenshot/gate evidence or a real blocker note exists. Send a concise Discord update only for a commit shipped or a real blocker. No placeholder progress.'
