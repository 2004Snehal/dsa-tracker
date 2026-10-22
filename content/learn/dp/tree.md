**Cue:** a tree, and the answer for a subtree depends on its children's answers.

**State:** `dp[v][state]` computed in post-order DFS. Common states: "v is taken / not taken", "v has a camera / is covered / not covered", "longest downward path from v".

```cpp
// House Robber III — pair{rob v, skip v}
pair<int,int> dfs(TreeNode* v) {
    if (!v) return {0, 0};
    auto [lr, ls] = dfs(v->left);
    auto [rr, rs] = dfs(v->right);
    return {v->val + ls + rs, max(lr, ls) + max(rr, rs)};
}
```

```cpp
// Diameter: at each node, best two downward depths through it
int diameter = 0;
int depth(int v, int p) {
    int a = 0, b = 0;                      // top two child depths
    for (int u : adj[v]) if (u != p) {
        int d = 1 + depth(u, v);
        if (d > a) b = a, a = d; else if (d > b) b = d;
    }
    diameter = max(diameter, a + b);
    return a;
}
```

### Rerooting — answer for every node as root, O(n)

1. DFS 1 (post-order): `down[v]` = answer within v's subtree.
2. DFS 2 (pre-order): `up[u]` = answer from the part of the tree *outside* u's subtree, built from `up[parent]` and the siblings' `down`.

```cpp
// Sum of distances in tree (LC 834)
// down: cnt[v] = subtree size, res[root] = sum of depths
// reroot: res[u] = res[v] - cnt[u] + (n - cnt[u])   for child u of v
```

**Classics:** 337, 543, 124, 968, 834, 310, 2246.
