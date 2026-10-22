**Cue:** `n ≤ 20` (sometimes ≤ 16), and you need to remember **which** items are used — assignments, visiting all nodes, partitions into groups.

**State:** `dp[mask]` or `dp[mask][last]`. 2^20 ≈ 10^6 masks; with an extra `n` factor, 2^n·n² must stay ≈ 10^8.

```cpp
// TSP / shortest path visiting all nodes: dp[mask][v] = min cost to visit mask, ending at v
vector<vector<int>> dp(1 << n, vector<int>(n, INF));
for (int v = 0; v < n; ++v) dp[1 << v][v] = 0;
for (int mask = 1; mask < (1 << n); ++mask)
    for (int v = 0; v < n; ++v) if (dp[mask][v] < INF && (mask >> v & 1))
        for (int u = 0; u < n; ++u) if (!(mask >> u & 1))
            dp[mask | 1 << u][u] = min(dp[mask | 1 << u][u], dp[mask][v] + w[v][u]);
```

```cpp
// Iterate all submasks of mask: total O(3^n) over all masks
for (int sub = mask; sub; sub = (sub - 1) & mask) { /* ... */ }
```

**Bit idioms:** `__builtin_popcount(m)`, lowest bit `m & -m`, `__builtin_ctz(m)` index of lowest bit, remove lowest bit `m & (m - 1)`.

**Assignment trick:** when assigning items to people in order, the number of the next person = `popcount(mask)`, so you don't need it in the state (LC 1879).

**Classics:** 847, 1879, 698, 1986, 526, 1434, 943.
