# Mission Control Live Event Bridge

The v1 live bridge is a local filesystem inbox:

- Write event JSON files into mission-events/inbox.
- Run scripts/watch-mission-events.mjs.
- The watcher applies each file through scripts/apply-mission-events.mjs.
- Successful files move to mission-events/processed.
- Failed files and error logs move to mission-events/failed.

Commands:

    node scripts/watch-mission-events.mjs --once
    node scripts/watch-mission-events.mjs

This keeps the bridge reviewable and local. A future OpenClaw adapter can emit the same event contract into the inbox or call the durable ingestion script directly.

The browser remains static: it reads mission-control-state.json. After the bridge applies events, refresh the page to see canonical state changes.
