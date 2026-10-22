DP = recursion over a small set of **states**, where overlapping subproblems are computed once. Every DP answer is four decisions:

1. **State** — the minimum information that makes the rest of the problem independent of how you got here.
2. **Transition** — how a state is built from smaller states.
3. **Base case & order** — which states are known, and an order where dependencies come first.
4. **Answer** — which state (or max over states) is the final result.

Complexity is almost always **(#states) × (cost per transition)**. If that's too slow, either shrink the state or speed up the transition (prefix sums, monotonic deque, binary search, bitset).

## Recognizing a DP problem

- "Count the number of ways", "min/max cost", "is it possible" — over choices made in sequence.
- Greedy fails on a small counterexample.
- Constraints: `n ≤ 5000` → O(n²) is fine; `n ≤ 20` → bitmask; `n ≤ 10^18` with digit conditions → digit DP; `n ≤ 10^5` → O(n log n) or O(n) DP.

## Memo → tabulation → space optimisation

Write top-down first when the order isn't obvious; convert when you need speed or memory.

```cpp
// Top-down: easiest to get right
int memo[N][K]; // fill with -1
int solve(int i, int k) {
    if (i == n) return base;
    int &res = memo[i][k];
    if (res != -1) return res;
    res = /* combine solve(i + 1, ...) */;
    return res;
}
```

```cpp
// Bottom-up: iterate in reverse dependency order
for (int i = n - 1; i >= 0; --i)
    for (int k = 0; k <= K; ++k)
        dp[i][k] = /* from dp[i + 1][...] */;

// Space: row i only uses row i+1 -> keep two rows (or one, iterating k carefully)
```

## Common mistakes

- State missing information (e.g. forgetting "last element picked" or "is holding a stock").
- `memo` initialised to `0` when `0` is a valid answer — use `-1` or a separate `seen` array.
- Mod arithmetic: `(a - b) % MOD` can be negative; use `((a - b) % MOD + MOD) % MOD`.
- Overflow: counting DP needs `long long` before the mod.
- Recursion depth > ~10^5 in C++ can stack-overflow; switch to bottom-up.
