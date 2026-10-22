**Cue:** connect all nodes with minimum total edge cost.

### Kruskal — sort edges, add if they join two components

```cpp
sort(edges.begin(), edges.end());              // {w, u, v}
DSU dsu(n);
long long cost = 0; int used = 0;
for (auto [w, u, v] : edges)
    if (dsu.unite(u, v)) { cost += w; if (++used == n - 1) break; }
```

### Prim — grow from one node; better for dense graphs

For **complete graphs** (Min Cost to Connect All Points, all pairs connected), the O(V²) array version beats building V² edges:

```cpp
vector<int> best(n, INT_MAX); vector<bool> in(n);
best[0] = 0; long long cost = 0;
for (int it = 0; it < n; ++it) {
    int u = -1;
    for (int v = 0; v < n; ++v) if (!in[v] && (u == -1 || best[v] < best[u])) u = v;
    in[u] = true; cost += best[u];
    for (int v = 0; v < n; ++v) if (!in[v]) best[v] = min(best[v], dist(u, v));
}
```

### Critical and pseudo-critical edges

For each edge `e`:

- **Critical** — MST weight **without** `e` is larger (or the graph disconnects).
- **Pseudo-critical** — not critical, and an MST **forced to include** `e` first still has the optimal weight.

That's 2 Kruskal runs per edge: O(E² α) — fine for E ≤ 200.

**MST facts:** the MST minimises the maximum edge too (minimax path between any two nodes lies on it). With distinct weights the MST is unique.

**Classics:** 1584, 1489, 1135, 1168 (virtual node for wells).
