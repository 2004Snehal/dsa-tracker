**Cue:** longest chain where each element must be "bigger" than the previous — subsequences, nesting boxes/envelopes, chains of pairs.

### O(n²) DP

`dp[i]` = length of the LIS ending at `i` = `1 + max(dp[j])` over `j < i` with `a[j] < a[i]`. Fine for `n ≤ 5000`, and the only option when you also need **count** of LISs (LC 673) without extra structures.

### O(n log n) — patience sorting

Keep `tails[k]` = the **smallest possible tail** of an increasing subsequence of length `k+1`. `tails` is always sorted, so each element binary-searches its slot.

```cpp
int lengthOfLIS(vector<int>& a) {
    vector<int> tails;
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x); // strictly increasing
        if (it == tails.end()) tails.push_back(x);
        else *it = x;                                           // better (smaller) tail
    }
    return tails.size();
}
```

| Want | Use |
|---|---|
| Strictly increasing | `lower_bound` |
| Non-decreasing | `upper_bound` |
| Longest decreasing | negate values, or run on reversed comparator |

> `tails` is **not** an actual LIS — only its length is right. To reconstruct, store for each element the index it replaced and a `parent[i]` pointing to the element at `tails[k-1]` when `i` was placed.

```cpp
// Reconstruction
vector<int> tailIdx, parent(n, -1);
for (int i = 0; i < n; ++i) {
    int k = lower_bound(tailIdx.begin(), tailIdx.end(), a[i],
                        [&](int idx, int v) { return a[idx] < v; }) - tailIdx.begin();
    if (k) parent[i] = tailIdx[k - 1];
    if (k == (int)tailIdx.size()) tailIdx.push_back(i); else tailIdx[k] = i;
}
vector<int> lis;
for (int i = tailIdx.back(); i != -1; i = parent[i]) lis.push_back(a[i]);
reverse(lis.begin(), lis.end());
```

### 2D LIS — Russian Doll Envelopes

Sort by width **ascending**, and for equal widths by height **descending**; then LIS on heights. The descending tie-break makes equal-width envelopes impossible to chain, because their heights now decrease.

```cpp
sort(env.begin(), env.end(), [](auto& a, auto& b) {
    return a[0] != b[0] ? a[0] < b[0] : a[1] > b[1];
});
// then lengthOfLIS on env[i][1]
```

### Related reductions

- **Minimum deletions to make sorted** = `n − LNDS`.
- **Minimum number of non-decreasing sequences to cover the array** = length of the longest **strictly decreasing** subsequence (Dilworth).
- **LCS of two permutations** → map one into indices of the other, then LIS — O(n log n) instead of O(n²).
- **Longest bitonic** → LIS from left + LIS from right − 1 at each index.
- **Make array strictly increasing with k-spaced constraints** (LC 2111) → LNDS on each residue class.

**Classics:** 300, 354, 673, 1964, 1671, 2111, 646.
