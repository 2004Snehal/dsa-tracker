Binary search works on any **monotone predicate**: a function that's `false, false, …, true, true` over a sorted domain. Find the boundary in O(log range) checks.

## One template for everything

Search for the **first index where `ok(mid)` is true**. Half-open `[lo, hi)`, no off-by-one arguments:

```cpp
// returns first x in [lo, hi) with ok(x) true, or hi if none
long long lo = L, hi = R + 1;
while (lo < hi) {
    long long mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
}
return lo;
```

- **Last** `x` with `ok(x)` true (predicate `true…true, false…`) → first `x` where `!ok(x)`, minus 1.
- `lo + (hi - lo) / 2` avoids overflow.
- On doubles, loop a fixed 100 times instead of checking `lo < hi`.

## Recognising it

- Sorted input, or "find in O(log n)".
- "Minimise the maximum" / "maximise the minimum" → binary search on the answer.
- Answer space is huge (10^9, 10^18) but checking a candidate is easy.

## Common mistakes

- `mid = (lo + hi) / 2` with `lo = mid` → infinite loop when `hi = lo + 1`. The template above never sets `lo = mid`.
- Predicate not actually monotone (check with a small example).
- Upper bound too small: the answer itself must be inside `[lo, hi)`.
