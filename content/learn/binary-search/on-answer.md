**Cue:** "minimum capacity / speed / time such that …", "maximise the minimum distance", "k-th smallest" — and checking **one candidate** is greedy or O(n).

Steps:

1. Define `ok(x)`: "is answer `x` achievable?" It must be monotone (if `x` works, `x+1` works).
2. Bound the range: `lo` = smallest possible answer, `hi` = one that surely works.
3. Run the first-true template.

```cpp
// Koko eating bananas: smallest speed k to finish in h hours
auto ok = [&](long long k) {
    long long hours = 0;
    for (int p : piles) hours += (p + k - 1) / k;
    return hours <= h;
};
long long lo = 1, hi = *max_element(piles.begin(), piles.end());
while (lo < hi) { long long mid = lo + (hi - lo) / 2; ok(mid) ? hi = mid : lo = mid + 1; }
return lo;
```

### Maximise instead of minimise

"Largest `x` such that `ok(x)`" (e.g. **Maximum Number That Sum of the Prices ≤ k**): find the first `x` where `ok` becomes **false**, then subtract 1. In LC 3007, `ok(x)` = total price of `1..x` ≤ k, computed per bit in O(log x) with the counting formula from *Digit DP*.

### k-th smallest in a sorted structure

"k-th smallest in a multiplication table / sorted matrix / pair distances": `ok(x)` = "at least k values are ≤ x", counted in O(n) with two pointers. The answer is the first such `x`.

### Min-max path

Path With Minimum Effort, Swim in Rising Water: `ok(t)` = "can I reach the end using only edges with cost ≤ t?" (BFS). Same answer as the modified Dijkstra.

**Classics:** 875, 1011, 410, 1482, 1552, 2064, 668, 719, 3007, 1631.
