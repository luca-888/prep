// 页内做题用的题面、起始代码与用例。题面是自己写的简述，完整题面与正式评测以 LeetCode 为准。
// 字段：fn 方法名；params 用例里各参数的显示名；in / out 参数与返回值的类型（list 表示链表，用数组书写；其余类型原样传入）；
// out 还可以是 inplace（原地修改第一个参数）、prefix / prefix_sorted（返回长度 k，比较前 k 个）、sorted / unordered（结果顺序不限）。
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
  const arr = (sig) => `class Solution:\n    def ${sig}:\n        pass\n`;   // 数组题：不需要 ListNode
  const A = "List[int]";
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
    // —— 数组与双指针 ——
    27: {
      fn: "removeElement", params: ["nums", "val"], in: ["array", "int"], out: "prefix_sorted",
      desc: "原地删除数组中所有等于 `val` 的元素，返回剩下的元素个数 `k`。`nums` 的前 `k` 个位置要放剩下的元素，顺序不限；`k` 之后的内容不检查。不能另开数组。\n\n下面的输出是 `nums` 的前 `k` 个元素（排序后比较）。\n\n```text\n输入  nums = [3,2,2,3], val = 3\n输出  [2,2]          返回 k = 2\n```",
      starter: arr(`removeElement(self, nums: ${A}, val: int) -> int`),
      tests: [T([[3, 2, 2, 3], 3], [2, 2]), T([[0, 1, 2, 2, 3, 0, 4, 2], 2], [0, 0, 1, 3, 4]), T([[], 0], []), T([[1], 1], []), T([[4, 5], 6], [4, 5]), T([[7, 7, 7], 7], [])],
    },
    26: {
      fn: "removeDuplicates", params: ["nums"], in: ["array"], out: "prefix",
      desc: "数组**已按升序排列**。原地删除重复的元素，使每个值只出现一次，返回不同值的个数 `k`。`nums` 的前 `k` 个位置要按原来的顺序放这些值；`k` 之后的内容不检查。\n\n下面的输出是 `nums` 的前 `k` 个元素。\n\n```text\n输入  nums = [0,0,1,1,1,2,2,3,3,4]\n输出  [0,1,2,3,4]    返回 k = 5\n```",
      starter: arr(`removeDuplicates(self, nums: ${A}) -> int`),
      tests: [T([[1, 1, 2]], [1, 2]), T([[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], [0, 1, 2, 3, 4]), T([[1]], [1]), T([[1, 2, 3]], [1, 2, 3]), T([[2, 2, 2]], [2])],
    },
    80: {
      fn: "removeDuplicates", params: ["nums"], in: ["array"], out: "prefix",
      desc: "数组**已按升序排列**。原地删除多余的元素，使每个值**最多出现两次**，返回剩下的元素个数 `k`。`nums` 的前 `k` 个位置要按原来的顺序放这些元素。\n\n下面的输出是 `nums` 的前 `k` 个元素。\n\n```text\n输入  nums = [1,1,1,2,2,3]\n输出  [1,1,2,2,3]    返回 k = 5\n```",
      starter: arr(`removeDuplicates(self, nums: ${A}) -> int`),
      tests: [T([[1, 1, 1, 2, 2, 3]], [1, 1, 2, 2, 3]), T([[0, 0, 1, 1, 1, 1, 2, 3, 3]], [0, 0, 1, 1, 2, 3, 3]), T([[1]], [1]), T([[1, 1]], [1, 1]), T([[1, 1, 1, 1]], [1, 1]), T([[1, 2, 3]], [1, 2, 3])],
    },
    283: {
      fn: "moveZeroes", params: ["nums"], in: ["array"], out: "inplace",
      desc: "把数组里所有的 `0` 移到末尾，非零元素保持原来的相对顺序。原地修改，不需要返回值。\n\n```text\n输入  nums = [0,1,0,3,12]\n输出  [1,3,12,0,0]\n```",
      starter: arr(`moveZeroes(self, nums: ${A}) -> None`),
      tests: [T([[0, 1, 0, 3, 12]], [1, 3, 12, 0, 0]), T([[0]], [0]), T([[1, 2]], [1, 2]), T([[0, 0, 1]], [1, 0, 0]), T([[4, 0, 5, 0, 0, 6]], [4, 5, 6, 0, 0, 0])],
    },
    344: {
      fn: "reverseString", params: ["s"], in: ["array"], out: "inplace",
      desc: "`s` 是一个字符数组。原地把它反转，只能用 O(1) 的额外空间，不需要返回值。\n\n```text\n输入  s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\n输出  [\"o\",\"l\",\"l\",\"e\",\"h\"]\n```",
      starter: arr(`reverseString(self, s: List[str]) -> None`),
      tests: [T([["h", "e", "l", "l", "o"]], ["o", "l", "l", "e", "h"]), T([["H", "a", "n", "n", "a", "h"]], ["h", "a", "n", "n", "a", "H"]), T([["a", "b"]], ["b", "a"]), T([["x", "y", "z"]], ["z", "y", "x"])],
    },
    125: {
      fn: "isPalindrome", params: ["s"], in: ["str"], out: "bool",
      desc: "只看字符串里的字母和数字，并且不区分大小写，判断它是不是回文。\n\n```text\n输入  s = \"A man, a plan, a canal: Panama\"\n输出  True           去掉其他字符后是 amanaplanacanalpanama\n```",
      starter: arr(`isPalindrome(self, s: str) -> bool`),
      tests: [T(["A man, a plan, a canal: Panama"], true), T(["race a car"], false), T([" "], true), T(["0P"], false), T(["ab_a"], true), T([".,"], true)],
    },
    680: {
      fn: "validPalindrome", params: ["s"], in: ["str"], out: "bool",
      desc: "最多删除一个字符，判断字符串能否变成回文。\n\n```text\n输入  s = \"abca\"\n输出  True           删掉 b 或 c\n```",
      starter: arr(`validPalindrome(self, s: str) -> bool`),
      tests: [T(["aba"], true), T(["abca"], true), T(["abc"], false), T(["deeee"], true), T(["cbbcc"], true), T(["abcda"], false), T(["eeccccbebaeeabebccceea"], false)],
    },
    167: {
      fn: "twoSum", params: ["numbers", "target"], in: ["array", "int"], out: "array",
      desc: "数组**已按升序排列**。找出和为 `target` 的两个数，返回它们的下标 `[i, j]`，下标**从 1 开始**，`i < j`。保证恰好有一组答案。只能用 O(1) 的额外空间。\n\n```text\n输入  numbers = [2,7,11,15], target = 9\n输出  [1,2]\n```",
      starter: arr(`twoSum(self, numbers: ${A}, target: int) -> ${A}`),
      tests: [T([[2, 7, 11, 15], 9], [1, 2]), T([[2, 3, 4], 6], [1, 3]), T([[-1, 0], -1], [1, 2]), T([[1, 3, 4, 6, 8, 11], 10], [3, 4]), T([[1, 2, 3, 4, 4, 9, 56, 90], 8], [4, 5])],
    },
    11: {
      fn: "maxArea", params: ["height"], in: ["array"], out: "int",
      desc: "`height[i]` 是第 `i` 条竖线的高度。选两条线和 x 轴围成一个容器，返回它最多能装多少水：面积 = 两条线中较矮的高度 × 两条线的距离。\n\n```text\n输入  height = [1,8,6,2,5,4,8,3,7]\n输出  49             选高度为 8 和 7 的两条线：7 × 7\n```",
      starter: arr(`maxArea(self, height: ${A}) -> int`),
      tests: [T([[1, 8, 6, 2, 5, 4, 8, 3, 7]], 49), T([[1, 1]], 1), T([[4, 3, 2, 1, 4]], 16), T([[1, 2, 1]], 2), T([[2, 3, 4, 5, 18, 17, 6]], 17)],
    },
    977: {
      fn: "sortedSquares", params: ["nums"], in: ["array"], out: "array",
      desc: "数组**已按升序排列**，可能有负数。返回每个数的平方组成的数组，同样按升序排列。试着用 O(n) 的时间。\n\n```text\n输入  nums = [-4,-1,0,3,10]\n输出  [0,1,9,16,100]\n```",
      starter: arr(`sortedSquares(self, nums: ${A}) -> ${A}`),
      tests: [T([[-4, -1, 0, 3, 10]], [0, 1, 9, 16, 100]), T([[-7, -3, 2, 3, 11]], [4, 9, 9, 49, 121]), T([[1]], [1]), T([[-2, -1]], [1, 4]), T([[0, 2]], [0, 4])],
    },
    15: {
      fn: "threeSum", params: ["nums"], in: ["array"], out: "unordered",
      desc: "找出数组中所有和为 `0` 的三元组（三个不同位置的数）。结果里不能有重复的三元组；三元组之间、三元组内部的顺序都不限。\n\n```text\n输入  nums = [-1,0,1,2,-1,-4]\n输出  [[-1,-1,2],[-1,0,1]]\n```",
      starter: arr(`threeSum(self, nums: ${A}) -> List[${A}]`),
      tests: [T([[-1, 0, 1, 2, -1, -4]], [[-1, -1, 2], [-1, 0, 1]]), T([[0, 1, 1]], []), T([[0, 0, 0]], [[0, 0, 0]]), T([[0, 0, 0, 0]], [[0, 0, 0]]), T([[-2, 0, 1, 1, 2]], [[-2, 0, 2], [-2, 1, 1]]), T([[3, -2, 1, 0]], [])],
    },
    16: {
      fn: "threeSumClosest", params: ["nums", "target"], in: ["array", "int"], out: "int",
      desc: "从数组中选三个不同位置的数，使它们的和最接近 `target`，返回这个和。保证答案唯一。\n\n```text\n输入  nums = [-1,2,1,-4], target = 1\n输出  2              -1 + 2 + 1 = 2\n```",
      starter: arr(`threeSumClosest(self, nums: ${A}, target: int) -> int`),
      tests: [T([[-1, 2, 1, -4], 1], 2), T([[0, 0, 0], 1], 0), T([[1, 1, 1, 0], -100], 2), T([[1, 2, 4, 8, 16], 15], 14), T([[4, 0, 5, -5, 3, 3, 0, -4, -5], -2], -2)],
    },
    18: {
      fn: "fourSum", params: ["nums", "target"], in: ["array", "int"], out: "unordered",
      desc: "找出数组中所有和为 `target` 的四元组（四个不同位置的数）。结果里不能有重复的四元组；顺序不限。\n\n```text\n输入  nums = [1,0,-1,0,-2,2], target = 0\n输出  [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\n```",
      starter: arr(`fourSum(self, nums: ${A}, target: int) -> List[${A}]`),
      tests: [T([[1, 0, -1, 0, -2, 2], 0], [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]), T([[2, 2, 2, 2, 2], 8], [[2, 2, 2, 2]]), T([[], 0], []), T([[1, 2, 3], 6], []), T([[-3, -1, 0, 2, 4, 5], 2], [[-3, -1, 2, 4]])],
    },
    88: {
      fn: "merge", params: ["nums1", "m", "nums2", "n"], in: ["array", "int", "array", "int"], out: "inplace",
      desc: "`nums1` 和 `nums2` 都按升序排列。`nums1` 的长度是 `m + n`：前 `m` 个是有效元素，后 `n` 个是留给 `nums2` 的空位（填着 0）。把 `nums2` 合并进 `nums1`，结果仍然升序。原地修改 `nums1`，不需要返回值。\n\n```text\n输入  nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\n输出  [1,2,2,3,5,6]\n```",
      starter: arr(`merge(self, nums1: ${A}, m: int, nums2: ${A}, n: int) -> None`),
      tests: [T([[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], [1, 2, 2, 3, 5, 6]), T([[1], 1, [], 0], [1]), T([[0], 0, [1], 1], [1]), T([[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], [1, 2, 3, 4, 5, 6]), T([[2, 0], 1, [1], 1], [1, 2])],
    },
    392: {
      fn: "isSubsequence", params: ["s", "t"], in: ["str", "str"], out: "bool",
      desc: "判断 `s` 是不是 `t` 的子序列：从 `t` 中删去若干字符（可以不删），剩下的字符不改变顺序，能得到 `s`。\n\n```text\n输入  s = \"abc\", t = \"ahbgdc\"\n输出  True\n```",
      starter: arr(`isSubsequence(self, s: str, t: str) -> bool`),
      tests: [T(["abc", "ahbgdc"], true), T(["axc", "ahbgdc"], false), T(["", "abc"], true), T(["abc", ""], false), T(["aab", "ab"], false), T(["ace", "abcde"], true)],
    },
    350: {
      fn: "intersect", params: ["nums1", "nums2"], in: ["array", "array"], out: "sorted",
      desc: "返回两个数组的交集。一个数在两个数组里各出现多少次，结果里就出现其中较少的那个次数；结果的顺序不限。\n\n```text\n输入  nums1 = [1,2,2,1], nums2 = [2,2]\n输出  [2,2]\n```",
      starter: arr(`intersect(self, nums1: ${A}, nums2: ${A}) -> ${A}`),
      tests: [T([[1, 2, 2, 1], [2, 2]], [2, 2]), T([[4, 9, 5], [9, 4, 9, 8, 4]], [4, 9]), T([[1], [2]], []), T([[3, 1, 2], [1, 1]], [1]), T([[2, 2, 2], [2, 2]], [2, 2])],
    },
    844: {
      fn: "backspaceCompare", params: ["s", "t"], in: ["str", "str"], out: "bool",
      desc: "两个字符串分别输入到空白的编辑器里，`#` 表示退格（编辑器为空时退格无效）。判断最后得到的文本是否相同。试着用 O(1) 的额外空间。\n\n```text\n输入  s = \"ab#c\", t = \"ad#c\"\n输出  True           两边都是 ac\n```",
      starter: arr(`backspaceCompare(self, s: str, t: str) -> bool`),
      tests: [T(["ab#c", "ad#c"], true), T(["ab##", "c#d#"], true), T(["a#c", "b"], false), T(["a##c", "#a#c"], true), T(["bxj##tw", "bxo#j##tw"], true), T(["bbbextm", "bbb#extm"], false), T(["xywrrmp", "xywrrmu#p"], true)],
    },
    75: {
      fn: "sortColors", params: ["nums"], in: ["array"], out: "inplace",
      desc: "数组里只有 `0`、`1`、`2` 三种值。原地排序，使相同的值相邻，并按 0、1、2 的顺序排列。不能用库里的排序函数；试着只遍历一次。\n\n```text\n输入  nums = [2,0,2,1,1,0]\n输出  [0,0,1,1,2,2]\n```",
      starter: arr(`sortColors(self, nums: ${A}) -> None`),
      tests: [T([[2, 0, 2, 1, 1, 0]], [0, 0, 1, 1, 2, 2]), T([[2, 0, 1]], [0, 1, 2]), T([[0]], [0]), T([[1, 0]], [0, 1]), T([[2, 2, 1, 0, 0]], [0, 0, 1, 2, 2]), T([[1, 2, 0]], [0, 1, 2])],
    },
    189: {
      fn: "rotate", params: ["nums", "k"], in: ["array", "int"], out: "inplace",
      desc: "把数组向右轮转 `k` 个位置：每次把最后一个元素移到最前面，重复 `k` 次。`k` 可能大于数组长度。原地修改，试着用 O(1) 的额外空间。\n\n```text\n输入  nums = [1,2,3,4,5,6,7], k = 3\n输出  [5,6,7,1,2,3,4]\n```",
      starter: arr(`rotate(self, nums: ${A}, k: int) -> None`),
      tests: [T([[1, 2, 3, 4, 5, 6, 7], 3], [5, 6, 7, 1, 2, 3, 4]), T([[-1, -100, 3, 99], 2], [3, 99, -1, -100]), T([[1, 2], 3], [2, 1]), T([[1], 0], [1]), T([[1, 2, 3], 4], [3, 1, 2])],
    },
    31: {
      fn: "nextPermutation", params: ["nums"], in: ["array"], out: "inplace",
      desc: "把数组原地改成按字典序的**下一个排列**。如果已经是最大的排列（整体降序），就改成最小的排列（升序）。只能用 O(1) 的额外空间。\n\n```text\n输入  nums = [1,3,2]\n输出  [2,1,3]\n```",
      starter: arr(`nextPermutation(self, nums: ${A}) -> None`),
      tests: [T([[1, 2, 3]], [1, 3, 2]), T([[3, 2, 1]], [1, 2, 3]), T([[1, 1, 5]], [1, 5, 1]), T([[1]], [1]), T([[1, 3, 2]], [2, 1, 3]), T([[2, 3, 1]], [3, 1, 2]), T([[1, 5, 1]], [5, 1, 1])],
    },
    42: {
      fn: "trap", params: ["height"], in: ["array"], out: "int",
      desc: "`height[i]` 是第 `i` 根柱子的高度，每根柱子宽 1。下雨之后，柱子之间的凹处能接住多少水？\n\n```text\n输入  height = [0,1,0,2,1,0,1,3,2,1,2,1]\n输出  6\n```",
      starter: arr(`trap(self, height: ${A}) -> int`),
      tests: [T([[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], 6), T([[4, 2, 0, 3, 2, 5]], 9), T([[1]], 0), T([[3, 0, 3]], 3), T([[5, 4, 3]], 0), T([[2, 0, 1, 0, 3]], 5)],
    },
    287: {
      fn: "findDuplicate", params: ["nums"], in: ["array"], out: "int",
      desc: "数组里有 `n + 1` 个数，每个数都在 `1` 到 `n` 之间，其中恰好有一个数出现了不止一次（可能出现多次）。找出这个数。不能修改数组，只能用 O(1) 的额外空间。\n\n```text\n输入  nums = [1,3,4,2,2]\n输出  2\n```",
      starter: arr(`findDuplicate(self, nums: ${A}) -> int`),
      tests: [T([[1, 3, 4, 2, 2]], 2), T([[3, 1, 3, 4, 2]], 3), T([[1, 1]], 1), T([[2, 2, 2, 2, 2]], 2), T([[1, 4, 6, 2, 5, 3, 6]], 6)],
    },
  };
})();
