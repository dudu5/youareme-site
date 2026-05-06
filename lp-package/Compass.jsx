import { scoreColor, sortScored, findN } from "../lib/tree.js";

const PERSPECTIVES_ID = "__perspectives__";
const CX = 200, CY = 200, R = 150;
const EMOJI_D = 16, EMOJI_D_FOCUS = 50;
const SCORE_D = 32;
const LABEL_D = 46, LABEL_D_FOCUS = 90;
const SCORE_D_FOCUS = 74;

const collectScored = (ns, parent) => {
  const out = [];
  sortScored(ns, parent).forEach(n => {
    if (n.score != null && (!n.children?.length || n.children.every(c => c.score == null))) out.push(n);
    else if (n.children?.length) out.push(...collectScored(n.children, n));
  });
  return out;
};

function Label({ x, y, text, color, fontSize, anchor, cy, midAngle, noWrap }) {
  const baseline = y < cy - 5 ? "auto" : y > cy + 5 ? "hanging" : "middle";
  const words = text.split(" ");
  if (noWrap || words.length <= 2) {
    return <text x={x} y={y} fill={color} fontSize={fontSize} fontFamily="var(--font-mono)" textAnchor={anchor} dominantBaseline={baseline}>{text}</text>;
  }
  const mid = Math.ceil(words.length / 2);
  const isCentered = anchor === "middle";
  return (
    <text x={x} y={y} fill={color} fontSize={fontSize} fontFamily="var(--font-mono)" textAnchor={isCentered ? "middle" : anchor} dominantBaseline={baseline}>
      <tspan x={x} dy={0}>{words.slice(0, mid).join(" ")}</tspan>
      <tspan x={x} dy={fontSize + 2}>{words.slice(mid).join(" ")}</tspan>
    </text>
  );
}

export default function Compass({ tree, selId, onSelect }) {
  const perspNode = findN(tree, PERSPECTIVES_ID);
  if (!perspNode?.children?.length) return null;
  const scored = collectScored(perspNode.children, perspNode);
  if (!scored.length) return null;

  const angleStep = (2 * Math.PI) / scored.length;
  const focusIdx = scored.findIndex(n => n.id === selId);
  const hasFocus = focusIdx >= 0;
  const rotOffset = hasFocus ? -(focusIdx * angleStep + angleStep / 2) : 0;

  const points = scored.map((n, i) => {
    const angle = -Math.PI / 2 + i * angleStep + rotOffset;
    const midAngle = angle + angleStep / 2;
    const dist = (n.score / 7) * R;
    const emoji = n.content?.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)/u)?.[0] || "•";
    const label = n.content?.replace(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u, "").replace(/#\S+/g, "").trim() || "";
    return { x: CX + dist * Math.cos(midAngle), y: CY + dist * Math.sin(midAngle), angle, midAngle, emoji, label, score: n.score, id: n.id };
  });

  const polygon = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div style={{ width: "100%", maxWidth: "65vh", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", margin: hasFocus ? "60px auto 0" : "0 auto", padding: 70, boxSizing: "content-box" }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Colored pie slices behind grid */}
        {points.map((p, i) => {
          const a1 = p.angle;
          const a2 = a1 + angleStep;
          const sliceR = (i === focusIdx) ? R : (p.score / 7) * R;
          const color = scoreColor(p.score);
          const arcPts = 24;
          const slicePath = Array.from({ length: arcPts + 1 }, (_, j) => {
            const a = a1 + (a2 - a1) * (j / arcPts);
            return `${CX + sliceR * Math.cos(a)},${CY + sliceR * Math.sin(a)}`;
          });
          if (hasFocus && i !== focusIdx) return null;
          return <polygon key={`slice-${i}`} points={`${CX},${CY} ${slicePath.join(" ")}`}
            fill={color} opacity={i === focusIdx ? 0.2 : 0.08} stroke="none" />;
        })}
        {/* Grid rings */}
        {[1, 2, 3, 4, 5, 6, 7].map(level => (
          <circle key={level} cx={CX} cy={CY} r={(level / 7) * R}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={level === 7 ? 1.5 : 0.5} />
        ))}
        {/* Spoke lines */}
        {scored.map((_, i) => {
          const angle = -Math.PI / 2 + i * angleStep + rotOffset;
          return <line key={i} x1={CX} y1={CY} x2={CX + R * Math.cos(angle)} y2={CY + R * Math.sin(angle)} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />;
        })}
        {/* Web */}
        <polygon points={polygon} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
        {/* Emoji in center when focused */}
        {hasFocus && (
          <text x={CX} y={CY} fontSize={48} textAnchor="middle" dominantBaseline="central">{points[focusIdx].emoji}</text>
        )}
        {/* Dots + emojis + labels */}
        {points.map((p, i) => {
          const isFocused = i === focusIdx;
          const color = scoreColor(p.score);
          const ex = CX + (isFocused ? EMOJI_D_FOCUS : EMOJI_D) * Math.cos(p.midAngle) + R * Math.cos(p.midAngle);
          const ey = CY + (isFocused ? EMOJI_D_FOCUS : EMOJI_D) * Math.sin(p.midAngle) + R * Math.sin(p.midAngle);
          const sx = CX + (R + SCORE_D) * Math.cos(p.midAngle);
          const sy = CY + (R + SCORE_D) * Math.sin(p.midAngle);
          const lx = CX + (R + LABEL_D_FOCUS) * Math.cos(p.midAngle);
          const ly = CY + (R + LABEL_D_FOCUS) * Math.sin(p.midAngle);
          const tx = CX + (R + 50) * Math.cos(p.midAngle);
          const ty = CY + (R + 50) * Math.sin(p.midAngle);
          const cosA = Math.cos(p.midAngle);
          const anchor = Math.abs(cosA) < 0.15 ? "middle" : cosA < 0 ? "end" : "start";
          return (
            <g key={p.id} style={{ cursor: "pointer" }} onClick={() => onSelect(p.id)}>
              <circle cx={p.x} cy={p.y} r={isFocused ? 6 : 3} fill={color} filter={isFocused ? "url(#dotGlow)" : undefined} />
              {isFocused
                ? <g>
                    <text x={ex} y={ey - 6} fill={color} fontSize={36} fontWeight={700} fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="central">{p.score}</text>
                    <line x1={ex - 14} y1={ey + 14} x2={ex + 14} y2={ey + 14} stroke={color} strokeWidth={2} />
                  </g>
                : <text x={ex} y={ey} fontSize={14} textAnchor="middle" dominantBaseline="central">{p.emoji}</text>
              }
              {isFocused
                ? <Label x={lx} y={ly} text={p.label} color={color} fontSize={22} anchor={anchor} cy={CY} midAngle={p.midAngle} noWrap />
                : <>
                    <text x={sx} y={sy} fill={color} fontSize={10} fontWeight={700} fontFamily="var(--font-mono)" textAnchor={anchor}
                      dominantBaseline={sy < CY - 5 ? "auto" : sy > CY + 5 ? "hanging" : "middle"}>{p.score}</text>
                    <Label x={tx} y={ty} text={p.label} color="rgba(255,255,255,0.4)" fontSize={7} anchor={anchor} cy={CY} midAngle={p.midAngle} />
                  </>
              }
            </g>
          );
        })}
      </svg>
    </div>
  );
}
