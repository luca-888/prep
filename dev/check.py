# python3 dev/check.py：参考解法应通过全部用例，起始代码应一题都不过。
import json, os, subprocess, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root); sys.path.insert(0, os.path.join(root, "dev"))
import harness
from solutions import S
P = json.loads(subprocess.check_output(["node", "-e", "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.PROBLEMS))", os.path.join(root, "problems.js")]))
ids = json.loads(subprocess.check_output(["node", "-e", "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.TOPICS.flatMap(t=>(t.groups||[]).flatMap(g=>g.problems.map(p=>p[0])))))", os.path.join(root, "data.js")]))
bad = 0
for i in ids:
    p = P.get(str(i))
    if not p: print(i, "没有题面"); bad += 1; continue
    r = json.loads(harness.run_all(S[i], json.dumps(p)))
    fails = [t for t in r.get("tests", []) if not t["ok"]]
    if "error" in r or fails:
        bad += 1; print(i, "参考解法未通过", r.get("error") or fails)
    r0 = json.loads(harness.run_all(p["starter"], json.dumps(p)))
    if "error" in r0 or all(t["ok"] for t in r0["tests"]):
        bad += 1; print(i, "起始代码异常", r0.get("error") or "全部通过")
print(f"{len(ids)} 题，{bad} 个问题")
sys.exit(1 if bad else 0)
