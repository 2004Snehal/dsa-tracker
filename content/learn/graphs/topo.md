**Cue:** dependencies / prerequisites in a **directed** graph; "is there a valid order", "detect a cycle", longest path in a DAG.

### Kahn's algorithm (BFS)

```cpp
vector<int> indeg(n), order;
for (int u = 0; u < n; ++u) for (int v : adj[u]) ++indeg[v];
queue<int> q;
for (int v = 0; v < n; ++v) if (!indeg[v]) q.push(v);
while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
bool hasCycle = order.size() < n;
```

### DFS with three colours

`0` = unvisited, `1` = on the current path, `2` = done. Reaching a `1` node means a back edge, which means a cycle. Reverse post-order is a topological order.

```cpp
vector<int> color(n);
bool dfs(int u) {                // returns true if a cycle is found
    color[u] = 1;
    for (int v : adj[u]) {
        if (color[v] == 1) return true;
        if (color[v] == 0 && dfs(v)) return true;
    }
    color[u] = 2;
    order.push_back(u);          // reverse at the end
    return false;
}
```

### Variations

- **Eventual Safe States** — a node is safe if every path leads to a terminal. Reverse the edges and run Kahn from the terminals; every node popped is safe. (Or: three-colour DFS; nodes that end as `2` without hitting a cycle are safe.)
- **DP along the order** — earliest finish time (Parallel Courses III), longest path, max colour count on a path.
- **Lexicographically smallest order** — replace the queue with a min-heap.
- **Unique order?** — the queue never holds more than one node.
- **Hidden graph** (Strange Printer II, Alien Dictionary) — build edges "X must come before Y" from the input, then check for a cycle.

**Classics:** 207, 210, 802, 2050, 1591, 269, 1203, 310 (leaf-trimming variant).
