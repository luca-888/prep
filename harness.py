# 判题脚本：在浏览器里由 Pyodide 执行（runner.js），也可以在本地用 CPython 跑（dev/check.py）。
# run_all(用户代码, 题目 JSON) 返回 JSON：{"error": ...} 或 {"tests": [{ok, expect, got, err, out}]}
import copy
import io
import json
import sys
import traceback

PRELUDE = """
from typing import *
from collections import *
from heapq import *
from functools import *
import collections, heapq, functools, itertools, math, bisect, random
"""
LIMIT = 10000


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return f"ListNode({self.val})"


class Node:  # 138：带 random 指针的节点
    def __init__(self, x, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random


def build(vals):
    dummy = tail = ListNode()
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


def dump(head):
    out = []
    while head is not None:
        if not isinstance(head, ListNode):
            raise TypeError(f"期望 ListNode 或 None，得到 {type(head).__name__}")
        out.append(head.val)
        head = head.next
        if len(out) > LIMIT:
            raise RuntimeError("结果链表有环")
    return out


def nodes_of(head, n):
    out = []
    for _ in range(n):
        out.append(head)
        head = head.next
    return out


def build_cycle(vals, pos):
    head = build(vals)
    if pos >= 0:
        ns = nodes_of(head, len(vals))
        ns[-1].next = ns[pos]
    return head


def conv_in(tp, v):
    if tp == "list":
        return build(v)
    if tp == "lists":
        return [build(x) for x in v]
    return copy.deepcopy(v)     # 数组可能被原地修改，不动用例本身


def run_case(S, p, t):
    kind, a = p.get("kind", "plain"), t["args"]
    if kind == "design":            # a = [操作名列表, 参数列表]，第一个操作是构造函数
        obj = S[a[0][0]](*a[1][0])
        return [None] + [getattr(obj, op)(*args) for op, args in zip(a[0][1:], a[1][1:])]
    f = getattr(S[p.get("cls", "Solution")](), p["fn"])
    if kind == "plain":
        args = [conv_in(tp, v) for tp, v in zip(p["in"], a)]
        r = f(*args)
        if p["out"] == "list":
            return dump(r)
        if p["out"] == "inplace":   # 原地修改第一个参数：链表或数组
            return dump(args[0]) if p["in"][0] == "list" else args[0]
        if p["out"] in ("prefix", "prefix_sorted"):   # 返回长度 k，比较数组的前 k 个（prefix_sorted：顺序不限）
            if not isinstance(r, int) or isinstance(r, bool):
                raise TypeError(f"期望返回 int，得到 {type(r).__name__}")
            head = args[0][:r]
            return sorted(head) if p["out"] == "prefix_sorted" else head
        if p["out"] in ("sorted", "unordered"):       # 顺序不限的结果：sorted 排一层，unordered 里外都排
            if not isinstance(r, (list, tuple)):
                raise TypeError(f"期望返回 list，得到 {type(r).__name__}")
            return sorted(r) if p["out"] == "sorted" else sorted(sorted(x) for x in r)
        return r
    if kind == "delete_node":       # a = [值, 待删节点的下标]
        head = build(a[0])
        f(nodes_of(head, a[1] + 1)[-1])
        return dump(head)
    if kind == "cycle":             # a = [值, 尾节点指向的下标（-1 为无环）]
        head = build_cycle(a[0], a[1])
        ns = nodes_of(head, len(a[0]))
        r = f(head)
        if p["out"] == "bool":
            return r
        if r is None:
            return -1
        for i, n in enumerate(ns):
            if n is r:
                return i
        raise RuntimeError("返回的不是链表中的节点")
    if kind == "intersection":      # a = [A 独有的部分, B 独有的部分, 公共部分]
        common = build(a[2])

        def join(pre):
            h = build(pre)
            if h is None:
                return common
            ns = nodes_of(h, len(pre))
            ns[-1].next = common
            return h

        r = f(join(a[0]), join(a[1]))
        if r is None:
            return None
        return "交点" if r is common else f"值为 {getattr(r, 'val', r)!r} 的另一个节点"
    if kind == "random_copy":       # a = [[值, random 指向的下标或 None], ...]
        src = [Node(v) for v, _ in a[0]]
        for i, (_, ri) in enumerate(a[0]):
            src[i].next = src[i + 1] if i + 1 < len(src) else None
            src[i].random = src[ri] if ri is not None else None
        r = f(src[0] if src else None)
        orig, cp = {id(n) for n in src}, []
        while r is not None:
            if id(r) in orig:
                raise RuntimeError("副本中出现了原链表的节点")
            cp.append(r)
            r = r.next
            if len(cp) > LIMIT:
                raise RuntimeError("结果链表有环")
        index = {id(n): i for i, n in enumerate(cp)}
        out = []
        for n in cp:
            if n.random is not None and id(n.random) not in index:
                raise RuntimeError("random 指向了副本之外的节点")
            out.append([n.val, index[id(n.random)] if n.random is not None else None])
        return out
    raise ValueError(kind)


def same(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return a is b
    return a == b


def fmt_exc(code):
    et, ev, tb = sys.exc_info()
    lines, out = code.split("\n"), []
    for fr in traceback.extract_tb(tb):
        if fr.filename == "solution.py":
            src = lines[fr.lineno - 1].strip() if 0 < fr.lineno <= len(lines) else ""
            out.append(f"第 {fr.lineno} 行：{src}")
    if isinstance(ev, SyntaxError) and ev.filename == "solution.py":
        out.append(f"第 {ev.lineno} 行：{(ev.text or '').strip()}")
    out = out[-5:]
    out.append(f"{et.__name__}: {ev}")
    return "\n".join(out)


def run_all(code, spec_json):
    p = json.loads(spec_json)
    S = {"ListNode": ListNode, "Node": Node, "__name__": "solution"}
    buf, old = io.StringIO(), sys.stdout
    sys.stdout = buf
    try:
        try:
            exec(PRELUDE, S)
            exec(compile(code, "solution.py", "exec"), S)
        except BaseException:
            return json.dumps({"error": fmt_exc(code), "out": buf.getvalue()[:2000]}, ensure_ascii=False)
        cls = p.get("cls", "Solution")
        if cls not in S:
            return json.dumps({"error": f"没有找到 class {cls}"}, ensure_ascii=False)
        res = []
        for t in p["tests"]:
            buf.seek(0)
            buf.truncate()
            r = {"expect": t["expect"]}
            try:
                r["got"] = run_case(S, p, t)
                r["ok"] = same(r["got"], t["expect"])
            except BaseException:
                r["ok"] = False
                r["err"] = fmt_exc(code)
            r["out"] = buf.getvalue()[:2000]
            res.append(r)
        return json.dumps({"tests": res}, ensure_ascii=False, default=repr)
    finally:
        sys.stdout = old
