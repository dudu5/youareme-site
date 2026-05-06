// ─── Tree utilities (pure functions, no React) ──────────────────────────────

// ─── Score helpers ───────────────────────────────────────────────────────────
const SCORE_RED = "rgb(239,68,68)";
const SCORE_ORANGE = "rgb(251,146,60)";
const SCORE_TEAL = "rgb(45,212,191)";
export const scoreColor = (score) => score <= 3 ? SCORE_RED : score <= 5 ? SCORE_ORANGE : SCORE_TEAL;
export const scoreColorAlpha = (score) => score <= 3 ? "rgba(239,68,68," : score <= 5 ? "rgba(234,179,8," : "rgba(45,212,191,";
export const sortScored = (children, parent) => {
  if (!children.some(c => c.score != null)) return children;
  return [...children].sort((a, b) => parent?.sortAsc !== false
    ? (a.score ?? 99) - (b.score ?? 99)
    : (b.score ?? 0) - (a.score ?? 0));
};

// ─── Date format: "Mon | 1st | Apr | 26" ────────────────────────────────────
const DNAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MNAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ordinal = (n) => { const s = ["th","st","nd","rd"]; const v = n % 100; return n + (s[(v-20)%10]||s[v]||s[0]); };

export const fmtDate = (iso) => {
  const d = new Date(iso + "T12:00:00");
  return `${DNAMES[d.getDay()]} | ${ordinal(d.getDate())} | ${MNAMES[d.getMonth()]} | ${String(d.getFullYear()).slice(2)}`;
};

// Regex to match pretty date format: "Mon | 1st | Apr | 26"
export const DATE_PRETTY_RE = /(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat) \| \d{1,2}(?:st|nd|rd|th) \| (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \| \d{2}/;

export const parsePrettyDate = (str) => {
  const m = str.match(/^(\w+) \| (\d{1,2})\w+ \| (\w+) \| (\d{2})$/);
  if (!m) return null;
  const mi = MNAMES.indexOf(m[3]); if (mi === -1) return null;
  const y = 2000 + parseInt(m[4]);
  const d = parseInt(m[2]);
  return `${y}-${String(mi + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

// Migrate old !(2026-04-01) format to pretty format in a tree
export const migrateDates = (tree) => {
  const OLD_RE = /!\((\d{4}-\d{2}-\d{2})\)/g;
  const migrate = (ns) => ns.map(n => ({
    ...n,
    content: n.content.replace(OLD_RE, (_, iso) => fmtDate(iso)),
    children: n.children ? migrate(n.children) : [],
  }));
  return migrate(tree);
};

let _uid = 1000;
export const uid = () => `n${++_uid}`;

// Scan tree and advance _uid past any existing IDs to prevent duplicates
export const syncUid = (tree) => {
  const walk = (ns) => {
    for (const n of ns) {
      const m = n.id?.match?.(/^n(\d+)$/);
      if (m) _uid = Math.max(_uid, parseInt(m[1], 10));
      if (n.children?.length) walk(n.children);
    }
  };
  walk(tree);
};

// Fix duplicate IDs in a tree by assigning new IDs to duplicates
export const dedupIds = (tree) => {
  const seen = new Set();
  const walk = (ns) => ns.map(n => {
    let node = n;
    if (seen.has(node.id)) {
      node = { ...node, id: uid() };
    }
    seen.add(node.id);
    if (node.children?.length) {
      return { ...node, children: walk(node.children) };
    }
    return node;
  });
  return walk(tree);
};

export const ROOT_ID = "root";

export const SAMPLE = [
  { id: ROOT_ID, content:"🌳 MyStructure", collapsed:false, children:[] },
];

// Parse indented/structured text into tree nodes
// Handles: tabs, 2-space, 4-space, markdown bullets (- * +), numbered lists (1.), headers (#)
export const parseIndented = (text) => {
  const lines = text.split("\n").filter(l => l.trim());
  if (!lines.length) return [];

  // Detect indent unit: find smallest non-zero leading whitespace
  let indentUnit = 4; // default
  for (const line of lines) {
    const spaces = line.match(/^( +)/);
    if (spaces && spaces[1].length > 0) {
      indentUnit = Math.min(indentUnit, spaces[1].length);
    }
  }

  const root = [];
  const stack = [{ children: root, depth: -1 }];

  lines.forEach(line => {
    // Calculate whitespace depth
    const tabs = line.match(/^\t*/)[0].length;
    const spaces = tabs === 0 ? line.match(/^ */)[0].length : 0;
    const wsDepth = tabs || Math.floor(spaces / indentUnit);

    // Strip leading whitespace
    let rest = line.replace(/^[\t ]+/, "");

    // Strip markdown list markers: "- ", "* ", "+ ", "1. ", "1) "
    const listMatch = rest.match(/^(?:[-*+]|\d+[.)]) +/);
    if (listMatch) rest = rest.slice(listMatch[0].length);

    // Strip markdown headers: "# ", "## ", etc. — treat # count as depth boost
    let headerDepth = 0;
    const headerMatch = rest.match(/^(#{1,6})\s+/);
    if (headerMatch) {
      headerDepth = headerMatch[1].length - 1; // # = 0, ## = 1, etc.
      rest = rest.slice(headerMatch[0].length);
    }

    let content = rest.trim();
    if (!content) return;

    // Parse score marker [score:N]
    let score = null;
    const scoreMatch = content.match(/\s*\[score:(\d)\]\s*$/);
    if (scoreMatch) { score = parseInt(scoreMatch[1]); content = content.replace(scoreMatch[0], "").trim(); }

    const depth = wsDepth + headerDepth;
    const node = { id: uid(), content, collapsed: false, children: [], ...(score != null ? { score } : {}) };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push({ children: node.children, depth });
  });
  return root;
};

// Serialize a node and its children as tab-indented text
export const serializeNode = (node, depth = 0) => {
  const prefix = "\t".repeat(depth);
  const score = node.score != null ? ` [score:${node.score}]` : "";
  let out = prefix + (node.content || "") + score + "\n";
  if (node.children?.length) {
    node.children.forEach(c => { out += serializeNode(c, depth + 1); });
  }
  return out;
};

export const serializeTree = (nodes) => nodes.map(n => serializeNode(n, 0)).join("").replace(/\n$/, "");

// Serialize selected nodes from tree, preserving relative structure
export const serializeSelected = (tree, selectedIds) => {
  const selSet = new Set(selectedIds);
  const collect = (ns) => {
    const result = [];
    ns.forEach(n => {
      if (selSet.has(n.id)) result.push(n);
      else if (n.children?.length) result.push(...collect(n.children));
    });
    return result;
  };
  return collect(tree).map(n => serializeNode(n, 0)).join("").replace(/\n$/, "");
};

// Get visible (not collapsed) node IDs in order
export const getVisible = (ns, out = [], parent = null) => {
  const kids = sortScored(ns, parent);
  kids.forEach(n => {
    out.push(n.id);
    if (!n.collapsed && n.children?.length) getVisible(n.children, out, n);
  });
  return out;
};

export const findN = (ns, id) => {
  for (const n of ns) {
    if (n.id === id) return n;
    if (n.children?.length) { const f = findN(n.children, id); if (f) return f; }
  }
  return null;
};

export const getDescendants = (node) => {
  const ids = [];
  const walk = (n) => n.children?.forEach(c => { ids.push(c.id); walk(c); });
  walk(node); return ids;
};

export const mapN = (ns, id, fn) => ns.map(n => {
  if (n.id === id) return fn(n);
  if (n.children?.length) return { ...n, children: mapN(n.children, id, fn) };
  return n;
});

export const removeN = (ns, id) => {
  let removed = null;
  const go = arr => arr.reduce((acc, n) => {
    if (n.id === id) { removed = n; return acc; }
    acc.push({ ...n, children: go(n.children || []) });
    return acc;
  }, []);
  return [go(ns), removed];
};

// Get bullet style from a sibling group (returns bullet value or undefined)
const siblingBullet = (ns, targetId) => {
  for (const n of ns) {
    if (n.id === targetId) return n.bullet;
    if (n.children?.length) { const b = siblingBullet(n.children, targetId); if (b !== undefined) return b; }
  }
  return undefined;
};

export const insertAfterN = (ns, targetId, node) => {
  const bullet = siblingBullet(ns, targetId);
  const styled = bullet ? { ...node, bullet } : (node.bullet ? { ...node, bullet: undefined } : node);
  const out = [];
  for (const n of ns) {
    out.push({ ...n, children: insertAfterN(n.children || [], targetId, node) });
    if (n.id === targetId) out.push(styled);
  }
  return out;
};

export const insertFirstChildN = (ns, parentId, node) =>
  mapN(ns, parentId, n => {
    const bullet = n.children?.[0]?.bullet;
    const styled = bullet ? { ...node, bullet } : node;
    return { ...n, collapsed: false, children: [styled, ...(n.children || [])] };
  });

export const insertLastChildN = (ns, parentId, node) =>
  mapN(ns, parentId, n => {
    const bullet = n.children?.[0]?.bullet;
    const styled = bullet ? { ...node, bullet } : node;
    return { ...n, collapsed: false, children: [...(n.children || []), styled] };
  });

export const parentOf = (ns, id, pid = null) => {
  for (const n of ns) {
    if (n.id === id) return pid;
    const f = parentOf(n.children || [], id, n.id);
    if (f !== undefined) return f;
  }
  return undefined;
};

export const prevSibOf = (ns, id) => {
  const idx = ns.findIndex(n => n.id === id);
  if (idx > 0) return ns[idx - 1].id;
  if (idx === 0) return null;
  for (const n of ns) {
    const f = prevSibOf(n.children || [], id);
    if (f !== undefined) return f;
  }
  return undefined;
};

export const nextSibOf = (ns, id) => {
  const idx = ns.findIndex(n => n.id === id);
  if (idx !== -1 && idx < ns.length - 1) return ns[idx + 1].id;
  if (idx !== -1) return null;
  for (const n of ns) {
    const f = nextSibOf(n.children || [], id);
    if (f !== undefined) return f;
  }
  return undefined;
};

export const siblingsOf = (ns, id) => {
  const idx = ns.findIndex(n => n.id === id);
  if (idx !== -1) return ns.map(n => n.id);
  for (const n of ns) {
    const f = siblingsOf(n.children || [], id);
    if (f) return f;
  }
  return null;
};

export const isFirstChild = (ns, id) => {
  for (const n of ns) {
    if (n.children?.length) {
      if (n.children[0].id === id) return true;
      if (isFirstChild(n.children, id)) return true;
    }
  }
  return false;
};

export const isLastChild = (ns, id) => {
  for (const n of ns) {
    if (n.children?.length) {
      if (n.children[n.children.length - 1].id === id) return true;
      if (isLastChild(n.children, id)) return true;
    }
  }
  return false;
};

export const setCollapsedDeep = (ns, id, collapsed) => mapN(ns, id, n => {
  const walk = (node) => ({ ...node, collapsed, children: node.children?.map(walk) || [] });
  return walk(n);
});

export const moveNodeFull = (ns, id, dir) => {
  const pid = parentOf(ns, id);
  if (dir === "up" && isFirstChild(ns, id)) {
    if (!pid) return ns;
    const prevSib = prevSibOf(ns, pid);
    if (!prevSib) return ns;
    const [without, node] = removeN(ns, id);
    return node ? insertLastChildN(without, prevSib, node) : ns;
  }
  if (dir === "down" && isLastChild(ns, id)) {
    if (!pid) return ns;
    const nextSib = nextSibOf(ns, pid);
    if (!nextSib) return ns;
    const [without, node] = removeN(ns, id);
    return node ? insertFirstChildN(without, nextSib, node) : ns;
  }
  const trySwap = arr => {
    const idx = arr.findIndex(n => n.id === id);
    if (idx !== -1) {
      const ti = dir === "up" ? idx - 1 : idx + 1;
      if (ti < 0 || ti >= arr.length) return arr;
      const cp = [...arr]; [cp[idx], cp[ti]] = [cp[ti], cp[idx]]; return cp;
    }
    return arr.map(n => ({ ...n, children: trySwap(n.children || []) }));
  };
  return trySwap(ns);
};

// Single-pass merge: remove node, adopt its children onto target, update target content
export const mergeNodes = (ns, removeId, targetId, newContent) => {
  let orphans = [];
  // Remove the node, collect its children
  const extract = arr => arr.reduce((acc, n) => {
    if (n.id === removeId) { orphans = n.children || []; return acc; }
    return [...acc, { ...n, children: extract(n.children || []) }];
  }, []);
  const without = extract(ns);
  // Update target content, adopt orphans as children
  // If target had no children before, collapse to hide the adopted ones
  return mapN(without, targetId, n => ({
    ...n, content: newContent,
    collapsed: n.children?.length ? n.collapsed : (orphans.length > 0),
    children: [...(n.children || []), ...orphans],
  }));
};

// Get highlighted node IDs (selected + their descendants)
export const getHighlighted = (tree, selIds) => {
  const out = new Set();
  selIds.forEach(id => {
    out.add(id);
    const node = findN(tree, id);
    if (node) getDescendants(node).forEach(d => out.add(d));
  });
  return out;
};

// Parse text for desktop pull options
export const parseTextForDesktop = (text, mode) => {
  let lines = [];
  if (mode === 1) {
    lines = text.split(/(?<=[.!?])\s+/).filter(l => l.trim());
  } else if (mode === 2) {
    lines = text.split(/\n\s*\n/).filter(l => l.trim());
  } else if (mode === 3) {
    lines = [text.trim()];
  } else if (mode === 4) {
    lines = text.split(/\n/).filter(l => l.trim().endsWith("?")).map(l => l.trim());
    if (!lines.length) lines = text.split(/(?<=[?])\s+/).filter(l => l.trim().endsWith("?"));
    if (!lines.length) lines = ["(No questions found)"];
  }
  return lines.map(l => ({ id: uid(), content: l.trim(), collapsed: false, children: [] }));
};

// Deduplicate and insert forged nodes into tree at target node
export const insertForgedNodes = (tree, text, targetId) => {
  let newNodes = parseIndented(text);
  if (targetId && newNodes.length) {
    const selNode = findN(tree, targetId);
    if (selNode && newNodes[0].content.trim() === selNode.content.trim()) newNodes = newNodes[0].children;
    if (selNode?.children?.length) {
      const existing = new Set(selNode.children.map(c => c.content.trim()));
      newNodes = newNodes.filter(n => !existing.has(n.content.trim()));
    }
  }
  if (!newNodes.length) return { tree, newNodes: [] };
  let result;
  if (targetId) {
    result = mapN(tree, targetId, n => ({ ...n, collapsed: false, children: [...(n.children || []), ...newNodes] }));
  } else {
    result = [...tree, ...newNodes];
  }
  return { tree: result, newNodes };
};
