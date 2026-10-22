**Cue:** shortest path where every edge costs **0 or 1** — "free move vs. paid move", "follow the arrow vs. change it", "remove an obstacle".

**Idea:** Dijkstra, but a deque replaces the heap. 0-edges go to the **front** (same distance), 1-edges to the **back** (distance + 1). The deque stays sorted, so it's O(V + E).

```cpp
// Minimum Cost to Make at Least One Valid Path in a Grid
// cell value 1..4 = right, left, down, up. Following the arrow is free, changing it costs 1.
int dr[] = {0, 0, 1, -1}, dc[] = {1, -1, 0, 0};
vector<vector<int>> dist(n, vector<int>(m, INT_MAX));
deque<pair<int,int>> dq;
dist[0][0] = 0; dq.push_front({0, 0});
while (!dq.empty()) {
    auto [r, c] = dq.front(); dq.pop_front();
    for (int d = 0; d < 4; ++d) {
        int nr = r + dr[d], nc = c + dc[d];
        if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
        int w = (grid[r][c] - 1 == d) ? 0 : 1;
        if (dist[r][c] + w < dist[nr][nc]) {
            dist[nr][nc] = dist[r][c] + w;
            w ? dq.push_back({nr, nc}) : dq.push_front({nr, nc});
        }
    }
}
return dist[n-1][m-1];
```

Unlike plain BFS, a node can be relaxed more than once, so check `dist` (not a `visited` flag) on push.

**Classics:** 1368, 2290, 1824 (as a graph), 1263.
