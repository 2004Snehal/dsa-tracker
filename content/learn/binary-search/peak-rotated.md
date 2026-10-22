Binary search doesn't need a fully sorted array — only a rule that tells you which half holds the answer.

### Peak element

If `a[mid] < a[mid+1]`, a peak exists to the right (the values climb, and the edge counts as −∞). Otherwise one exists at `mid` or to the left.

```cpp
int lo = 0, hi = n - 1;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < a[mid + 1]) lo = mid + 1;
    else hi = mid;
}
return lo;
```

### Rotated sorted array

One half of `[lo, hi]` is always sorted. Check whether the target lies in that sorted half; if not, go to the other.

```cpp
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == t) return mid;
    if (a[lo] <= a[mid]) {                       // left half sorted
        if (a[lo] <= t && t < a[mid]) hi = mid - 1; else lo = mid + 1;
    } else {                                     // right half sorted
        if (a[mid] < t && t <= a[hi]) lo = mid + 1; else hi = mid - 1;
    }
}
return -1;
```

**Minimum of rotated array:** compare `a[mid]` with `a[hi]` — if `a[mid] > a[hi]` the minimum is right of `mid`, else at `mid` or left. With duplicates (LC 154), when `a[mid] == a[hi]` just do `--hi` (worst case O(n)).

**Mountain array:** find the peak first, then binary search each side (ascending, then descending).

**Classics:** 162, 852, 33, 81, 153, 154, 1095.
