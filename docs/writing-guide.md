# 博客内容编写与更新指南

本指南说明如何在本博客中撰写文章、添加生活条目、维护「关于」页面，以及本地预览与发布的完整流程。

---

## 一、内容类型与存放位置

博客内容由三块构成，都是 Markdown 文件（`.md`），由 Astro 的内容集合（Content Collections）管理：

| 类型 | 目录 | 页面路径 | 用途 |
| --- | --- | --- | --- |
| 文章 | `src/content/posts/` | `/posts/<slug>/` | 博客正文（技术笔记、随笔等） |
| 生活条目 | `src/content/life/` | 聚合显示在 `/life` | 音乐 / 游戏 / 摄影等卡片 |
| 关于页 | `src/content/about/` | `/about` | 「关于我」页面 |

每个 `.md` 文件顶部有一段用 `---` 包裹的 **Frontmatter**，用来写标题、日期、分类等元信息，下面是正文。

---

## 二、文章（posts）编写

### 2.1 Frontmatter 字段

```yaml
---
title: "文章标题"          # 必填
description: "一句话摘要"   # 选填，显示在列表卡片上
cover: "/cat.png"          # 选填，封面图；不填则用默认占位图
coverAlt: "封面描述"        # 选填，封面的 alt 文本
date: 2026-08-11           # 必填，发布日期（YYYY-MM-DD）
updated: 2026-08-15        # 选填，最后修改时间
category: "theme1"         # 选填，见下方分类表
tags: ["博客", "Astro"]     # 选填，标签数组，默认 []
draft: false               # 选填，true 表示草稿，不发布
---
```

### 2.2 分类（category）

| 值 | 含义 |
| --- | --- |
| `theme1` | 开篇 |
| `theme2` | 论文重读 |
| `theme3` | agent 学习 |
| `theme4` | 杂谈 |

新增或改名分类，改 `src/config/categories.ts` 里的 `POST_CATEGORY_SLUGS` 和 `postCategoryLabels`。

### 2.3 完整示例

```markdown
---
title: "我的第一篇文章"
description: "记录搭建博客的初衷与过程。"
cover: "/cat.png"
date: 2026-08-11
category: "theme1"
tags: ["博客", "Astro"]
---

## 写在前面

正文从这里开始……

:::note[提示]
这是提示块。
:::
```

---

## 三、生活条目（life）编写

生活条目展示在 `/life` 页面，按分类以卡片呈现（音乐/游戏等为「图 + 标题」卡片，摄影为相册）。

### 3.1 Frontmatter 字段

```yaml
---
title: "艾尔登法环"                  # 必填
description: "FromSoftware"          # 选填，一句话说明
image: "https://example.com/xx.jpg"  # 必填，封面图
link: "https://store.steampowered.com/app/1245620/"  # 选填，外链（点击卡片可跳转）
date: 2022-02-25                    # 必填
category: "gaming"                  # 必填，见下方分类表
---
```

### 3.2 分类（category）

| 值 | 含义 | 是否在 life 页展示 |
| --- | --- | --- |
| `music` | 音乐 | ✅ |
| `gaming` | 游戏 | ✅ |
| `photography` | 摄影 | ✅（相册形式） |
| `anime` | 番剧 | ✅ |
| `movie` | 电影 | ❌（未启用） |
| `reading` | 阅读 | ❌（未启用） |
| `travel` | 旅行 | ❌（未启用） |
| `other` | 其他 | ❌（未启用） |

> 未启用的分类在 schema 中合法，但不会出现在 `/life` 页。要启用，在 `src/config/categories.ts` 的 `FEATURED_LIFE_CATEGORY_SLUGS` 数组里加上对应值。

### 3.3 摄影相册（特殊字段）

`photography` 分类额外需要 `images` 字段（相册里可翻页的多张图）：

```yaml
---
title: "某次旅行"
description: "照片若干"
image: "/life/photo1.jpeg"           # 必填，相册封面/第一张
images: ["/life/photo2.jpeg", "/life/photo3.jpeg"]  # 必填（仅 photography），其余照片
date: 2026-08-01
category: "photography"
---
```

### 3.4 相关文章联动

生活分类的「相关文章」一栏，会把 **tags 命中别名** 的文章自动挂到对应分类下：

| 生活分类 | 命中的文章标签 |
| --- | --- |
| music | `音乐`、`music` |
| photography | `摄影`、`photography`、`photo` |
| gaming | `游戏`、`gaming`、`game` |
| anime | `番剧`、`动漫`、`anime` |

例如某篇文章 `tags: ["游戏"]`，会自动出现在 `/life` 的「游戏」分类下方。别名可在 `src/config/categories.ts` 的 `lifePostTagAliases` 里改。

---

## 四、关于页（about）

文件：`src/content/about/profile.md`，Frontmatter 只有 `title` 和 `description`，正文即页面内容。

```markdown
---
title: "关于我"
description: "个人介绍"
---

## 你好

这里是关于页的正文。
```

---

## 五、Markdown 语法速查

正文（文章、关于页）支持标准 Markdown（GFM）和两套自定义语法。

### 5.1 标准语法

| 语法 | 写法 | 说明 |
| --- | --- | --- |
| 标题 | `## 二级标题` / `### 三级标题` | 支持 1–6 级 |
| 加粗 | `**加粗**` | |
| 斜体 | `*斜体*` | |
| 删除线 | `~~删除~~` | |
| 行内代码 | `` `code` `` | |
| 代码块 | ```` ```ts ... ``` ```` | 可指定语言 |
| 列表 | `- 项` / `1. 项` | 支持嵌套 |
| 引用 | `> 引用文字` | |
| 链接 | `[文字](https://...)` | |
| 图片 | `![alt](url)` | |
| 分割线 | `---` | |
| 表格 | GFM 表格 | 见下例 |
| 任务列表 | `- [ ]` / `- [x]` | 显示为复选框 |

表格示例：

```markdown
| 列 A | 列 B |
| --- | --- |
| 1 | 2 |
| 3 | 4 |
```

### 5.2 自定义语法一：Callout 提示块

用 `:::` 包裹，支持 `note` / `tip` / `warning` / `danger`（标题 `[xxx]` 可选）：

```markdown
:::note[提示]
这是普通提示。
:::

:::tip
绿色提示，可以没有标题。
:::

:::warning[警告]
注意这一点。
:::

:::danger[危险]
这里是危险操作。
:::
```

### 5.3 自定义语法二：行内带 class 的元素

```markdown
这里是 :span[重点内容]{.highlight}，还有 :span[下划线]{.underline}。
```

- `{.highlight}` 高亮、`{.underline}` 下划线、`{.strike}` 删除线，均已内置样式。
- 想用别的 class，在 `src/styles/prose.css` 的「行内指令常用 class」区添加对应样式即可。
- 不写 `{.xxx}` 时，`:` 后面的名字本身会作为 class（如 `:note[文字]` → `<span class="note">`）。

---

## 六、文件名与 slug 规则

- **文章**：文件名即 URL 路径。`first_commit.md` → `/posts/first_commit/`。
  - 建议用**小写英文/数字**，单词间用 `-` 或 `_` 分隔，避免中文或空格导致 URL 编码问题。
- **以 `_` 开头的文件会被 Astro 忽略**（如 `_draft.md`），不会进入内容集合。适合做临时草稿。
- **生活条目 / 关于页**：文件名只是内部 id，不影响 URL，可随意命名（现有内容用了 `作者-曲名.md` 的格式）。

---

## 七、草稿与发布

- 写草稿：把文章的 `draft: true`，它就不会出现在主页、归档、标签、生活页和搜索里，也不会生成文章详情页。
- 发布：删掉 `draft` 字段或改为 `draft: false`。

---

## 八、更新与部署流程

```bash
npm install      # 首次或依赖变更后
npm run dev      # 本地开发，热更新，浏览器访问 http://localhost:4321
npm run build    # 构建静态站点到 dist/
npm run preview  # 本地预览构建产物
npm run check    # TypeScript / Astro 类型检查
```

典型工作流：

1. `npm run dev` 起本地服务。
2. 新建/编辑 `src/content/posts/` 或 `src/content/life/` 下的 `.md` 文件，浏览器即时看到效果。
3. 确认无误后 `git commit` 并推送到仓库。
4. 部署平台（Netlify）会监听 Git 仓库，自动执行 `npm run build` 并发布，无需手动操作。

> 图片等静态资源放进 `public/` 目录，引用时用根路径，如 `public/life/photo1.jpeg` → `/life/photo1.jpeg`。外链图片直接写完整 URL 即可。

### 标签、阅读进度与全站搜索

- 继续在文章 Frontmatter 中填写 `tags: ["博客", "Astro"]`。文章卡片、正文和侧栏中的标签可直接点击，进入同标签文章列表；筛选页可切换标签或返回全部文章。相同标签使用一致的名称和大小写。
- 文章详情页自动显示顶部 2px 阅读进度条，根据正文位置计算，不需要添加字段。
- 全站搜索通过导航栏放大镜打开，也支持 `Ctrl / ⌘ K` 或 `/`。可搜索文章标题、标签、摘要、正文，以及当前生活页展示的条目、关于页和友链；多个关键词用空格分隔，中文和英文均可用。
- `npm run build` 自动生成 `dist/search-index.json`；开发模式中由同一路径实时读取内容。无需手动维护索引、额外构建命令、搜索服务或 API 密钥。索引在访客首次打开搜索时加载，随后在当前页面复用。
- 搜索结果会跳转到对应文章，或自动切换生活分类并定位到条目。新增内容后仍按原有流程构建、发布即可；已打开的页面刷新后可获取新索引。

---

## 九、样式修改快速定位

| 想改什么 | 改哪里 |
| --- | --- |
| 正文排版（标题/段落/代码/表格/引用等） | `src/styles/prose.css`，按 Markdown 元素分区 |
| 提示块（callout）配色与图标 | `src/styles/prose.css` 的「Callout 提示块」区 |
| 颜色 / 深色模式 / 设计变量 | `src/styles/global.css` 顶部的变量区 |
| 分类与标签名称 | `src/config/categories.ts` |
| 站点名称 / 作者 / 描述 | `src/config/site.ts` |
| 导航栏菜单 | `src/config/navigation.ts` |
| 友链 | `src/data/friends.ts`（数据文件，非 Markdown） |
