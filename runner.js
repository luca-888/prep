// Web Worker：加载 Pyodide，执行 harness.py 里的 run_all。放在 Worker 里是为了死循环时主页面可以直接终止它。
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
const ready = (async () => {
  const py = await loadPyodide();
  py.runPython(await (await fetch("harness.py?v=2")).text());
  postMessage({ ready: true });
  return py;
})();
ready.catch((e) => postMessage({ fatal: String(e) }));
onmessage = async (e) => {
  const py = await ready;
  py.globals.set("USER_CODE", e.data.code);
  py.globals.set("SPEC", e.data.spec);
  postMessage({ id: e.data.id, res: py.runPython("run_all(USER_CODE, SPEC)") });
};
