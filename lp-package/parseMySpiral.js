// Parse MySpiral needs assessment format (from youare.one)
// Returns array of { name, score, tag, category } or null if not MySpiral format

let _id = 0;
const uid = () => `lp_${++_id}_${Math.random().toString(36).slice(2, 8)}`;

export const parseMySpiral = (text) => {
  if (!text.includes("/7") || !text.includes("========")) return null;
  const lines = text.split("\n");
  const needs = [];
  let currentCategory = null;
  let pastSummary = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("LOWEST SCORES")) { pastSummary = true; continue; }
    if (pastSummary) continue;
    if (trimmed.startsWith("====") || trimmed.startsWith("----")) continue;
    if (!trimmed || trimmed.startsWith("MySpiral") || /^\d+ \w+ \d{4}$/.test(trimmed)) continue;
    const scoreMatch = trimmed.match(/^(.+?):\s*(\d)\/7$/);
    if (scoreMatch && currentCategory) {
      const name = scoreMatch[1].trim();
      const score = parseInt(scoreMatch[2]);
      const tag = "#" + currentCategory.replace(/\s*&\s*/g, "-").replace(/\s+/g, "-");
      needs.push({ name, score, tag, category: currentCategory });
      continue;
    }
    if (trimmed && !trimmed.startsWith("🌳")) {
      currentCategory = trimmed;
    }
  }
  if (!needs.length) return null;
  return needs;
};

// Build tree structure from parsed needs (for Compass component)
export const buildPerspectivesTree = (needs) => ({
  id: "__perspectives__",
  content: "🧭 My Perspectives",
  collapsed: false,
  score: null,
  children: [
    {
      id: uid(),
      content: "Needs Assessment",
      collapsed: false,
      score: null,
      children: needs.map(n => ({
        id: uid(),
        content: `${n.name} ${n.tag}`,
        collapsed: true,
        score: n.score,
        children: []
      }))
    }
  ]
});
