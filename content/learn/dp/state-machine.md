**Cue:** at each step you're in one of a few modes (holding / not holding a stock, cooldown, how many of a pattern matched), and actions move you between modes.

**State:** `dp[mode]` at the current index. Draw the modes as nodes and actions as edges, then each edge is one line of code.

```cpp
// Stock with cooldown: hold, sold (just sold today), rest
int hold = INT_MIN / 2, sold = 0, rest = 0;
for (int p : prices) {
    int pHold = hold, pSold = sold, pRest = rest;
    hold = max(pHold, pRest - p);   // keep holding, or buy after resting
    sold = pHold + p;               // sell today
    rest = max(pRest, pSold);       // cooldown / idle
}
return max(sold, rest);
```

| Stock variant | Extra state |
|---|---|
| One transaction (121) | min price so far |
| Unlimited (122) | hold / free |
| At most k (188) | `buy[j]`, `sell[j]` for `j = 1..k` |
| Cooldown (309) | hold / sold / rest |
| Fee (714) | subtract fee on sell |

### Counting pattern subsequences — Count Special Subsequences (0+1+2+)

Modes = "ends in 0s", "ends in 0s then 1s", "ends in 0s,1s,2s". For each element, a valid subsequence ending in that mode can **skip** it, **extend** with it, or (for the first element of a block) **start** from the previous mode.

```cpp
long long a = 0, b = 0, c = 0; // counts for modes 0, 1, 2
for (int x : nums) {
    if (x == 0) a = (2 * a + 1) % MOD;          // skip or extend, or start new
    else if (x == 1) b = (2 * b + a) % MOD;     // skip/extend, or start from a
    else c = (2 * c + b) % MOD;
}
return c;
```

**Classics:** 121, 122, 123, 188, 309, 714, 1955, 801 (min swaps — swapped/not-swapped).
