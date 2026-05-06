# Signal LP Viewer — Build Package

## What This Is
A read-only Signal viewer for the landing page. Users arrive from youare.one with their needs assessment results. They see their scores in a compass radar, navigate pre-built content nodes, watch videos, and get a CTA to unlock the full Signal tool.

## The Flow
1. User completes test on youare.one → gets a .txt results file
2. LP accepts the file (or URL param with encoded results)
3. Compass renders their personal scores
4. Left panel shows a read-only tree they can navigate (click to select, no editing)
5. Right panel shows Compass by default, swaps to YouTube embed when a video node is selected
6. CTA node leads to manual onboarding signup

## Files Included

### From Signal (use as-is)
- `Compass.jsx` — The radar component. Props: `tree` (full tree array), `selId` (selected node ID), `onSelect(id)` (callback when node clicked on radar). Requires React.
- `tree.js` — Pure utility functions. You need: `scoreColor`, `sortScored`, `findN`. The Compass imports these.
- `theme.js` — Color constants (`C.teal`, `C.textLow`, etc.)

### New for LP
- `parseMySpiral.js` — Parses the youare.one results format. `parseMySpiral(text)` returns array of `{name, score, tag, category}` or null. `buildPerspectivesTree(needs)` converts to tree structure the Compass expects.

## Pre-built Node Structure

```
🧭 My Perspectives
    Needs Assessment
        [populated from user's test results — scored nodes]
    What can you do with a map?
        See me working with my maps in Signal    [video: youtube_id_here]
        How to read your compass                  [video: youtube_id_here]
        What your lowest scores are telling you   [content node]
        Work with me in Signal →                  [CTA node: link to signup]
```

## Node Types
Mark nodes with a `type` field:
- `type: "scored"` — needs with scores (from parseMySpiral), shows compass on right
- `type: "video"` — has a `videoId` field, shows YouTube embed on right when selected
- `type: "cta"` — has a `href` field, renders as a link/button
- No type — regular content node, shows compass on right

## Building the Read-Only Tree

You don't need Signal's full tree system. A simple component:

```jsx
function TreeNode({ node, depth, selId, onSelect }) {
  const isSel = node.id === selId;
  return (
    <div>
      <div onClick={() => onSelect(node.id)}
        style={{ padding: `4px 8px 4px ${depth * 20 + 8}px`,
          background: isSel ? "rgba(45,212,191,0.15)" : "transparent",
          cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 13,
          color: isSel ? "#f5f5f7" : "#b0b4c0" }}>
        {node.content}
      </div>
      {!node.collapsed && node.children?.map(c =>
        <TreeNode key={c.id} node={c} depth={depth + 1} selId={selId} onSelect={onSelect} />
      )}
    </div>
  );
}
```

## Right Panel Logic

```jsx
const selNode = findN(tree, selId);
if (selNode?.videoId) {
  // Render YouTube embed
  <iframe src={`https://www.youtube.com/embed/${selNode.videoId}`} ... />
} else if (selNode?.href) {
  // Render CTA
  <a href={selNode.href}>Work with me in Signal →</a>
} else {
  // Render Compass
  <Compass tree={tree} selId={selId} onSelect={setSelId} />
}
```

## Compass Radar — Visual Spec

### Scoring Colors
- **Red** `rgb(239,68,68)` — scores 1-3
- **Orange** `rgb(251,146,60)` — scores 4-5
- **Teal** `rgb(45,212,191)` — scores 6-7

### Grid
- 7 concentric circles, center (200,200), radius R=150, increments R/7
- Outer ring strokeWidth 1.5, inner 0.5. Stroke: rgba(255,255,255,0.1)
- Spoke lines from center to edge per node. Stroke: rgba(255,255,255,0.08), width 0.5

### Pie Slices
Each node: colored wedge from center to `(score/7)*R`. Score color at opacity 0.08.
Focused node: wedge extends to full R, opacity 0.2. All other slices hidden when focused.

### Dots
At `(score/7)*R` along mid-angle of pie piece. Score color.
- Normal: radius 3, no glow
- Focused: radius 6, glow filter (feGaussianBlur stdDeviation=3)

### Web Line
Polygon connecting all dots. Stroke: rgba(255,255,255,0.3), width 2.
Fill: rgba(255,255,255,0.06) overview, none when focused.

### Labels (not focused)
Outward from ring along mid-angle:
1. Emoji at R+16, fontSize 14
2. Score number at R+32, fontSize 10, bold, score color
3. Label text at R+50, fontSize 7, rgba(255,255,255,0.4)

### Labels (focused node)
1. Big score at R+50, fontSize 36, bold, score color, with colored underline
2. Label at R+90, fontSize 22, score color, no wrap
3. Emoji in radar center (200,200), fontSize 48

### Alignment
- cos(midAngle) < -0.15 → textAnchor "end"
- cos(midAngle) > 0.15 → textAnchor "start"
- Otherwise → "middle"

### Rotation
Focused node rotates to 12 o'clock: `rotOffset = -(focusIdx * angleStep + angleStep/2)`

### Focus Shift
When focused, container gets `margin-top: 60px` to push radar down.

## Fonts
```css
--font-mono: "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace;
--font-sans: "Inter", -apple-system, system-ui, sans-serif;
```

## Dependencies
- React 18+
- No other dependencies. Pure SVG rendering.
