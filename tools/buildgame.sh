#!/bin/bash
# concatenează sursele jocului în public/game.js (fără dependențe)
set -e; cd "$(dirname "$0")/../game"
cat 10_panels.js 30_pad.js 40_core.js 41_missions.js 42_ui.js 43_stations.js 44_desk.js 45_bench.js 46_story.js 47_more.js 48_flow.js 49_end.js > ../public/game.js
node -c ../public/game.js && echo "game.js OK $(wc -c < ../public/game.js) bytes"
