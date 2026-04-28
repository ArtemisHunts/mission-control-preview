#!/usr/bin/env bash
set -euo pipefail
cd /home/agent-artemis/clawd/mission-control-preview
if [ "$(git branch --show-current)" != "concept-c-hifi" ]; then
  git checkout concept-c-hifi
fi
mkdir -p logs
STATE="/tmp/concept-c-hifi-loop-state.json"
LOG="logs/concept-c-hifi-loop-$(date -u +%Y%m%dT%H%M%SZ).log"
nohup node /home/agent-artemis/clawd/skills/ralph-loops/scripts/ralph-loop.mjs \
  --name concept-c-hifi-gold-standard \
  --prompt docs/loops/concept-c-hifi-loop-prompt.md \
  --done HIFI_GOLD_STANDARD \
  --max 24 \
  --delay 20 \
  --timeout 900 \
  --thinking high \
  --state "$STATE" \
  --check-cmd 'node scripts/hifi-loop-check.mjs' \
  > "$LOG" 2>&1 &
echo $! > logs/concept-c-hifi-loop.pid
echo "started pid=$(cat logs/concept-c-hifi-loop.pid) state=$STATE log=$LOG"
