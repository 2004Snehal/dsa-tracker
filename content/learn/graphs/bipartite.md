**Cue:** split nodes into two groups with every edge crossing between them — "two teams with no conflicts", "possible bipartition", 2-colouring.

A graph is bipartite **iff it has no odd cycle**. BFS-colour each component; a same-coloured edge proves it isn't.

```cpp
vector<int> color(n, -1);
for (int s = 0; s < n; ++s) if (color[s] == -1) {       // graph may be disconnected
    queue<int> q; q.push(s); color[s] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (color[v] == -1) color[v] = color[u] ^ 1, q.push(v);
            else if (color[v] == color[u]) return false;
        }
    }
}
return true;
```

**DSU alternative:** for every node `u`, union all of its neighbours together; if `u` ever ends up in the same set as a neighbour, it's not bipartite.

**Extensions:** max groups with adjacent groups differing by 1 (LC 2493) — check bipartite, then BFS from every node for the max depth per component.

**Classics:** 785, 886, 2493, 1042 (greedy colouring, not bipartite).
