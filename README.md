# prep

LeetCode 与系统设计的备考站，自用。纯静态，没有构建步骤。

```bash
python3 -m http.server 5190
```

打开 `http://localhost:5190/`。

| 文件 | 内容 |
| --- | --- |
| `data.js` | 类型与题库；有 `groups` 的类型才有页面 |
| `topics/<slug>/cheatsheet.md` | 每个类型的 cheatsheet |
| `problems.js` | 页内做题的题面、起始代码与用例 |
| `harness.py`、`runner.js` | 判题脚本，由浏览器里的 Pyodide 在 Worker 中执行 |
| `dev/` | 参考解法与 `check.py`：改完用例后运行 `python3 dev/check.py` |
| `media/` | 视频成片 |
| `videos/` | 视频源码（HyperFrames），`videos/_kit` 是系列风格 |
| `app.js`、`style.css`、`index.html` | 页面 |
| `sync.js` | 跨设备同步：进度与页内代码存到私有 GitHub Gist |

进度存在浏览器的 localStorage，页头可以导出、导入 JSON。页头的“同步”填一次只带 `gist` 权限的 GitHub token 后，进度和页内代码会自动在设备之间同步（按每道题的最后修改时间合并）。标为“需复习”的题在 1、3、7、14 天后依次回到总览，四次之后记为熟练。

加一个类型：在 `data.js` 里给它补 `groups`，写 `topics/<slug>/cheatsheet.md`；有视频就把成片放到 `media/` 并填 `video`；要能页内做题，就在 `problems.js` 里补这道题，并在 `dev/solutions.py` 里放参考解法。
