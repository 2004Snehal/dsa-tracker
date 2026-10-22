Most graph problems reduce to picking the right traversal for the edge weights and the question.

| Question | Edge weights | Tool | Complexity |
|---|---|---|---|
| Reachability, components, flood fill | — | BFS / DFS | O(V + E) |
| Fewest edges | unweighted | BFS | O(V + E) |
| Shortest path | 0 or 1 | 0-1 BFS (deque) | O(V + E) |
| Shortest path | non-negative | Dijkstra | O(E log V) |
| Shortest path with ≤ k edges, or negative weights | any | Bellman-Ford | O(k · E) |
| All pairs, V ≤ ~400 | any (no neg. cycle) | Floyd-Warshall | O(V³) |
| Order with dependencies, cycle check in directed graph | — | Topological sort | O(V + E) |
| Dynamic connectivity, cycle in undirected graph | — | DSU | ~O(α(n)) per op |
| Cheapest way to connect everything | weighted | Kruskal / Prim | O(E log E) |
| Two-colourable? | — | BFS colouring | O(V + E) |
| Critical edges / nodes, SCCs | — | Tarjan / Kosaraju | O(V + E) |

## Modelling tips

- **Grid = graph.** Cells are nodes, 4 neighbours are edges. Use `int dirs[5] = {0,1,0,-1,0}`.
- **Implicit graphs.** Word Ladder: nodes are words, edges are one-letter changes — generate neighbours by mutating each position instead of comparing all pairs.
- **Graph on groups.** Bus Routes: BFS over **routes**, not stops; or BFS over stops but mark each route used once.
- **Multi-source BFS.** Push all sources at distance 0 (rotting oranges, distance to nearest 0).
- **State-expanded graph.** When the cost depends on extra info (stops used, keys held, fuel), the node is `(vertex, extra)`.
- **Reverse the graph** when the question is "which nodes can reach X" (Eventual Safe States).

## Common mistakes

- Marking visited **when popping** in BFS instead of when pushing → duplicates in the queue, TLE.
- Dijkstra: forgetting `if (d > dist[u]) continue;` → stale entries reprocessed.
- `int` overflow on path sums; use `long long` and an `INF` like `1e18`.
- Undirected graph in DSU/DFS: add both directions.
