// Sections and patterns. Ids here are used by data/overrides.json and by the
// notes in content/learn/<section>/<pattern>.md.

export type Pattern = { id: string; name: string };
export type Section = { id: string; name: string; short: string; patterns: Pattern[] };

export const SECTIONS: Section[] = [
  {
    id: "dp",
    name: "Dynamic Programming",
    short: "DP",
    patterns: [
      { id: "linear", name: "1D / Linear DP" },
      { id: "grid", name: "2D Grid DP" },
      { id: "knapsack", name: "Knapsack" },
      { id: "lis", name: "Longest Increasing Subsequence" },
      { id: "strings", name: "String DP (LCS, Edit Distance, Palindromes)" },
      { id: "interval", name: "Interval DP" },
      { id: "counting", name: "Counting & Combinatorics DP" },
      { id: "dag", name: "DP on DAGs / Memo on Graphs" },
      { id: "state-machine", name: "State Machine DP" },
      { id: "bitmask", name: "Bitmask DP" },
      { id: "digit", name: "Digit DP" },
      { id: "tree", name: "Tree DP & Rerooting" },
    ],
  },
  {
    id: "graphs",
    name: "Graphs",
    short: "Graphs",
    patterns: [
      { id: "bfs-dfs", name: "BFS / DFS Traversal" },
      { id: "zero-one-bfs", name: "0-1 BFS" },
      { id: "shortest-path", name: "Shortest Paths" },
      { id: "topo", name: "Topological Sort" },
      { id: "dsu", name: "Disjoint Set Union" },
      { id: "mst", name: "Minimum Spanning Tree" },
      { id: "bipartite", name: "Bipartite / Graph Coloring" },
      { id: "scc-bridges", name: "SCC, Bridges & Articulation Points" },
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    short: "Bin. Search",
    patterns: [
      { id: "bounds", name: "lower_bound / upper_bound" },
      { id: "on-answer", name: "Binary Search on Answer" },
      { id: "peak-rotated", name: "Peaks & Rotated Arrays" },
      { id: "partition", name: "Partition Search (Two Arrays)" },
    ],
  },
  {
    id: "window",
    name: "Two Pointers & Sliding Window",
    short: "Window",
    patterns: [
      { id: "two-pointers", name: "Two Pointers" },
      { id: "fixed", name: "Fixed Window" },
      { id: "variable", name: "Variable Window" },
    ],
  },
  {
    id: "stack-queue",
    name: "Stack, Queue & Monotonic",
    short: "Stack",
    patterns: [
      { id: "monotonic-stack", name: "Monotonic Stack" },
      { id: "monotonic-deque", name: "Monotonic Deque" },
      { id: "stack", name: "Stack Simulation" },
    ],
  },
  {
    id: "trees",
    name: "Trees",
    short: "Trees",
    patterns: [
      { id: "traversal", name: "Traversals" },
      { id: "level-order", name: "Level Order (BFS)" },
      { id: "bst", name: "BST" },
      { id: "lca", name: "LCA" },
    ],
  },
  { id: "heap", name: "Heap / Priority Queue", short: "Heap", patterns: [{ id: "top-k", name: "Top K" }, { id: "two-heaps", name: "Two Heaps" }, { id: "k-way", name: "K-way Merge" }] },
  { id: "trie", name: "Trie", short: "Trie", patterns: [{ id: "trie", name: "Trie" }] },
  { id: "linked-list", name: "Linked List", short: "List", patterns: [{ id: "reversal", name: "Reversal" }, { id: "fast-slow", name: "Fast & Slow Pointers" }] },
  {
    id: "arrays",
    name: "Arrays & Hashing",
    short: "Arrays",
    patterns: [
      { id: "hashing", name: "Hashing" },
      { id: "prefix-sum", name: "Prefix Sum" },
      { id: "cyclic-sort", name: "Cyclic Sort / Index as Hash" },
    ],
  },
  { id: "greedy", name: "Greedy", short: "Greedy", patterns: [{ id: "greedy", name: "Greedy" }, { id: "intervals", name: "Intervals" }] },
  { id: "backtracking", name: "Backtracking", short: "Backtrack", patterns: [{ id: "backtracking", name: "Backtracking" }] },
  { id: "math", name: "Math & Bit Manipulation", short: "Math/Bits", patterns: [{ id: "bits", name: "Bit Tricks" }, { id: "math", name: "Math" }] },
  {
    id: "sql",
    name: "SQL",
    short: "SQL",
    patterns: [
      { id: "select", name: "Select & Filter" },
      { id: "joins", name: "Joins" },
      { id: "aggregation", name: "Group By & Aggregation" },
    ],
  },
];

export const sectionById = (id: string) => SECTIONS.find((s) => s.id === id);
export const patternName = (section: string, pattern?: string | null) =>
  sectionById(section)?.patterns.find((p) => p.id === pattern)?.name ?? null;

// Auto-classification for problems without an override. First matching rule wins,
// so specific techniques come before broad tags.
const RULES: [tag: string, section: string, pattern: string | null][] = [
  ["database", "sql", null],
  ["longest-increasing-subsequence", "dp", "lis"],
  ["longest-common-subsequence", "dp", "strings"],
  ["knapsack-problem", "dp", "knapsack"],
  ["bitmask", "dp", "bitmask"],
  ["0-1-bfs", "graphs", "zero-one-bfs"],
  ["topological-sort", "graphs", "topo"],
  ["minimum-spanning-tree", "graphs", "mst"],
  ["shortest-path", "graphs", "shortest-path"],
  ["dijkstra", "graphs", "shortest-path"],
  ["bipartite-graph", "graphs", "bipartite"],
  ["strongly-connected-component", "graphs", "scc-bridges"],
  ["biconnected-component", "graphs", "scc-bridges"],
  ["union-find", "graphs", "dsu"],
  ["trie", "trie", "trie"],
  ["dynamic-programming", "dp", null],
  ["memoization", "dp", null],
  ["graph", "graphs", "bfs-dfs"],
  ["monotonic-stack", "stack-queue", "monotonic-stack"],
  ["monotonic-queue", "stack-queue", "monotonic-deque"],
  ["binary-search", "binary-search", null],
  ["sliding-window", "window", "variable"],
  ["two-pointers", "window", "two-pointers"],
  ["binary-search-tree", "trees", "bst"],
  ["tree", "trees", null],
  ["binary-tree", "trees", null],
  ["heap-priority-queue", "heap", null],
  ["linked-list", "linked-list", null],
  ["backtracking", "backtracking", "backtracking"],
  ["prefix-sum", "arrays", "prefix-sum"],
  ["greedy", "greedy", "greedy"],
  ["bit-manipulation", "math", "bits"],
  ["stack", "stack-queue", "stack"],
  ["breadth-first-search", "graphs", "bfs-dfs"],
  ["depth-first-search", "graphs", "bfs-dfs"],
  ["math", "math", "math"],
  ["hash-table", "arrays", "hashing"],
];

export function classify(tags: string[]): { section: string; pattern: string | null } {
  for (const [tag, section, pattern] of RULES) if (tags.includes(tag)) return { section, pattern };
  return { section: "arrays", pattern: null };
}
