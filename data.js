// 题库。一个类型一项；有 groups 的类型才有页面，其余在总览里显示为“未开始”。
// 题目：[题号, 标题, leetcode.com 的 slug, 难度, 一句话要点]
// 加一个类型：在这里补 groups，再写 topics/<slug>/cheatsheet.md；有视频就把成片放到 media/ 并填 video。
window.TOPICS = [
  { slug: "array-two-pointers", title: "数组与双指针", kind: "algo" },
  { slug: "sliding-window", title: "滑动窗口", kind: "algo" },
  { slug: "binary-search", title: "二分查找", kind: "algo" },
  { slug: "stack", title: "栈与单调栈", kind: "algo" },
  { slug: "heap", title: "堆", kind: "algo" },
  {
    slug: "linked-list", title: "链表", kind: "algo",
    video: "media/linked-list-patterns.mp4",
    groups: [
      { name: "基本动作：改指针", problems: [
        [83, "Remove Duplicates from Sorted List", "remove-duplicates-from-sorted-list", "Easy", "cur.next 与 cur 同值就绕过，否则前进"],
        [237, "Delete Node in a Linked List", "delete-node-in-a-linked-list", "Medium", "拿不到前驱：把后一个节点的值抄过来，再删后一个"],
        [61, "Rotate List", "rotate-list", "Medium", "先求长度并首尾相连，再在 n - k % n 处断开"],
      ] },
      { name: "手法 1：哑节点", problems: [
        [203, "Remove Linked List Elements", "remove-linked-list-elements", "Easy", "dummy 让头节点也有前驱，一段循环处理全部节点"],
        [21, "Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", "dummy 占住结果的头，tail 每次接较小的一个"],
        [2, "Add Two Numbers", "add-two-numbers", "Medium", "dummy 加进位；循环条件是 l1 or l2 or carry"],
        [82, "Remove Duplicates from Sorted List II", "remove-duplicates-from-sorted-list-ii", "Medium", "头节点也可能被删；prev 停在重复段之前，整段绕过"],
        [86, "Partition List", "partition-list", "Medium", "两个 dummy 各接一条链，最后首尾相连，大链末尾置 None"],
        [24, "Swap Nodes in Pairs", "swap-nodes-in-pairs", "Medium", "prev 之后的两个节点换位，共改三根指针"],
        [23, "Merge k Sorted Lists", "merge-k-sorted-lists", "Hard", "堆里放每条链当前的头；或两两归并"],
      ] },
      { name: "手法 2：反转", problems: [
        [206, "Reverse Linked List", "reverse-linked-list", "Easy", "四行：存 nxt、掉头、prev 前进、cur 前进"],
        [92, "Reverse Linked List II", "reverse-linked-list-ii", "Medium", "dummy 走到 left 的前驱，反转一段后把两端接回"],
        [25, "Reverse Nodes in k-Group", "reverse-nodes-in-k-group", "Hard", "先数够 k 个再反转；记住每组的前驱与后继"],
      ] },
      { name: "手法 3：快慢指针", problems: [
        [876, "Middle of the Linked List", "middle-of-the-linked-list", "Easy", "fast 走两步，slow 走一步"],
        [19, "Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium", "fast 先走 n 步；从 dummy 出发，slow 停在待删节点的前驱"],
        [141, "Linked List Cycle", "linked-list-cycle", "Easy", "有环则 fast 追上 slow"],
        [142, "Linked List Cycle II", "linked-list-cycle-ii", "Medium", "相遇后一个指针回到 head，两者同速再次相遇处即入环点"],
        [160, "Intersection of Two Linked Lists", "intersection-of-two-linked-lists", "Easy", "走完自己的链就换到对方的头，两者路程相等"],
      ] },
      { name: "组合", problems: [
        [143, "Reorder List", "reorder-list", "Medium", "找中点、反转后半、交替合并"],
        [234, "Palindrome Linked List", "palindrome-linked-list", "Easy", "找中点、反转后半、逐个比较"],
        [148, "Sort List", "sort-list", "Medium", "归并排序：找中点断开，递归后合并两个有序链表"],
        [138, "Copy List with Random Pointer", "copy-list-with-random-pointer", "Medium", "哈希表存旧节点到新节点；或把副本插在原节点之后"],
        [146, "LRU Cache", "lru-cache", "Medium", "哈希表加双向链表；头尾各放一个哑节点"],
      ] },
    ],
  },
  { slug: "tree", title: "树", kind: "algo" },
  { slug: "graph", title: "图", kind: "algo" },
  { slug: "backtracking", title: "回溯", kind: "algo" },
  { slug: "dp", title: "动态规划", kind: "algo" },
  { slug: "intervals", title: "区间", kind: "algo" },
  { slug: "prefix-sum", title: "前缀和", kind: "algo" },
  { slug: "union-find", title: "并查集", kind: "algo" },
  { slug: "trie", title: "字典树", kind: "algo" },
  { slug: "bit", title: "位运算", kind: "algo" },

  { slug: "sd-framework", title: "答题框架与容量估算", kind: "sd" },
  { slug: "sd-cache", title: "缓存", kind: "sd" },
  { slug: "sd-queue", title: "消息队列", kind: "sd" },
  { slug: "sd-sharding", title: "分库分表与一致性", kind: "sd" },
  { slug: "sd-rate-limiter", title: "限流器", kind: "sd" },
  { slug: "sd-url-shortener", title: "短链", kind: "sd" },
  { slug: "sd-feed", title: "Feed 流", kind: "sd" },
  { slug: "sd-chat", title: "聊天", kind: "sd" },
];
