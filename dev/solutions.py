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

# —— 数组与双指针 ——
S[27] = '''
class Solution:
    def removeElement(self, nums, val):
        slow = 0
        for x in nums:
            if x != val: nums[slow] = x; slow += 1
        return slow
'''
S[26] = '''
class Solution:
    def removeDuplicates(self, nums):
        slow = 0
        for x in nums:
            if slow < 1 or x != nums[slow - 1]: nums[slow] = x; slow += 1
        return slow
'''
S[80] = '''
class Solution:
    def removeDuplicates(self, nums):
        slow = 0
        for x in nums:
            if slow < 2 or x != nums[slow - 2]: nums[slow] = x; slow += 1
        return slow
'''
S[283] = '''
class Solution:
    def moveZeroes(self, nums):
        slow = 0
        for fast in range(len(nums)):
            if nums[fast] != 0:
                nums[slow], nums[fast] = nums[fast], nums[slow]; slow += 1
'''
S[344] = '''
class Solution:
    def reverseString(self, s):
        l, r = 0, len(s) - 1
        while l < r: s[l], s[r] = s[r], s[l]; l += 1; r -= 1
'''
S[125] = '''
class Solution:
    def isPalindrome(self, s):
        l, r = 0, len(s) - 1
        while l < r:
            if not s[l].isalnum(): l += 1
            elif not s[r].isalnum(): r -= 1
            elif s[l].lower() != s[r].lower(): return False
            else: l += 1; r -= 1
        return True
'''
S[680] = '''
class Solution:
    def validPalindrome(self, s):
        def ok(l, r):
            while l < r:
                if s[l] != s[r]: return False
                l += 1; r -= 1
            return True
        l, r = 0, len(s) - 1
        while l < r:
            if s[l] != s[r]: return ok(l + 1, r) or ok(l, r - 1)
            l += 1; r -= 1
        return True
'''
S[167] = '''
class Solution:
    def twoSum(self, numbers, target):
        l, r = 0, len(numbers) - 1
        while l < r:
            s = numbers[l] + numbers[r]
            if s == target: return [l + 1, r + 1]
            if s < target: l += 1
            else: r -= 1
'''
S[11] = '''
class Solution:
    def maxArea(self, height):
        l, r, best = 0, len(height) - 1, 0
        while l < r:
            best = max(best, min(height[l], height[r]) * (r - l))
            if height[l] < height[r]: l += 1
            else: r -= 1
        return best
'''
S[977] = '''
class Solution:
    def sortedSquares(self, nums):
        l, r, res = 0, len(nums) - 1, [0] * len(nums)
        for k in range(len(nums) - 1, -1, -1):
            if abs(nums[l]) > abs(nums[r]): res[k] = nums[l] ** 2; l += 1
            else: res[k] = nums[r] ** 2; r -= 1
        return res
'''
S[15] = '''
class Solution:
    def threeSum(self, nums):
        nums.sort(); res = []; n = len(nums)
        for i in range(n - 2):
            if i and nums[i] == nums[i - 1]: continue
            l, r = i + 1, n - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s < 0: l += 1
                elif s > 0: r -= 1
                else:
                    res.append([nums[i], nums[l], nums[r]]); l += 1; r -= 1
                    while l < r and nums[l] == nums[l - 1]: l += 1
                    while l < r and nums[r] == nums[r + 1]: r -= 1
        return res
'''
S[16] = '''
class Solution:
    def threeSumClosest(self, nums, target):
        nums.sort(); best = nums[0] + nums[1] + nums[2]
        for i in range(len(nums) - 2):
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if abs(s - target) < abs(best - target): best = s
                if s < target: l += 1
                elif s > target: r -= 1
                else: return s
        return best
'''
S[18] = '''
class Solution:
    def fourSum(self, nums, target):
        nums.sort(); res = []; n = len(nums)
        for a in range(n - 3):
            if a and nums[a] == nums[a - 1]: continue
            for b in range(a + 1, n - 2):
                if b > a + 1 and nums[b] == nums[b - 1]: continue
                l, r = b + 1, n - 1
                while l < r:
                    s = nums[a] + nums[b] + nums[l] + nums[r]
                    if s < target: l += 1
                    elif s > target: r -= 1
                    else:
                        res.append([nums[a], nums[b], nums[l], nums[r]]); l += 1; r -= 1
                        while l < r and nums[l] == nums[l - 1]: l += 1
                        while l < r and nums[r] == nums[r + 1]: r -= 1
        return res
'''
S[88] = '''
class Solution:
    def merge(self, nums1, m, nums2, n):
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]: nums1[k] = nums1[i]; i -= 1
            else: nums1[k] = nums2[j]; j -= 1
            k -= 1
'''
S[392] = '''
class Solution:
    def isSubsequence(self, s, t):
        i = 0
        for c in t:
            if i < len(s) and s[i] == c: i += 1
        return i == len(s)
'''
S[350] = '''
class Solution:
    def intersect(self, nums1, nums2):
        nums1.sort(); nums2.sort(); i = j = 0; res = []
        while i < len(nums1) and j < len(nums2):
            if nums1[i] < nums2[j]: i += 1
            elif nums1[i] > nums2[j]: j += 1
            else: res.append(nums1[i]); i += 1; j += 1
        return res
'''
S[844] = '''
class Solution:
    def backspaceCompare(self, s, t):
        def nxt(x, i):          # 从 i 往前，下一个没被删掉的字符的下标
            skip = 0
            while i >= 0:
                if x[i] == "#": skip += 1
                elif skip: skip -= 1
                else: break
                i -= 1
            return i
        i, j = len(s) - 1, len(t) - 1
        while True:
            i, j = nxt(s, i), nxt(t, j)
            if i < 0 or j < 0: return i < 0 and j < 0
            if s[i] != t[j]: return False
            i -= 1; j -= 1
'''
S[75] = '''
class Solution:
    def sortColors(self, nums):
        lo, i, hi = 0, 0, len(nums) - 1
        while i <= hi:
            if nums[i] == 0: nums[lo], nums[i] = nums[i], nums[lo]; lo += 1; i += 1
            elif nums[i] == 2: nums[hi], nums[i] = nums[i], nums[hi]; hi -= 1
            else: i += 1
'''
S[189] = '''
class Solution:
    def rotate(self, nums, k):
        def rev(l, r):
            while l < r: nums[l], nums[r] = nums[r], nums[l]; l += 1; r -= 1
        n = len(nums); k %= n
        rev(0, n - 1); rev(0, k - 1); rev(k, n - 1)
'''
S[31] = '''
class Solution:
    def nextPermutation(self, nums):
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]: i -= 1
        if i >= 0:
            j = len(nums) - 1
            while nums[j] <= nums[i]: j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        l, r = i + 1, len(nums) - 1
        while l < r: nums[l], nums[r] = nums[r], nums[l]; l += 1; r -= 1
'''
S[42] = '''
class Solution:
    def trap(self, height):
        l, r, lm, rm, res = 0, len(height) - 1, 0, 0, 0
        while l < r:
            if height[l] < height[r]:
                lm = max(lm, height[l]); res += lm - height[l]; l += 1
            else:
                rm = max(rm, height[r]); res += rm - height[r]; r -= 1
        return res
'''
S[287] = '''
class Solution:
    def findDuplicate(self, nums):
        slow = fast = 0
        while True:
            slow, fast = nums[slow], nums[nums[fast]]
            if slow == fast: break
        p = 0
        while p != slow: p, slow = nums[p], nums[slow]
        return p
'''
