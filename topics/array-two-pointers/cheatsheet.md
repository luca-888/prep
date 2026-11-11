> **规则**：移动指针之前，先说清每个指针的哪一侧已经处理完、里面放的是什么。

| 看到 | 用 |
| --- | --- |
| 原地删除、去重、把某类元素挪到一边 | 读写指针 |
| 有序数组里找一对数；回文；从两端往中间比较 | 对撞指针 |
| 三个数、四个数的和 | 排序，固定前几个，剩下的对撞 |
| 两个有序数组合并、比较、匹配 | 每个数组一个指针 |
| 要原地写，又怕盖住还没读的数据 | 从后往前写 |

### 读写指针：原地删除

```python
slow = 0                       # nums[:slow] 是保留下来的元素
for fast in range(len(nums)):
    if keep(nums[fast]):
        nums[slow] = nums[fast]
        slow += 1
return slow                    # 新长度
```

### 读写指针：有序数组去重，每个值最多留 k 个

```python
slow = 0
for x in nums:
    if slow < k or x != nums[slow - k]:   # 与已写入的倒数第 k 个比较
        nums[slow] = x
        slow += 1
return slow
```

### 对撞指针：有序数组里和为 target 的两个数

```python
l, r = 0, len(nums) - 1
while l < r:
    s = nums[l] + nums[r]
    if s == target: return [l, r]
    if s < target: l += 1      # nums[l] 配最大的数都不够，排除
    else:          r -= 1      # nums[r] 配最小的数都超了，排除
```

### 对撞指针：反转与回文

```python
l, r = 0, len(s) - 1
while l < r:
    s[l], s[r] = s[r], s[l]    # 回文：if s[l] != s[r]: return False
    l += 1; r -= 1
```

### 三数之和：排序、固定一个、去重

```python
nums.sort()
for i in range(len(nums) - 2):
    if i and nums[i] == nums[i - 1]: continue      # 第一个数去重
    l, r = i + 1, len(nums) - 1
    while l < r:
        s = nums[i] + nums[l] + nums[r]
        if s < 0: l += 1
        elif s > 0: r -= 1
        else:
            res.append([nums[i], nums[l], nums[r]])
            l += 1; r -= 1
            while l < r and nums[l] == nums[l - 1]: l += 1   # 第二个数去重
            while l < r and nums[r] == nums[r + 1]: r -= 1   # 第三个数去重
```

### 两个数组：从后往前合并

```python
i, j, k = m - 1, n - 1, m + n - 1
while j >= 0:                              # nums2 用完就结束，nums1 剩下的本来就在原位
    if i >= 0 and nums1[i] > nums2[j]:
        nums1[k] = nums1[i]; i -= 1
    else:
        nums1[k] = nums2[j]; j -= 1
    k -= 1
```

### 两个数组：子序列匹配

```python
i = 0
for c in t:
    if i < len(s) and s[i] == c: i += 1
return i == len(s)
```

### 三路分区

```python
lo, i, hi = 0, 0, len(nums) - 1            # [0, lo) 是 0，[lo, i) 是 1，(hi, n) 是 2
while i <= hi:
    if nums[i] == 0:
        nums[lo], nums[i] = nums[i], nums[lo]; lo += 1; i += 1
    elif nums[i] == 2:
        nums[hi], nums[i] = nums[i], nums[hi]; hi -= 1   # 换过来的数还没看，i 不动
    else:
        i += 1
```

### 三次反转：向右轮转 k 位

```python
k %= len(nums)
reverse(0, n - 1); reverse(0, k - 1); reverse(k, n - 1)
```

### 检查清单

- 循环条件是 `l < r` 还是 `l <= r`：两个指针相遇时，那个元素是否还需要处理。
- 每一轮至少有一个指针移动，否则死循环。
- 对撞之前数组是否有序；题目要返回原下标时不能直接排序。
- 去重时比较的是 `nums[i - 1]`，并且要先确认 `i` 不是本层的第一个。
- 原地覆盖时，被写的位置是否还有没读的数据。
- 访问 `nums[slow - 1]`、`nums[l + 1]` 之前，下标是否越界。
- 空数组、只有一个元素、全部相同的元素各走一遍。
