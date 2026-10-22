**Cue:** a graph with no cycles (explicit DAG, or a grid where you can only move to strictly larger values). The answer at a node depends on its successors.

**Key fact:** any DP is a shortest/longest path on the DAG of states. If the dependency graph is a DAG, either:

1. **Memoised DFS** — simplest; order comes for free.
2. **Topological order (Kahn)** — iterative, no recursion depth issues, and also detects cycles.

```cpp
// Longest Increasing Path in a Matrix — memo DFS. Strict increase => no cycles.
int n, m; vector<vector<int>> g, memo;
int dirs[5] = {0, 1, 0, -1, 0};
int dfs(int r, int c) {
    if (memo[r][c]) return memo[r][c];
    int best = 1;
    for (int d = 0; d < 4; ++d) {
        int nr = r + dirs[d], nc = c + dirs[d + 1];
        if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] > g[r][c])
            best = max(best, 1 + dfs(nr, nc));
    }
    return memo[r][c] = best;
}
```

```cpp
// Same idea with Kahn: longest path / earliest finish time (Parallel Courses III)
queue<int> q;
vector<long long> finish(n);
for (int v = 0; v < n; ++v) if (!indeg[v]) q.push(v), finish[v] = t[v];
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) {
        finish[v] = max(finish[v], finish[u] + t[v]);
        if (--indeg[v] == 0) q.push(v);
    }
}
```

**When it's not a DAG** (cycles possible): memo DFS is wrong. Use shortest-path algorithms (Dijkstra / Bellman-Ford) or condense SCCs first, then DP on the condensed DAG.

**Classics:** 329, 2050, 1857 (largest colour value — DP over 26 colours along topo order), 797, 1976 (count shortest paths).
