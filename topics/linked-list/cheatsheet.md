规则：修改一根指针之前，先保存它原来指向的节点。

| 看到 | 用 |
| --- | --- |
| 头节点可能被删、被换，或结果的头不确定 | 哑节点 |
| 要掉转方向、从尾部往回走 | 反转 |
| 中点、倒数第 k 个、是否有环 | 快慢指针 |
| 首尾配对、回文、排序 | 找中点 + 反转或合并 |

**删除 / 插入**

```python
prev.next = prev.next.next                 # 删除 prev 之后的节点
node.next = prev.next; prev.next = node    # 在 prev 之后插入，顺序不能反
```

**哑节点**：遍历时删除

```python
dummy = ListNode(0, head)
prev = dummy
while prev.next:
    if should_delete(prev.next):
        prev.next = prev.next.next   # prev 不动
    else:
        prev = prev.next
return dummy.next
```

**哑节点**：合并两个有序链表

```python
dummy = tail = ListNode()
while a and b:
    if a.val <= b.val: tail.next, a = a, a.next
    else:              tail.next, b = b, b.next
    tail = tail.next
tail.next = a or b
return dummy.next
```

**反转**

```python
prev, cur = None, head
while cur:
    nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt
return prev
```

**反转第 left 到第 right 个节点**（头插法）

```python
dummy = ListNode(0, head)
p = dummy
for _ in range(left - 1): p = p.next   # p 是这一段的前驱
cur = p.next
for _ in range(right - left):          # 每次把 cur 后面的节点移到段首
    nxt = cur.next
    cur.next = nxt.next
    nxt.next = p.next
    p.next = nxt
return dummy.next
```

**中点**

```python
slow = fast = head
while fast and fast.next:              # 偶数个节点时停在后一个中点
    slow, fast = slow.next, fast.next.next
# 要停在前一个中点（之后断开）：while fast.next and fast.next.next
```

**倒数第 k 个**

```python
dummy = ListNode(0, head)
slow = fast = dummy
for _ in range(k): fast = fast.next
while fast.next:
    slow, fast = slow.next, fast.next
# slow 是倒数第 k 个节点的前驱；删除：slow.next = slow.next.next
```

**环与入环点**

```python
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
    if slow is fast:                   # 有环
        p = head
        while p is not slow:
            p, slow = p.next, slow.next
        return p                       # 入环点
return None
```

**检查清单**

- 空链表、只有一个节点、只有两个节点各走一遍。
- 拆成两段后，前一段的末尾是否置为 `None`。
- 返回的是 `dummy.next` 还是已经失效的 `head`。
