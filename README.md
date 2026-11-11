# prep

LeetCode 与系统设计的备考站，自用。纯静态，没有构建步骤。

```bash
python3 -m http.server 5190
```

打开 `http://localhost:5190/`。

| 文件 | 内容 |
| --- | --- |
| `data.js` | 类型与题库；有 `groups` 的类型才有页面 |
| `topics/<slug>/article.md`、`cheatsheet.md` | 每个类型的文章与 cheatsheet |
| `media/` | 视频成片 |
| `videos/` | 视频源码（HyperFrames），`videos/_kit` 是系列风格 |
| `app.js`、`style.css`、`index.html` | 页面 |

进度存在浏览器的 localStorage，页头可以导出、导入 JSON。标为“需复习”的题在 1、3、7、14 天后依次回到总览，四次之后记为熟练。

加一个类型：在 `data.js` 里给它补 `groups`，写 `topics/<slug>/` 下的两个 Markdown；有视频就把成片放到 `media/` 并填 `video`。
