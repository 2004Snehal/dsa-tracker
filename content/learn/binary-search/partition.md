**Cue:** median or k-th element of **two sorted arrays** in O(log(min(n, m))).

**Idea:** choose `i` elements from `A` and `j = half − i` from `B` for the left half. The split is correct when everything on the left is ≤ everything on the right:

`A[i-1] ≤ B[j]` and `B[j-1] ≤ A[i]`

Binary search `i` over the **shorter** array.

```cpp
double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
    if (A.size() > B.size()) swap(A, B);
    int n = A.size(), m = B.size(), half = (n + m + 1) / 2;
    int lo = 0, hi = n;
    while (lo <= hi) {
        int i = (lo + hi) / 2, j = half - i;
        int aL = i ? A[i-1] : INT_MIN, aR = i < n ? A[i] : INT_MAX;
        int bL = j ? B[j-1] : INT_MIN, bR = j < m ? B[j] : INT_MAX;
        if (aL <= bR && bL <= aR) {
            if ((n + m) & 1) return max(aL, bL);
            return (max(aL, bL) + (long long)min(aR, bR)) / 2.0;
        }
        if (aL > bR) hi = i - 1;     // took too many from A
        else lo = i + 1;
    }
    return 0;
}
```

**k-th smallest of two arrays:** same partition with `half = k`. Or the simpler O(log k) elimination: compare `A[k/2-1]` and `B[k/2-1]` and discard the smaller block.

**Classics:** 4, 1539 (missing k-th — a different partition: `a[i] − i − 1` missing before index i).
