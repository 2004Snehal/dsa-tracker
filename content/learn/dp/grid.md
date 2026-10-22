**Cue:** a matrix; you move right/down (or the answer at a cell depends on its top/left/top-left neighbours).

**State:** `dp[i][j]` = answer for the cell / for the sub-rectangle ending at `(i, j)`.

```cpp
// Unique paths with obstacles
vector<long long> dp(m, 0);
dp[0] = 1;
for (int i = 0; i < n; ++i)
    for (int j = 0; j < m; ++j) {
        if (g[i][j]) dp[j] = 0;
        else if (j) dp[j] += dp[j - 1];   // dp[j] already holds "from above"
    }
```

```cpp
// Maximal square: side of largest all-1 square with bottom-right at (i, j)
// dp[i][j] = 1 + min(top, left, top-left)
int best = 0;
vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= m; ++j)
        if (g[i-1][j-1] == '1') {
            dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
            best = max(best, dp[i][j]);
        }
```

**Tricks:**

- **1-indexed padding** (`n+1 × m+1`) removes all boundary `if`s.
- **Rolling row:** only the previous row is read, so keep `vector<int>` of size `m`. Save `dp[j-1]` from the previous row in a temp when you need the diagonal.
- **Two walkers at once** (Cherry Pickup): both move in lock-step, so state is `(step, r1, r2)` — `c = step - r` is implied.
- **Maximal rectangle:** turn each row into histogram heights, then run the monotonic stack "largest rectangle in histogram" per row.

**Classics:** 62, 63, 64, 221, 85, 174 (dungeon — fill backwards from the end), 741.
