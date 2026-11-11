// 页内做题用的题面、起始代码与用例。题面是自己写的简述，完整题面与正式评测以 LeetCode 为准。
// 字段：fn 方法名；params 用例里各参数的显示名；in / out 参数与返回值的类型（list 表示链表，用数组书写）；
// kind 省略时为 plain，其余几种（delete_node / cycle / intersection / random_copy / design）的用例格式见 harness.py。
// 改完运行 python3 dev/check.py，用参考解法校验全部用例。
(function () {
  const LN = `# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
`;
  const sol = (sig) => `${LN}class Solution:\n    def ${sig}:\n        pass\n`;
  const L = "Optional[ListNode]";
  const T = (args, expect) => ({ args, expect });

  window.PROBLEMS = {
    83: {
      fn: "deleteDuplicates", params: ["head"], in: ["list"], out: "list",
      desc: "给定一个**已按升序排列**的链表，删除重复的节点，使每个值只出现一次，返回链表的头。\n\n```text\n输入  head = [1,1,2,3,3]\n输出  [1,2,3]\n```",
      starter: sol(`deleteDuplicates(self, head: ${L}) -> ${L}`),
      tests: [T([[1, 1, 2]], [1, 2]), T([[1, 1, 2, 3, 3]], [1, 2, 3]), T([[]], []), T([[1, 1, 1]], [1]), T([[1]], [1])],
    },
    237: {
      kind: "delete_node", fn: "deleteNode", params: ["head", "node 的下标"],
      desc: "只给你链表中的一个节点 `node`（不是最后一个节点），拿不到头节点。把这个节点从链表中删除，不需要返回值。\n\n“删除”指的是：这个值不再出现在链表里，节点数减一，其余值的顺序不变。\n\n```text\n输入  head = [4,5,1,9]，node 是值为 5 的节点\n输出  [4,1,9]\n```",
      starter: `${LN}class Solution:\n    def deleteNode(self, node: ListNode) -> None:\n        pass\n`,
      tests: [T([[4, 5, 1, 9], 1], [4, 1, 9]), T([[4, 5, 1, 9], 2], [4, 5, 9]), T([[1, 2], 0], [2]), T([[0, 0, 7], 0], [0, 7])],
    },
    61: {
      fn: "rotateRight", params: ["head", "k"], in: ["list", "int"], out: "list",
      desc: "把链表向右旋转 `k` 个位置：每次把最后一个节点移到最前面，重复 `k` 次。`k` 可能远大于链表长度。\n\n```text\n输入  head = [1,2,3,4,5], k = 2\n输出  [4,5,1,2,3]\n```",
      starter: sol(`rotateRight(self, head: ${L}, k: int) -> ${L}`),
      tests: [T([[1, 2, 3, 4, 5], 2], [4, 5, 1, 2, 3]), T([[0, 1, 2], 4], [2, 0, 1]), T([[], 3], []), T([[1], 99], [1]), T([[1, 2], 2], [1, 2]), T([[1, 2, 3], 0], [1, 2, 3])],
    },
    203: {
      fn: "removeElements", params: ["head", "val"], in: ["list", "int"], out: "list",
      desc: "删除链表中所有值等于 `val` 的节点，返回新的头节点。\n\n```text\n输入  head = [1,2,6,3,4,5,6], val = 6\n输出  [1,2,3,4,5]\n```",
      starter: sol(`removeElements(self, head: ${L}, val: int) -> ${L}`),
      tests: [T([[1, 2, 6, 3, 4, 5, 6], 6], [1, 2, 3, 4, 5]), T([[], 1], []), T([[7, 7, 7, 7], 7], []), T([[6, 1, 6, 2], 6], [1, 2]), T([[1, 2], 3], [1, 2])],
    },
    21: {
      fn: "mergeTwoLists", params: ["list1", "list2"], in: ["list", "list"], out: "list",
      desc: "把两个升序链表合并成一个升序链表，新链表由原来的节点拼接而成。\n\n```text\n输入  list1 = [1,2,4], list2 = [1,3,4]\n输出  [1,1,2,3,4,4]\n```",
      starter: sol(`mergeTwoLists(self, list1: ${L}, list2: ${L}) -> ${L}`),
      tests: [T([[1, 2, 4], [1, 3, 4]], [1, 1, 2, 3, 4, 4]), T([[], []], []), T([[], [0]], [0]), T([[5], [1, 2, 3]], [1, 2, 3, 5]), T([[1, 1], [1]], [1, 1, 1])],
    },
    2: {
      fn: "addTwoNumbers", params: ["l1", "l2"], in: ["list", "list"], out: "list",
      desc: "两个非空链表各表示一个非负整数，数字按**逆序**存放，每个节点一位。把两个数相加，用同样的形式返回和。\n\n```text\n输入  l1 = [2,4,3], l2 = [5,6,4]\n输出  [7,0,8]        342 + 465 = 807\n```",
      starter: sol(`addTwoNumbers(self, l1: ${L}, l2: ${L}) -> ${L}`),
      tests: [T([[2, 4, 3], [5, 6, 4]], [7, 0, 8]), T([[0], [0]], [0]), T([[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], [8, 9, 9, 9, 0, 0, 0, 1]), T([[5], [5]], [0, 1]), T([[1], [9, 9]], [0, 0, 1])],
    },
    82: {
      fn: "deleteDuplicates", params: ["head"], in: ["list"], out: "list",
      desc: "给定一个**已按升序排列**的链表，把所有出现过重复的值**全部删除**，只留下原本只出现一次的值。\n\n```text\n输入  head = [1,2,3,3,4,4,5]\n输出  [1,2,5]\n```",
      starter: sol(`deleteDuplicates(self, head: ${L}) -> ${L}`),
      tests: [T([[1, 2, 3, 3, 4, 4, 5]], [1, 2, 5]), T([[1, 1, 1, 2, 3]], [2, 3]), T([[1, 1]], []), T([[]], []), T([[1, 2, 2]], [1]), T([[1, 1, 2, 2]], [])],
    },
    86: {
      fn: "partition", params: ["head", "x"], in: ["list", "int"], out: "list",
      desc: "重新排列链表，使所有小于 `x` 的节点都在大于等于 `x` 的节点之前，两部分内部保持原来的相对顺序。\n\n```text\n输入  head = [1,4,3,2,5,2], x = 3\n输出  [1,2,2,4,3,5]\n```",
      starter: sol(`partition(self, head: ${L}, x: int) -> ${L}`),
      tests: [T([[1, 4, 3, 2, 5, 2], 3], [1, 2, 2, 4, 3, 5]), T([[2, 1], 2], [1, 2]), T([[], 0], []), T([[3, 1, 2], 5], [3, 1, 2]), T([[3, 1, 2], 0], [3, 1, 2])],
    },
    24: {
      fn: "swapPairs", params: ["head"], in: ["list"], out: "list",
      desc: "两两交换相邻的节点，返回新的头。只能改指针，不能改节点的值。\n\n```text\n输入  head = [1,2,3,4]\n输出  [2,1,4,3]\n```",
      starter: sol(`swapPairs(self, head: ${L}) -> ${L}`),
      tests: [T([[1, 2, 3, 4]], [2, 1, 4, 3]), T([[]], []), T([[1]], [1]), T([[1, 2, 3]], [2, 1, 3])],
    },
    23: {
      fn: "mergeKLists", params: ["lists"], in: ["lists"], out: "list",
      desc: "给定 k 个升序链表，把它们合并成一个升序链表。\n\n```text\n输入  lists = [[1,4,5],[1,3,4],[2,6]]\n输出  [1,1,2,3,4,4,5,6]\n```",
      starter: sol(`mergeKLists(self, lists: List[${L}]) -> ${L}`),
      tests: [T([[[1, 4, 5], [1, 3, 4], [2, 6]]], [1, 1, 2, 3, 4, 4, 5, 6]), T([[]], []), T([[[]]], []), T([[[], [1]]], [1]), T([[[2], [1], [3]]], [1, 2, 3])],
    },
    206: {
      fn: "reverseList", params: ["head"], in: ["list"], out: "list",
      desc: "反转链表，返回反转后的头节点。\n\n```text\n输入  head = [1,2,3,4,5]\n输出  [5,4,3,2,1]\n```",
      starter: sol(`reverseList(self, head: ${L}) -> ${L}`),
      tests: [T([[1, 2, 3, 4, 5]], [5, 4, 3, 2, 1]), T([[1, 2]], [2, 1]), T([[]], []), T([[1]], [1])],
    },
    92: {
      fn: "reverseBetween", params: ["head", "left", "right"], in: ["list", "int", "int"], out: "list",
      desc: "反转链表中第 `left` 个到第 `right` 个节点（从 1 开始计数，两端都包含），其余部分不变。\n\n```text\n输入  head = [1,2,3,4,5], left = 2, right = 4\n输出  [1,4,3,2,5]\n```",
      starter: sol(`reverseBetween(self, head: ${L}, left: int, right: int) -> ${L}`),
      tests: [T([[1, 2, 3, 4, 5], 2, 4], [1, 4, 3, 2, 5]), T([[5], 1, 1], [5]), T([[1, 2, 3], 1, 3], [3, 2, 1]), T([[1, 2, 3], 1, 2], [2, 1, 3]), T([[1, 2, 3], 2, 3], [1, 3, 2])],
    },
    25: {
      fn: "reverseKGroup", params: ["head", "k"], in: ["list", "int"], out: "list",
      desc: "每 `k` 个节点一组进行反转。末尾不足 `k` 个的部分保持原样。只能改指针，不能改节点的值。\n\n```text\n输入  head = [1,2,3,4,5], k = 2\n输出  [2,1,4,3,5]\n```",
      starter: sol(`reverseKGroup(self, head: ${L}, k: int) -> ${L}`),
      tests: [T([[1, 2, 3, 4, 5], 2], [2, 1, 4, 3, 5]), T([[1, 2, 3, 4, 5], 3], [3, 2, 1, 4, 5]), T([[1], 1], [1]), T([[1, 2, 3, 4], 4], [4, 3, 2, 1]), T([[1, 2, 3, 4], 2], [2, 1, 4, 3]), T([[1, 2], 3], [1, 2])],
    },
    876: {
      fn: "middleNode", params: ["head"], in: ["list"], out: "list",
      desc: "返回链表的中间节点。节点数为偶数时有两个中间节点，返回**后一个**。\n\n下面的输出是从返回的节点开始到末尾的值。\n\n```text\n输入  head = [1,2,3,4,5,6]\n输出  [4,5,6]\n```",
      starter: sol(`middleNode(self, head: ${L}) -> ${L}`),
      tests: [T([[1, 2, 3, 4, 5]], [3, 4, 5]), T([[1, 2, 3, 4, 5, 6]], [4, 5, 6]), T([[1]], [1]), T([[1, 2]], [2])],
    },
    19: {
      fn: "removeNthFromEnd", params: ["head", "n"], in: ["list", "int"], out: "list",
      desc: "删除链表的倒数第 `n` 个节点，返回头节点。`n` 保证不超过链表长度。试着只遍历一次。\n\n```text\n输入  head = [1,2,3,4,5], n = 2\n输出  [1,2,3,5]\n```",
      starter: sol(`removeNthFromEnd(self, head: ${L}, n: int) -> ${L}`),
      tests: [T([[1, 2, 3, 4, 5], 2], [1, 2, 3, 5]), T([[1], 1], []), T([[1, 2], 1], [1]), T([[1, 2], 2], [2]), T([[1, 2, 3], 3], [2, 3])],
    },
    141: {
      kind: "cycle", out: "bool", fn: "hasCycle", params: ["head", "pos"],
      desc: "判断链表中是否有环。\n\n用例里的 `pos` 表示尾节点的 `next` 指向第几个节点（从 0 开始），`-1` 表示没有环。`pos` 只用来构造输入，不会传给你的函数。\n\n```text\n输入  head = [3,2,0,-4], pos = 1\n输出  True\n```",
      starter: sol(`hasCycle(self, head: ${L}) -> bool`),
      tests: [T([[3, 2, 0, -4], 1], true), T([[1, 2], 0], true), T([[1], -1], false), T([[], -1], false), T([[1, 2, 3], -1], false), T([[1], 0], true)],
    },
    142: {
      kind: "cycle", out: "index", fn: "detectCycle", params: ["head", "pos"],
      desc: "如果链表有环，返回**入环的第一个节点**；没有环则返回 `None`。不能修改链表。\n\n用例里的 `pos` 表示尾节点的 `next` 指向第几个节点（从 0 开始），`-1` 表示没有环。输出显示的是你返回的节点的下标，`-1` 代表 `None`。\n\n```text\n输入  head = [3,2,0,-4], pos = 1\n输出  1\n```",
      starter: sol(`detectCycle(self, head: ${L}) -> ${L}`),
      tests: [T([[3, 2, 0, -4], 1], 1), T([[1, 2], 0], 0), T([[1], -1], -1), T([[1, 2, 3, 4, 5], 4], 4), T([[1, 2, 3, 4, 5], 2], 2), T([[], -1], -1)],
    },
    160: {
      kind: "intersection", fn: "getIntersectionNode", params: ["A 独有的部分", "B 独有的部分", "公共部分"],
      desc: "两个链表可能从某个节点开始共用同一段尾部。返回它们相交的第一个节点；不相交则返回 `None`。不能修改链表。\n\n注意相交指的是**同一个节点**，不是值相等。\n\n```text\n输入  A = [4,1,8,4,5], B = [5,6,1,8,4,5]，从值为 8 的节点开始共用\n输出  值为 8 的那个节点\n```",
      starter: sol(`getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ${L}`),
      tests: [T([[4, 1], [5, 6, 1], [8, 4, 5]], "交点"), T([[1, 9, 1], [3], [2, 4]], "交点"), T([[2, 6, 4], [1, 5], []], null), T([[], [], [1]], "交点"), T([[1], [], [2, 3]], "交点")],
    },
    143: {
      fn: "reorderList", params: ["head"], in: ["list"], out: "inplace",
      desc: "把链表 L0 → L1 → … → Ln 原地重排成 L0 → Ln → L1 → Ln-1 → L2 → …，即首尾交替取节点。不需要返回值，只能改指针。\n\n```text\n输入  head = [1,2,3,4,5]\n输出  [1,5,2,4,3]\n```",
      starter: `${LN}class Solution:\n    def reorderList(self, head: ${L}) -> None:\n        pass\n`,
      tests: [T([[1, 2, 3, 4]], [1, 4, 2, 3]), T([[1, 2, 3, 4, 5]], [1, 5, 2, 4, 3]), T([[1]], [1]), T([[1, 2]], [1, 2]), T([[1, 2, 3]], [1, 3, 2])],
    },
    234: {
      fn: "isPalindrome", params: ["head"], in: ["list"], out: "bool",
      desc: "判断链表是否是回文：正着读和倒着读一样。试着用 O(1) 的额外空间。\n\n```text\n输入  head = [1,2,2,1]\n输出  True\n```",
      starter: sol(`isPalindrome(self, head: ${L}) -> bool`),
      tests: [T([[1, 2, 2, 1]], true), T([[1, 2]], false), T([[1]], true), T([[1, 2, 3, 2, 1]], true), T([[1, 2, 3, 1]], false), T([[1, 1, 2, 1]], false)],
    },
    148: {
      fn: "sortList", params: ["head"], in: ["list"], out: "list",
      desc: "把链表按升序排序，返回头节点。要求 O(n log n) 的时间。\n\n```text\n输入  head = [4,2,1,3]\n输出  [1,2,3,4]\n```",
      starter: sol(`sortList(self, head: ${L}) -> ${L}`),
      tests: [T([[4, 2, 1, 3]], [1, 2, 3, 4]), T([[-1, 5, 3, 4, 0]], [-1, 0, 3, 4, 5]), T([[]], []), T([[1]], [1]), T([[2, 1]], [1, 2]), T([[3, 3, 1]], [1, 3, 3])],
    },
    138: {
      kind: "random_copy", fn: "copyRandomList", params: ["head"],
      desc: "链表的每个节点除了 `next` 还有一个 `random` 指针，指向链表中的任意节点或 `None`。返回这个链表的**深拷贝**：全部是新节点，`next` 与 `random` 的指向关系和原链表一致。\n\n用例把每个节点写成 `[值, random 指向的下标]`，`null` 表示 `None`。\n\n```text\n输入  head = [[7,null],[13,0],[11,4],[10,2],[1,0]]\n输出  [[7,null],[13,0],[11,4],[10,2],[1,0]]\n```",
      starter: `# class Node:\n#     def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):\n#         self.val = int(x)\n#         self.next = next\n#         self.random = random\nclass Solution:\n    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':\n        pass\n`,
      tests: [
        T([[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]], [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]),
        T([[[1, 1], [2, 1]]], [[1, 1], [2, 1]]),
        T([[[3, null], [3, 0], [3, null]]], [[3, null], [3, 0], [3, null]]),
        T([[]], []),
      ],
    },
    146: {
      kind: "design", cls: "LRUCache", fn: "", params: ["操作", "参数"],
      desc: "实现一个容量固定的 LRU（最近最少使用）缓存：\n\n- `LRUCache(capacity)`：创建容量为 `capacity` 的缓存。\n- `get(key)`：键存在则返回它的值，否则返回 `-1`。\n- `put(key, value)`：写入或更新键值；写入后如果超出容量，淘汰最久没有被使用的键。\n\n`get` 和 `put` 都算一次使用，都要求 O(1) 的平均时间。\n\n```text\n操作  LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)\n输出  null, null, null, 1, null, -1        put(3,3) 淘汰了键 2\n```",
      starter: "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass\n",
      tests: [
        T([["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]], [null, null, null, 1, null, -1, null, -1, 3, 4]),
        T([["LRUCache", "put", "get", "put", "get", "get"], [[1], [2, 1], [2], [3, 2], [2], [3]]], [null, null, 1, null, -1, 2]),
        T([["LRUCache", "put", "put", "put", "get", "put", "get", "get"], [[2], [1, 1], [2, 2], [1, 10], [1], [3, 3], [2], [3]]], [null, null, null, null, 10, null, -1, 3]),
      ],
    },
  };
})();
