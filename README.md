# PTO 设计系统｜协作使用说明

这是一份打包好的 **PTO 设计系统**，可以丢给任何 AI 编程工具（Claude Code、Cursor、Windsurf、ChatGPT 文件上传…），让它**自动**按 PTO 的颜色、字体、间距、组件规范来生成或改造网页。

> 简单说：你给 AI 一个产品需求或现有 demo，AI 会按 PTO 样式产出网页，**不需要你再手动调样式**。

## 这个文件夹里有什么

```
design-system-share/
├── README.md                    ← 当前文件，给你看的使用说明
├── SKILL.md                     ← 给 AI 看的规则（让 AI 先读这个）
├── DESIGN.md                    ← 设计系统全景说明（颜色 / 字体 / 间距 / 组件 / 治理）
├── design-system-preview.html   ← 用浏览器打开就能看到所有组件长什么样
├── references/
│   ├── quick-reference.md       ← 一页速查：所有 token 和 class 名
│   ├── pto-design-system-map.md ← 元素分类规则（什么时候用什么按钮）
│   ├── retrofit-container-audit.md ← 改造 demo 时检查旧卡片/面板边框残留
│   └── preview-gate.md          ← 遇到系统没有的样式时的审批流程
├── tokens/                      ← CSS 变量（颜色 / 间距 / 圆角 / 字体）
│   ├── foundation.css
│   ├── semantic.css
│   └── components.css
├── css/style.css                ← 真正的 class 实现
├── swimlane/styles.css          ← swimlane 模块样式（预览页要用）
└── patterns/                    ← 6 个可复用 pattern（图节点 / 泳道 / 内存架构 / AIV / AIC / Pass-IR）
```

## 在三种环境里加载

有两种用法：**装成 Skill**（Claude 系工具，自动触发、按需读文件）和 **当文件包**（其他工具，手动丢给它）。

### 1. CLI — Claude Code

技能目录名**必须等于 `SKILL.md` 里的 `name` 字段**（本系统为 `pto-design-system`）。

```bash
# 个人级（所有项目可用）
git clone https://github.com/yinyucheng0601/pto-design-system \
  ~/.claude/skills/pto-design-system

# 或项目级（只在某个项目可用）
git clone https://github.com/yinyucheng0601/pto-design-system \
  <你的项目>/.claude/skills/pto-design-system
```

重启 Claude Code，`/` 列表里能看到 `pto-design-system`。命中 description 描述的场景（建 PTO 新页面 / 改造 demo）会**自动触发**，也可手动 `/pto-design-system` 调用。

### 2. 网页版 + 桌面 App — Claude.ai / Claude Desktop

两者同一账号，**上传一次两端都生效**，桌面 App 不用单独装。

1. 把 `design-system-share/` 打包成 **.zip**，确保 zip 内顶层就是包含 `SKILL.md` 的文件夹（GitHub「Download ZIP」会多一层 `-main` 外壳，要先解压再重新打包）。
2. 进入 Settings → Capabilities → **Skills**（需 Pro / Max / Team / Enterprise）。
3. 上传 zip，启用。之后新对话里会按 description 自动触发。

> 不想装 Skill 也可以用 **Projects**：把文件加进项目知识库即可，但不会自动触发，且文件夹层级会被拍平，体验弱于 Skill。

### 3. Codex / Cursor / Windsurf / ChatGPT 等

这些工具**没有 Skill 自动加载机制**，只能当文件包用：

- **Codex**：把 `design-system-share/` 放进项目，在项目根的 `AGENTS.md` 里加一句——「生成或改造页面前先读 `design-system-share/SKILL.md`，严格复用其中的 token 和 class」。
- **Cursor / Windsurf / ChatGPT 等**：直接把整个文件夹丢进对话，并在指令里要求「先读 `SKILL.md`」。

具体手动用法见下面「怎么用」。

## 怎么用

> 下面的「丢文件夹给 AI」适用于**当文件包**的场景；如果已按上面装成 Skill，文件已在本地，AI 会自己按需读，你只要直接说需求即可。

### 第 0 步：先在浏览器打开看看

双击打开 `design-system-preview.html`，先大致扫一眼系统长什么样，方便后面验收 AI 的输出。

### 场景 A：从产品需求生成新页面

1. 把整个 `design-system-share/` 文件夹一起丢给 AI 工具
2. 给 AI 这样的指令：

   > 先读 `SKILL.md`。我要一个 PTO 样式的新页面，用途是：[在这里写你的产品需求，比如"算子调试面板，左侧文件树、中间代码编辑器、右侧 inspector"]。按 Workflow A 来做。

3. AI 会：
   - 列出页面需要哪些 UI 元素（按钮、面板、表格、卡片…）
   - 把每个元素对应到 PTO 已有的 class 和 token
   - 产出符合 PTO 样式的 HTML / CSS

### 场景 B：把现有 demo 改成 PTO 样式

1. 把 `design-system-share/` 文件夹 **+ 你的 demo 文件** 一起丢给 AI
2. 给 AI 这样的指令：

   > 先读 `SKILL.md`。把这个 demo 改造成 PTO 样式，按 Workflow B 来做。

3. AI 会先给你一张 **迁移对照表**，告诉你它打算把哪个元素换成哪个 PTO class、哪些颜色换成哪个 token、哪些旧容器装饰要删除：

   | demo 里的元素 | 对应 PTO 组件 | 用的 class / token | 要删除的旧装饰 |
   |---|---|---|---|
   | `<button class="cta">运行</button>` | solid 主按钮 | `btn btn-solid` | 无 |
   | `background: #1a1a1a` | surface-2 | `var(--surface-2)` | 无 |
   | `.card { border-left: 3px solid #5b8cff }` | inspector section / soft card | `inspector-section` / `inspector-soft-card` | 左侧高亮描边 |

4. 你看一遍没问题，让它继续，AI 就会真的改 HTML / CSS

## 验收 AI 输出时检查这几点

打开生成的页面，对比 `design-system-preview.html`，确认：

- 所有颜色都用 `var(--color-...)` 或 `var(--surface-...)`，**没有硬编码的 `#xxxxxx`**
- 间距用 `var(--space-1)` ~ `var(--space-6)`，**不要写死 `padding: 13px`**
- 按钮用 `btn` / `btn btn-solid` / `btn btn-ghost`，**没有 `.my-button`、`.custom-cta` 这种自创 class**
- 旧 demo 的卡片/面板边框已消除：尤其不要留下旧的 `border-left`、伪元素竖条、左侧 inset shadow、侧向渐变高亮
- AI 在最后会列出**"复用了哪些 PTO 组件"**和**"哪些地方系统没覆盖到"**
- 改造 demo 时，AI 在最后会列出 **Container decoration residue**，说明旧容器装饰是否已删除或为什么保留
- 如果 AI 偷偷加了新颜色 / 新按钮样式但**没有标注**，直接打回让它改

## 遇到 PTO 系统没覆盖的情况怎么办

如果你的需求里有一个组件 PTO 现在没有（比如要一个特殊的进度条），AI 会：

1. **停下来**，不会瞎造
2. 做一个 preview 给你看：现有最接近的是什么、它想新加的是什么、各种状态长什么样
3. 等你说"可以用这个"再继续

详见 `references/preview-gate.md`。

## 一些常见问题

**Q：我必须用 Claude 吗？**
不用。任何能读文件夹的 AI 都行（Cursor / Windsurf / Cline / ChatGPT 文件上传 / Gemini 等）。SKILL.md 是给 AI 看的纯文本规则。

**Q：AI 没按 SKILL.md 来怎么办？**
在指令里**强调一次**：「请先读 `SKILL.md`，并按里面的 Workflow A/B 输出」。大多数情况这一句就够了。

**Q：我自己改了 PTO 主仓库的 token，这个文件夹会自动同步吗？**
不会，这是一份**复制**。主仓库改动后需要把 `DESIGN.md` / `design-system-preview.html` / `tokens/*` / `css/style.css` / `swimlane/styles.css` / `patterns/` 重新复制进来。

**Q：可以把 AI 生成的新组件回流到 PTO 系统里吗？**
可以而且应该。流程是：AI 先做 preview → 你审核 → 审核通过后**先把样式塞进 `tokens/` 和 `css/style.css`**，**再**让业务模块去消费。绝对不要先在业务模块里用、回头再补到系统里。

## 反馈 / 改进

发现 AI 经常踩同一个坑，告诉我，我会把规则写进 `SKILL.md`。
