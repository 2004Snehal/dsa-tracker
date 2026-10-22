**Cue:** choose items with a weight/cost to hit or stay under a capacity; maximise value or count ways.

| Variant | Loop order over capacity | Each item used |
|---|---|---|
| 0/1 knapsack | **descending** `c = W..w` | at most once |
| Unbounded | **ascending** `c = w..W` | any number |
| Bounded (≤ k copies) | binary-split into 1, 2, 4… groups, then 0/1 | ≤ k |
| Group (pick one per group, e.g. dice) | new array per group | one per group |

```cpp
// 0/1: max value with capacity W
vector<int> dp(W + 1, 0);
for (auto [w, v] : items)
    for (int c = W; c >= w; --c)          // descending: item counted once
        dp[c] = max(dp[c], dp[c - w] + v);
```

```cpp
// Unbounded, count combinations (coin change II): items outer, capacity inner
vector<long long> ways(W + 1, 0); ways[0] = 1;
for (int coin : coins)
    for (int c = coin; c <= W; ++c)       // ascending: reuse allowed
        ways[c] += ways[c - coin];
// Swap the loops (capacity outer) and you count PERMUTATIONS instead (LC 377).
```

```cpp
// Group knapsack — Number of Dice Rolls With Target Sum (n dice, faces 1..k)
vector<long long> dp(target + 1, 0); dp[0] = 1;
for (int d = 0; d < n; ++d) {
    vector<long long> nd(target + 1, 0);
    for (int s = 1; s <= target; ++s)
        for (int f = 1; f <= k && f <= s; ++f)
            nd[s] = (nd[s] + dp[s - f]) % MOD;
    dp.swap(nd);
}
// O(n·target·k). Prefix sums over dp make the inner loop O(1).
```

**Reductions to know:**

- **Partition equal subset sum** → 0/1 subset-sum to `total / 2`. Use `bitset<N> b; b |= b << x;` for a 64× speed-up.
- **Target sum (+/−)** → subset with sum `(total + target) / 2`.
- **Last stone weight II** → subset closest to `total / 2`.
- **Ones and zeroes** → 0/1 knapsack with two capacities.

**Classics:** 416, 494, 322, 518, 377, 474, 1049, 1155.
