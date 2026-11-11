"""视频配音送去合成前的文字改写，所有视频共用（规范见 docs/tts.md）。
只改送给 TTS 的写法，配音稿与字幕不变。每条是 (正则, 替换)；新发现的误读先加到这里，再重录受影响的幕。"""
import re

COMMON = [
    # 运算与分数
    (r"1/(\d+)", r"\1 分之一"), (r" × ", " 乘 "),
    # 单位：字母单位会被逐字母读，统一写成中文
    (r"(?<=\d) W\b", " 瓦"),
    # GB、TB 读字母，不读“吉字节 / 太字节”（2026-11-04 用户要求）
    (r"\bTB/s\b", "T B 每秒"), (r"\bGB/s\b", "G B 每秒"), (r"\bTB\b", "T B"), (r"\bGB\b", "G B"), (r"\bMB\b", "M B"), (r"\bKB\b", "K B"), (r" pJ", " 皮焦"), (r" ns", " 纳秒"), (r" ms", " 毫秒"),
    # 数值格式的缩写：字母与数字分开读
    (r"\b(FP|TF|BF)(\d+)", r"\1 \2"), (r"INT8", "int 8"),
    # FLOPS 作一个词读，前缀字母单独读：T flops、G flops；FLOP/B 读“flop 每字节”（2026-10-21：大写 FLOPS 会被逐字母读）
    (r"\bTFLOPS\b", "T flops"), (r"\bGFLOPS\b", "G flops"), (r"FLOP/B", "flop 每字节"), (r"\bFLOPS\b", "flops"), (r"\bFLOP\b", "flop"),
]


def say(text, extra=()):
    """extra 是这部视频自己的术语读法（正则已转义的原文 → 读法），排在通用规则之后。
    extra 一次性替换：长的原文优先匹配，每段原文只替换一次，替换结果不再被其它条目改动
    （例：megakernel → mega kernel 与 kernel → colonel 同时存在时，megakernel 读成 mega kernel）。"""
    for pattern, repl in COMMON:
        text = re.sub(pattern, repl, text)
    if extra:
        pats = sorted(extra, key=lambda x: -len(x[0]))
        rx = re.compile("|".join(p for p, _ in pats))
        text = rx.sub(lambda m: next(r for p, r in pats if re.fullmatch(p, m.group(0))), text)
    # 去掉中文与英文、数字之间的空格（会被读成停顿）；英文词之间的空格保留
    return re.sub(r"(?<=[^\x00-\x7f]) (?=[\x21-\x7e])|(?<=[\x21-\x7e]) (?=[^\x00-\x7f])", "", text)
