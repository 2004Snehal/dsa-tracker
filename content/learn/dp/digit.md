**Cue:** count numbers in `[L, R]` (R up to 10^18) satisfying a property of their **digits** — digit sum, no repeated digits, count of a digit, divisibility.

**Approach:** `count(R) − count(L − 1)`. Build the number from the most significant digit, tracking:

- `pos` — current digit index
- `tight` — still equal to the prefix of the bound? (limits the next digit)
- `started` — have we placed a non-zero digit yet? (for leading zeros)
- whatever the property needs (sum so far, mask of used digits, remainder…)

```cpp
string s; long long memo[20][2][2][SUM];   // memo only when !tight usually suffices
long long go(int pos, bool tight, bool started, int sum) {
    if (pos == (int)s.size()) return started && ok(sum);
    long long &r = memo[pos][tight][started][sum];
    if (r != -1) return r;
    r = 0;
    int lim = tight ? s[pos] - '0' : 9;
    for (int d = 0; d <= lim; ++d)
        r += go(pos + 1, tight && d == lim, started || d, started || d ? sum + d : 0);
    return r;
}
long long count(long long x) { s = to_string(x); memset(memo, -1, sizeof memo); return go(0, 1, 0, 0); }
```

**Bit version:** the same idea on binary digits counts "how many numbers ≤ x have bit `i` set" — useful with **binary search on the answer** (LC 3007: price sum ≤ k). There, a closed form per bit is simpler: in `[0, x]`, bit `i` is set in `(x+1) / 2^{i+1} · 2^i + max(0, (x+1) % 2^{i+1} − 2^i)` numbers.

**Classics:** 233, 902, 1012, 357, 600, 2376, 2719, 3007.
