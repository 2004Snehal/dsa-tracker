**Cue:** a sequence; the answer at position `i` depends on a few earlier positions (`i-1`, `i-2`, or "best so far").

**State:** `dp[i]` = best answer for the prefix ending at / using up to `i`. Add a small second dimension when position alone isn't enough (lane, last action, parity).

| Problem | State | Transition |
|---|---|---|
| Climbing stairs | `dp[i]` ways to reach step `i` | `dp[i-1] + dp[i-2]` |
| House robber | `dp[i]` best using first `i` houses | `max(dp[i-1], dp[i-2] + a[i])` |
| Max subarray (Kadane) | `cur` best ending at `i` | `max(a[i], cur + a[i])` |
| Minimum sideway jumps | `dp[lane]` at point `i` | stay, or jump from best lane +1 |
| Decode ways | `dp[i]` ways for first `i` chars | single digit + valid two digits |

```cpp
// Kadane — max subarray sum, O(n), O(1)
long long best = LLONG_MIN, cur = 0;
for (int x : a) { cur = max<long long>(x, cur + x); best = max(best, cur); }
```

```cpp
// Small extra dimension: dp over (position, lane) — e.g. Minimum Sideway Jumps
array<int, 3> dp = {1, 0, 1};
for (int i = 1; i < n; ++i) {
    for (int l = 0; l < 3; ++l) if (obs[i] == l + 1) dp[l] = INF;
    int best = *min_element(dp.begin(), dp.end());
    for (int l = 0; l < 3; ++l) if (obs[i] != l + 1) dp[l] = min(dp[l], best + 1);
}
```

**Speed-ups:** when `dp[i] = min(dp[j]) + cost` over a sliding range of `j`, use a **monotonic deque** (O(n)) instead of scanning (O(nk)). When it's over all `j < i` with a condition on values, use a **Fenwick / segment tree** keyed by value.

**Classics:** 70, 198, 213, 53, 91, 1824, 1696 (deque-optimised).
