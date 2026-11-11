## 节点与 next 指针

数组占用一段连续的内存，按下标可以直接访问任意元素。链表的节点分散在内存各处，每个节点保存一个值和一个 `next` 指针，`next` 指向下一个节点，最后一个节点的 `next` 为 `None`。

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

两者的代价正好相反：

| | 数组 | 链表 |
| --- | --- | --- |
| 访问第 k 个元素 | O(1) | O(k)，只能从 `head` 沿 `next` 逐个走 |
| 已知位置后插入、删除 | O(n)，要移动后面的元素 | O(1)，只改指针 |

链表题几乎不考复杂度，考的是指针改得对不对。下面的内容分两部分：一条贯穿所有题的规则，三个反复出现的手法。

## 基本动作：先保存，再修改

链表上的操作，最终都是修改某个节点的 `next`。

**删除**节点 `cur`：让它的前一个节点 `prev` 绕过它。

```python
prev.next = cur.next
```

**插入**节点 `node` 到 `prev` 之后要改两根指针，顺序不能颠倒。

```python
node.next = prev.next   # 先让新节点指向后半段
prev.next = node        # 再让 prev 指向新节点
```

如果先执行 `prev.next = node`，就没有指针指向后半段了，后半段无法找到。所有链表题都遵守同一条规则：**修改一根指针之前，先把它原来指向的节点保存下来。**反转里的 `nxt = cur.next`、合并里的临时变量，都是这条规则。

## 手法 1：哑节点

删除节点要用到它的前一个节点，而头节点没有前一个节点，所以删除头节点需要单独写一个分支。在头节点前面加一个哑节点 `dummy`，每个节点便都有了前一个节点，同一段循环可以处理所有节点。最后返回 `dummy.next`，它就是新的头节点，即使原来的头被删掉了也成立。

```python
def removeElements(head, val):          # 203
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == val:
            prev.next = prev.next.next  # 绕过，prev 不动
        else:
            prev = prev.next
    return dummy.next
```

删除之后 `prev` 不前进：新的 `prev.next` 还没有检查过。

**什么时候用**：头节点可能被删除、被替换，或者结果链表的头一开始不确定。合并两个有序链表（21）属于后一种，`dummy` 先占住结果的头，`tail` 每次接上较小的那个节点。

## 手法 2：反转

反转链表，就是把每一根 `next` 指针掉转方向。使用 `prev` 和 `cur` 两个指针，`prev` 初始为 `None`，`cur` 指向头节点，循环体只有四行：

```python
def reverseList(head):                  # 206
    prev, cur = None, head
    while cur:
        nxt = cur.next    # 先保存下一个节点
        cur.next = prev   # 掉转指针
        prev = cur        # prev 前进
        cur = nxt         # cur 前进
    return prev           # cur 为 None 时，prev 是新的头
```

循环结束时 `cur` 为 `None`，`prev` 指向原来的最后一个节点，也就是新的头节点。

反转一段（92）和 K 个一组反转（25）没有新的手法，都是在这四行之外增加边界处理：反转之前记住这一段的前驱，反转之后把这一段的新头接到前驱后面，把新尾接到后继前面。因为第一段可能从头节点开始，前驱要从 `dummy` 出发去找。

## 手法 3：快慢指针

链表不能按下标访问，长度也未知。让两个指针以不同的速度或不同的起点前进，可以在一次遍历里得到位置信息。

**找中点**（876）：`slow` 每次走一步，`fast` 每次走两步，`fast` 到达末尾时 `slow` 停在中点。

```python
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

节点数为偶数时，这种写法让 `slow` 停在靠后的那个中点。要停在靠前的中点（比如之后要从中点断开），把条件改为 `while fast.next and fast.next.next`。

**找倒数第 k 个**（19）：`fast` 先走 k 步，再让两个指针同速前进。两者的间隔始终是 k，`fast` 走出链表时 `slow` 停在倒数第 k 个节点。要删除这个节点时，让 `slow` 从 `dummy` 出发，它会停在待删节点的前驱上。

**判断环**（141）：如果链表中有环，`fast` 不会走到末尾，而是在环内从后面追上 `slow`。每一轮两者的距离缩小 1，所以一定相遇，不会跳过。

```python
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast:
        return True
return False
```

求入环点（142）多一步：相遇后让一个指针回到 `head`，两个指针同速前进，再次相遇的位置就是入环点。设头到入环点的距离为 a，入环点到相遇点为 b，环长为 c，相遇时 `fast` 走的路程是 `slow` 的两倍，即 2(a + b) = a + b + nc，得 a = nc − b，所以从 `head` 走 a 步与从相遇点走 a 步会到达同一个节点。

## 组合：重排链表

重排链表（143）要求把 1 → 2 → 3 → 4 → 5 排成 1 → 5 → 2 → 4 → 3，即首尾交替取节点。它没有新的手法，是上面三个动作的组合：

1. 用快慢指针找到中点。
2. 从中点之后断开，把后半段反转。
3. 把两段交替合并，每接一个节点之前先保存它的 `next`。

```python
def reorderList(head):                  # 143
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    second, slow.next = slow.next, None  # 断开

    prev = None                          # 反转后半段
    while second:
        second.next, prev, second = prev, second, second.next

    first, second = head, prev           # 交替合并
    while second:
        n1, n2 = first.next, second.next
        first.next, second.next = second, n1
        first, second = n1, n2
```

回文链表（234）是找中点、反转、逐个比较，排序链表（148）是找中点、断开、合并两个有序链表。遇到一道新的链表题，先看它能拆成哪几个已知的动作。

## 常见错误

- **断链**：改 `cur.next` 之前没有保存原来的下一个节点。
- **空指针**：访问 `x.next.next` 之前没有确认 `x.next` 不为 `None`；快慢指针的循环条件要同时检查 `fast` 和 `fast.next`。
- **没有断开**：把链表拆成两段后，前一段的末尾仍然指向后一段，合并或排序时形成环。拆分后把末尾的 `next` 置为 `None`。
- **返回了旧的头**：头节点可能已经被删除或移动，应返回 `dummy.next`。
- **删除后多走一步**：删除 `prev.next` 之后 `prev` 不前进。
