### Dijkstra — non-negative weights

```cpp
vector<long long> dist(n, LLONG_MAX);
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
dist[src] = 0; pq.push({0, src});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;                 // stale entry
    for (auto [v, w] : adj[u])
        if (d + w < dist[v]) dist[v] = d + w, pq.push({dist[v], v});
}
```

**Change the combine operator, keep the algorithm.** Dijkstra works for any path cost that never gets better as the path grows:

| Problem | Path cost | Relax with | Heap |
|---|---|---|---|
| Network Delay Time | sum | `d + w` | min |
| Path With Minimum Effort | max edge on path | `max(d, |h[u]−h[v]|)` | min |
| Swim in Rising Water | max cell on path | `max(d, grid[v])` | min |
| Path with Maximum Probability | product | `d * p` | **max** |

The "minimise the maximum edge" problems also fall to **binary search on the answer + BFS**, or to **DSU**: add edges in increasing weight until source and target connect.

### Bellman-Ford — at most k edges

Cheapest Flights Within K Stops: Dijkstra's greedy order breaks when the number of edges is limited. Relax all edges `k+1` times, **copying** the array each round so one round = one more edge.

```cpp
vector<int> dist(n, INT_MAX); dist[src] = 0;
for (int i = 0; i <= k; ++i) {
    vector<int> nd = dist;                     // copy: limits to one edge per round
    for (auto& f : flights) {
        int u = f[0], v = f[1], w = f[2];
        if (dist[u] != INT_MAX && dist[u] + w < nd[v]) nd[v] = dist[u] + w;
    }
    dist.swap(nd);
}
```

A **V-th** round that still relaxes something means a negative cycle.

### Floyd-Warshall — all pairs

```cpp
// d[i][j] initialised to w(i,j), 0 on diagonal, INF otherwise
for (int k = 0; k < n; ++k)                    // k MUST be outermost
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            if (d[i][k] < INF && d[k][j] < INF) d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
```

Use when `n ≤ ~400` and you need every pair (Find the City With the Smallest Number of Neighbours). Otherwise run Dijkstra from each node.

**Classics:** 743, 1631, 778, 1514, 787, 1334, 1976, 882.
