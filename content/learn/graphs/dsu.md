**Cue:** merge groups, ask "are these connected?", detect a cycle in an **undirected** graph, count components while edges are added, Kruskal's MST.

```cpp
struct DSU {
    vector<int> p, sz;
    DSU(int n) : p(n), sz(n, 1) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }   // path compression
    bool unite(int a, int b) {
        a = find(a), b = find(b);
        if (a == b) return false;                                    // already connected
        if (sz[a] < sz[b]) swap(a, b);                               // union by size
        p[b] = a; sz[a] += sz[b];
        return true;
    }
};
```

Both optimisations together give amortised O(α(n)) ≈ constant per operation.

### Uses

- **Redundant Connection** — the first edge where `unite` returns `false` closes a cycle.
- **Number of components** — start at `n`, subtract 1 per successful `unite`.
- **Offline queries sorted by threshold** — sort edges and queries by weight, add edges up to each query's limit (LC 1697).
- **Grid as DSU** — id = `r * m + c`.
- **Grouping by shared attribute** — union each item with the first item seen with the same email/value (Accounts Merge).
- **Min-max path** — add edges in increasing weight until `find(s) == find(t)`.

DSU can't delete edges. If the problem removes edges, process it **in reverse** as additions.

**Classics:** 684, 685, 547, 721, 1697, 1631, 778, 990, 952.
