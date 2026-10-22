**Cue:** reachability, connected components, flood fill, shortest path in **unweighted** graphs, level-by-level processing.

```cpp
// BFS shortest distance from src in an unweighted graph
vector<int> dist(n, -1);
queue<int> q; q.push(src); dist[src] = 0;
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) if (dist[v] == -1) {
        dist[v] = dist[u] + 1;      // mark on push
        q.push(v);
    }
}
```

```cpp
// Grid BFS, multi-source
queue<pair<int,int>> q;
for (int r = 0; r < n; ++r) for (int c = 0; c < m; ++c)
    if (isSource(r, c)) q.push({r, c}), dist[r][c] = 0;
int dirs[5] = {0, 1, 0, -1, 0};
while (!q.empty()) {
    auto [r, c] = q.front(); q.pop();
    for (int d = 0; d < 4; ++d) {
        int nr = r + dirs[d], nc = c + dirs[d + 1];
        if (nr < 0 || nr >= n || nc < 0 || nc >= m || dist[nr][nc] != -1 || blocked(nr, nc)) continue;
        dist[nr][nc] = dist[r][c] + 1;
        q.push({nr, nc});
    }
}
```

### Word Ladder — implicit neighbours

Generate neighbours by replacing each character with `a..z` and checking a `unordered_set` of words. Erase a word from the set when it's pushed (acts as `visited`). **Bidirectional BFS** — expand the smaller frontier each time — cuts the search dramatically.

### Bus Routes — BFS over routes

Map `stop → routes`. BFS where one "step" = take one route: pop a route, visit all its stops, enqueue every unused route through those stops. Mark both stops and routes visited, or it degrades to O(routes²·stops).

**DFS uses:** connected components, cycle detection, path existence, backtracking on grids (Word Search). For deep graphs (10^5 nodes in a line) prefer iterative DFS or BFS.

**Classics:** 200, 994, 542, 127, 815, 1091, 286, 133, 417.
