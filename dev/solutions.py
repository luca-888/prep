# 参考解法，只给 dev/check.py 校验用例用。
S = {}
S[83] = '''
class Solution:
    def deleteDuplicates(self, head):
        cur = head
        while cur and cur.next:
            if cur.next.val == cur.val: cur.next = cur.next.next
            else: cur = cur.next
        return head
'''
S[237] = '''
class Solution:
    def deleteNode(self, node):
        node.val = node.next.val
        node.next = node.next.next
'''
S[61] = '''
class Solution:
    def rotateRight(self, head, k):
        if not head: return head
        n, tail = 1, head
        while tail.next: tail, n = tail.next, n + 1
        tail.next = head
        for _ in range(n - k % n): tail = tail.next
        head, tail.next = tail.next, None
        return head
'''
S[203] = '''
class Solution:
    def removeElements(self, head, val):
        dummy = ListNode(0, head); prev = dummy
        while prev.next:
            if prev.next.val == val: prev.next = prev.next.next
            else: prev = prev.next
        return dummy.next
'''
MERGE = '''
def merge(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val: tail.next, a = a, a.next
        else: tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
'''
S[21] = MERGE + '''
class Solution:
    def mergeTwoLists(self, list1, list2): return merge(list1, list2)
'''
S[2] = '''
class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = tail = ListNode(); c = 0
        while l1 or l2 or c:
            c += (l1.val if l1 else 0) + (l2.val if l2 else 0)
            tail.next = ListNode(c % 10); tail = tail.next; c //= 10
            l1 = l1.next if l1 else None; l2 = l2.next if l2 else None
        return dummy.next
'''
S[82] = '''
class Solution:
    def deleteDuplicates(self, head):
        dummy = ListNode(0, head); prev = dummy
        while prev.next:
            cur = prev.next
            if cur.next and cur.next.val == cur.val:
                while cur.next and cur.next.val == cur.val: cur = cur.next
                prev.next = cur.next
            else: prev = cur
        return dummy.next
'''
S[86] = '''
class Solution:
    def partition(self, head, x):
        d1 = t1 = ListNode(); d2 = t2 = ListNode()
        while head:
            if head.val < x: t1.next = head; t1 = head
            else: t2.next = head; t2 = head
            head = head.next
        t2.next = None; t1.next = d2.next
        return d1.next
'''
S[24] = '''
class Solution:
    def swapPairs(self, head):
        dummy = ListNode(0, head); prev = dummy
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            prev.next, a.next, b.next = b, b.next, a
            prev = a
        return dummy.next
'''
S[23] = '''
class Solution:
    def mergeKLists(self, lists):
        h = [(n.val, i, n) for i, n in enumerate(lists) if n]
        heapify(h); dummy = tail = ListNode()
        while h:
            _, i, n = heappop(h); tail.next = n; tail = n
            if n.next: heappush(h, (n.next.val, i, n.next))
        return dummy.next
'''
REV = '''
def rev(head):
    prev = None
    while head: head.next, prev, head = prev, head, head.next
    return prev
'''
S[206] = REV + '''
class Solution:
    def reverseList(self, head): return rev(head)
'''
S[92] = '''
class Solution:
    def reverseBetween(self, head, left, right):
        dummy = ListNode(0, head); p = dummy
        for _ in range(left - 1): p = p.next
        cur = p.next
        for _ in range(right - left):
            nxt = cur.next; cur.next = nxt.next; nxt.next = p.next; p.next = nxt
        return dummy.next
'''
S[25] = '''
class Solution:
    def reverseKGroup(self, head, k):
        dummy = ListNode(0, head); p = dummy
        while True:
            q = p
            for _ in range(k):
                q = q.next
                if not q: return dummy.next
            cur = p.next
            for _ in range(k - 1):
                nxt = cur.next; cur.next = nxt.next; nxt.next = p.next; p.next = nxt
            p = cur
'''
S[876] = '''
class Solution:
    def middleNode(self, head):
        slow = fast = head
        while fast and fast.next: slow, fast = slow.next, fast.next.next
        return slow
'''
S[19] = '''
class Solution:
    def removeNthFromEnd(self, head, n):
        dummy = ListNode(0, head); slow = fast = dummy
        for _ in range(n): fast = fast.next
        while fast.next: slow, fast = slow.next, fast.next
        slow.next = slow.next.next
        return dummy.next
'''
S[141] = '''
class Solution:
    def hasCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast: return True
        return False
'''
S[142] = '''
class Solution:
    def detectCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast:
                p = head
                while p is not slow: p, slow = p.next, slow.next
                return p
        return None
'''
S[160] = '''
class Solution:
    def getIntersectionNode(self, headA, headB):
        a, b = headA, headB
        while a is not b:
            a = a.next if a else headB
            b = b.next if b else headA
        return a
'''
S[143] = REV + '''
class Solution:
    def reorderList(self, head):
        slow = fast = head
        while fast.next and fast.next.next: slow, fast = slow.next, fast.next.next
        second, slow.next = rev(slow.next), None
        first = head
        while second:
            n1, n2 = first.next, second.next
            first.next, second.next = second, n1
            first, second = n1, n2
'''
S[234] = REV + '''
class Solution:
    def isPalindrome(self, head):
        slow = fast = head
        while fast and fast.next: slow, fast = slow.next, fast.next.next
        b = rev(slow)
        while b:
            if b.val != head.val: return False
            b, head = b.next, head.next
        return True
'''
S[148] = MERGE + '''
class Solution:
    def sortList(self, head):
        if not head or not head.next: return head
        slow, fast = head, head.next
        while fast and fast.next: slow, fast = slow.next, fast.next.next
        mid, slow.next = slow.next, None
        return merge(self.sortList(head), self.sortList(mid))
'''
S[138] = '''
class Solution:
    def copyRandomList(self, head):
        m = {None: None}; c = head
        while c: m[c] = Node(c.val); c = c.next
        c = head
        while c: m[c].next = m[c.next]; m[c].random = m[c.random]; c = c.next
        return m[head]
'''
S[146] = '''
class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity; self.d = OrderedDict()
    def get(self, key):
        if key not in self.d: return -1
        self.d.move_to_end(key); return self.d[key]
    def put(self, key, value):
        self.d[key] = value; self.d.move_to_end(key)
        if len(self.d) > self.cap: self.d.popitem(last=False)
'''
