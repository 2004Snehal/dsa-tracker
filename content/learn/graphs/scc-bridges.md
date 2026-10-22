**Cue:** "critical connections", "which edge/node removal disconnects the graph" (undirected) or "groups where everyone reaches everyone" (directed SCCs).

### Tarjan — bridges and articulation points

`tin[v]` = DFS entry time; `low[v]` = earliest `tin` reachable from v's subtree using one back edge.

```cpp
int timer = 0; vector<int> tin(n, -1), low(n);
vector<vector<int>> bridges;
void dfs(int v, int parent) {
    tin[v] = low[v] = timer++;
    for (int u : adj[v]) {
        if (u == parent) continue;
        if (tin[u] != -1) low[v] = min(low[v], tin[u]);       // back edge
        else {
            dfs(u, v);
            low[v] = min(low[v], low[u]);
            if (low[u] > tin[v]) bridges.push_back({v, u});   // bridge
            // articulation point: low[u] >= tin[v] (and v isn't root, or root with 2+ children)
        }
    }
}
```

With parallel edges, skip the parent **edge id**, not the parent vertex.

### Kosaraju — SCCs in two passes

1. DFS on the graph, push nodes by finish time.
2. DFS on the **reversed** graph in decreasing finish time; each tree is one SCC.

Condensing SCCs yields a DAG — then any DAG DP applies.

**Classics:** 1192, 1568, 2360 (longest cycle in functional graph), 802.
