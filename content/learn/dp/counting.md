**Cue:** "number of ways … modulo 10^9+7". Often the state is (items placed, some count) and the transition is a combinatorial choice.

**Rules of thumb:**

- Decide how the **new element** enters: as a new group, appended to an existing group, at a specific position.
- `long long` for the multiply, `% MOD` after every addition.
- If the recurrence is a known one (Catalan, Stirling, binomial), a closed form may skip the DP.

### Stirling numbers of the first kind — Rearrange Sticks With K Visible

Insert the **shortest** stick into an arrangement of the other `n−1`. At the front it's visible and blocks nobody (`dp[n-1][k-1]`). In any of the other `n−1` slots it's hidden behind a taller stick and still blocks nobody (`(n−1)·dp[n-1][k]`).

```cpp
// dp[i][j] = ways with i sticks and j visible
dp[0][0] = 1;
for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= min(i, k); ++j)
        dp[i][j] = (dp[i-1][j-1] + (long long)(i - 1) * dp[i-1][j]) % MOD;
```

### Binomial shortcut — Ways to Reach a Position in k Steps

`r` right steps and `l` left steps with `r + l = k`, `r − l = d` → `r = (k + d) / 2`. Answer is `C(k, r)` if parity and range work, else 0. Precompute factorials + inverse factorials for O(1) per query:

```cpp
const int MOD = 1e9 + 7;
long long power(long long b, long long e) { long long r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }
vector<long long> f(N + 1, 1), inv(N + 1, 1);
for (int i = 1; i <= N; ++i) f[i] = f[i-1] * i % MOD;
inv[N] = power(f[N], MOD - 2);
for (int i = N; i > 0; --i) inv[i-1] = inv[i] * i % MOD;
auto C = [&](int n, int r) { return r < 0 || r > n ? 0 : f[n] * inv[r] % MOD * inv[n-r] % MOD; };
```

### Counting subsequences

"Number of subsequences of pattern X" — keep one counter per **prefix of the pattern** matched so far; each new character either extends a count or is skipped. See *State Machine DP* for the 0→1→2 version.

**Classics:** 1866, 2400, 62, 96 (Catalan), 1220, 935, 790, 629.
