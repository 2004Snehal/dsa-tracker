**Cue:** two strings compared character by character, or one string's substrings/subsequences (palindromes).

### Two strings: `dp[i][j]` over prefixes `s[0..i)`, `t[0..j)`

| Problem | Match `s[i-1] == t[j-1]` | Mismatch |
|---|---|---|
| LCS | `dp[i-1][j-1] + 1` | `max(dp[i-1][j], dp[i][j-1])` |
| Edit distance | `dp[i-1][j-1]` | `1 + min(ins, del, rep)` |
| Distinct subsequences (count `t` in `s`) | `dp[i-1][j-1] + dp[i-1][j]` | `dp[i-1][j]` |
| Shortest common supersequence | length `n + m − LCS` | — |

```cpp
// Edit distance
vector<vector<int>> dp(n + 1, vector<int>(m + 1));
for (int i = 0; i <= n; ++i) dp[i][0] = i;
for (int j = 0; j <= m; ++j) dp[0][j] = j;
for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= m; ++j)
        dp[i][j] = s[i-1] == t[j-1] ? dp[i-1][j-1]
                 : 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
```

### One string: palindromes

- **Longest palindromic substring** — expand around each of the `2n−1` centres: O(n²) time, O(1) space. Simpler than the DP table.
- **Manacher** gives O(n) if needed (n ≥ 10^5).
- **Longest palindromic subsequence** = `LCS(s, reverse(s))`, or interval DP `dp[l][r]`.
- **Min insertions to make palindrome** = `n − LPS`.
- **Palindrome partitioning (min cuts)** — precompute `isPal[l][r]`, then `cut[i] = min(cut[l-1] + 1)` over palindromic `s[l..i]`.

```cpp
// Expand around centre
int start = 0, len = 0;
auto expand = [&](int l, int r) {
    while (l >= 0 && r < n && s[l] == s[r]) --l, ++r;
    if (r - l - 1 > len) start = l + 1, len = r - l - 1;
};
for (int i = 0; i < n; ++i) expand(i, i), expand(i, i + 1);
return s.substr(start, len);
```

**Classics:** 1143, 72, 115, 1092, 5, 516, 1312, 132, 10 (regex), 44 (wildcard).
