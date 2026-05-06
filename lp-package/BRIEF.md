# Brief: Signal LP Viewer

## Context
Aleksander built a needs assessment test at youare.one. People take the test and get a results file with 22 human needs scored 1-7. He also built Signal — a structure-first AI tool where people can work with their results alongside an AI conversation.

The goal: drive people from the test into Signal. This viewer is the bridge.

## What You're Building
A standalone read-only viewer that lives on the landing page. It is NOT the full Signal app. It's a simplified experience that shows the person their test results in a radar visualization and walks them through pre-built content explaining what they can do next.

Two panels side by side on a dark (#000) background:
- **Left panel**: a read-only tree of nodes the person can click to navigate
- **Right panel**: switches between their compass radar and YouTube videos depending on which node is selected

## The User Journey
1. Person arrives from youare.one with their results (a .txt file or URL-encoded data)
2. They see their needs visualized as a colored radar — immediate "this is about me" moment
3. Left panel has pre-built nodes they can explore:
   - Their scored needs (clicking these highlights them on the radar)
   - "What can you do with a map?" section with video nodes
   - When they select a video node, the right panel swaps from radar to YouTube embed
   - A CTA node at the bottom: "Work with me in Signal →"
4. CTA leads to manual onboarding signup

## What's In This Package
- `Compass.jsx` — the radar component, taken directly from Signal. Drop-in React component.
- `tree.js` — utility functions the Compass needs (scoreColor, sortScored, findN)
- `theme.js` — color constants
- `parseMySpiral.js` — parser for the youare.one results format
- `INSTRUCTIONS.md` — detailed technical spec: component code, radar visual spec, node types, panel switching logic

## Key Decisions
- **Read-only**: no editing, no keyboard shortcuts, no undo/redo. Click to select, that's it.
- **No API**: no chat, no Claude integration. This is a viewer, not a tool.
- **Self-contained**: don't import from Signal's repo. These files are your copies.
- **The radar is the hook**: it should feel personal and alive. The scoring colors (red 1-3, orange 4-5, teal 6-7) tell a story at a glance. When the person sees their low scores light up red, that's the moment.
- **Videos replace the radar**: when a video node is selected, the right panel smoothly swaps to a YouTube embed. When they click back to a scored node, the radar returns.

## Node Structure to Pre-Build
```
🧭 My Perspectives
    Needs Assessment
        [22 scored nodes from their test results]
    What can you do with a map?
        See me working with my maps in Signal        → video
        How to read your compass                      → video
        What your lowest scores are telling you        → content
        Work with me in Signal →                       → CTA link
```

Mark nodes with a `type` field: `"video"` (has `videoId`), `"cta"` (has `href`), or nothing (regular/scored). The right panel checks `selNode.videoId` or `selNode.href` to decide what to render.

## Design
- Dark background (#000), monospace fonts
- Matches Signal's aesthetic — minimal, quiet, the data speaks
- Mobile: stack panels vertically, radar on top, tree below
- See INSTRUCTIONS.md for exact colors, sizes, spacing

## What Success Looks Like
Someone uploads their results, sees their radar, thinks "that's me," watches a video of Aleksander working with his own map, and clicks the CTA to start their own journey in Signal.
