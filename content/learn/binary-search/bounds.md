| Call | Returns first element … | Count with |
|---|---|---|
| `lower_bound(b, e, x)` | `>= x` | `< x`: `lb - begin` |
| `upper_bound(b, e, x)` | `> x` | `<= x`: `ub - begin` |
| `equal_range(b, e, x)` | both | `== x`: `ub - lb` |

```cpp
// Last element <= x
auto it = upper_bound(a.begin(), a.end(), x);
if (it != a.begin()) { --it; /* *it is the answer */ }

// First / last position of target (LC 34)
int first = lower_bound(a.begin(), a.end(), t) - a.begin();
int last  = upper_bound(a.begin(), a.end(), t) - a.begin() - 1;
if (first == n || a[first] != t) return {-1, -1};
```

- `std::set` / `std::map`: use the member `s.lower_bound(x)` — the free function is **O(n)** on set iterators.
- Descending array: pass `greater<int>()` as the comparator.
- Custom comparator for searching by a field: `lower_bound(v.begin(), v.end(), x, [](const P& p, int x) { return p.key < x; })`.

**Used inside other patterns:** LIS (patience sorting), sweep lines over sorted events, "two-sum in sorted array" alternatives, coordinate compression (`sort` + `unique` + `lower_bound`).

**Classics:** 35, 34, 704, 74, 981, 1146, 2389.
