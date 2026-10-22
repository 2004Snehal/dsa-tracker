**Cue:** the answer for a range `[l, r]` comes from splitting it at some `k`, or from removing an end. Merging stones, bursting balloons, matrix-chain multiplication, "cost to cut a stick".

**State:** `dp[l][r]` = best answer for the subarray `l..r`.
**Order:** by increasing length — every sub-interval is shorter, so it's already computed.

```cpp
// Generic split DP: O(n^3)
for (int len = 2; len <= n; ++len)
    for (int l = 0; l + len - 1 < n; ++l) {
        int r = l + len - 1;
        dp[l][r] = INF;
        for (int k = l; k < r; ++k)
            dp[l][r] = min(dp[l][r], dp[l][k] + dp[k+1][r] + cost(l, r));
    }
```

### The "last action" trick

For **Burst Balloons**, choosing which balloon to burst *first* makes subproblems depend on each other. Instead choose `k` = the balloon burst **last** in `(l, r)`: its neighbours at that time are exactly `l` and `r`, so the two sides become independent.

```cpp
// Burst Balloons — pad with 1s, open interval (l, r)
a.insert(a.begin(), 1); a.push_back(1);
int n = a.size();
vector<vector<int>> dp(n, vector<int>(n, 0));
for (int len = 2; len < n; ++len)
    for (int l = 0; l + len < n; ++l) {
        int r = l + len;
        for (int k = l + 1; k < r; ++k)
            dp[l][r] = max(dp[l][r], dp[l][k] + dp[k][r] + a[l] * a[k] * a[r]);
    }
return dp[0][n - 1];
```

The same "last cut / last merge" view fixes Minimum Cost to Cut a Stick (sort cut positions, add `0` and `n` as ends) and Strange Printer.

**Speed-up:** when the optimal split point is monotone (`opt[l][r-1] ≤ opt[l][r] ≤ opt[l+1][r]`), **Knuth's optimisation** brings O(n³) to O(n²).

**Classics:** 312, 1547, 664, 1000, 375, 1039, 516.
