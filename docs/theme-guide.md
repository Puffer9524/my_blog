# 主题与样式修改指南

本指南说明博客的配色 / 主题系统是如何工作的，以及如何修改颜色、字体、排版等外观参数。

---

## 一、主题系统概览

博客支持三种主题模式，由导航栏右侧的下拉菜单切换（组件：`src/components/ThemeToggle.astro`）：

| 模式 | 说明 |
| --- | --- |
| 浅色模式（light） | 使用 `global.css` 里 `:root` 定义的浅色变量 |
| 深色模式（dark） | 使用 `global.css` 里 `[data-theme='dark']` 定义的深色变量 |
| 跟随系统（system） | 读取系统 `prefers-color-scheme`，自动在浅 / 深之间切换 |

### 工作原理

- 用户选择会被存进 `localStorage`（键名 `theme-mode`）。
- `ThemeToggle.astro` 底部的脚本会往 `<html>` 元素写入两个属性：
  - `data-theme-mode`：用户选择的模式（`light` / `dark` / `system`）。
  - `data-theme`：**最终解析出的主题**（只会是 `light` 或 `dark`）。
- CSS 通过 `[data-theme='dark']` 这个属性选择器，覆盖 `:root` 里同名的浅色变量，实现换肤。

> 结论：想改颜色，只需改 `global.css` 顶部变量区的值；变量名在浅 / 深两套里保持一致，无需改动组件或页面代码。

---

## 二、设计变量（Design Tokens）

所有全局配色、字体、布局、圆角、阴影都定义在 `src/styles/global.css` 顶部的变量区，分两块：`(:root` 浅色、`[data-theme='dark']` 深色。

### 2.1 颜色变量

| 变量 | 浅色值 | 深色值 | 用途 |
| --- | --- | --- | --- |
| `--color-bg` | `#f3f4f6` | `#010612` | 页面整体背景色 |
| `--color-bg-card` | `#ffffff` | `#05080d14` | 卡片背景色（深色末尾 `14` 是 8 位十六进制的 alpha，约 8% 不透明度，几乎透明） |
| `--color-bg-hover` | `#f3f4f6` | `#07090e` | 悬停态背景（导航项、按钮、表格行等） |
| `--color-text` | `#1a1a1a` | `#e2e8f0` | 正文主文字颜色 |
| `--color-text-secondary` | `#555555` | `#94a3b8` | 次要文字（副标题、说明文字） |
| `--color-text-muted` | `#999999` | `#64748b` | 最淡的文字（时间戳、图注、占位符等） |
| `--color-border` | `#e5e7eb` | `#3a414c` | 边框颜色 |
| `--color-accent` | `#3b82f6` | `#162940` | 强调色（链接、标题装饰线、选中态等） |
| `--color-accent-hover` | `#2563eb` | `#3b82f6` | 强调色的悬停态 |
| `--color-divider` | `#f0f0f0` | `#698eca` | 分隔线颜色 |

> ⚠️ 关于 `--color-bg-card: #05080d14`：这是 8 位十六进制色（RGBA），前 6 位 `#05080d` 是颜色，末尾 `14` 是 alpha = `0x14 / 255 ≈ 7.8%` 不透明度。所以深色模式下卡片背景几乎透明，主要靠边框和阴影勾勒轮廓。若想让卡片更「实」，把 alpha 调大（如 `#05080d80` 约 50%）或直接改不透明色即可。

### 2.2 排版 / 布局 / 圆角 / 阴影变量

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--font-sans` | `'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif` | 正文字体栈 |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', monospace` | 代码 / 等宽字体栈 |
| `--content-max-width` | `1180px` | 页面内容区最大宽度 |
| `--sidebar-width` | `280px` | 左侧栏（个人卡片）宽度 |
| `--toc-width` | `200px` | 右侧栏（目录 TOC）宽度 |
| `--gap` | `24px` | 网格列间距 |
| `--radius-sm` | `8px` | 小圆角（引用块、折叠块、callout 等） |
| `--radius-md` | `12px` | 中圆角（代码块、图片、下拉菜单等） |
| `--radius-lg` | `20px` | 大圆角（卡片） |
| `--shadow-card` | 浅色 `0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)` | 卡片默认阴影 |
| `--shadow-card-hover` | 浅色 `0 4px 12px rgba(0,0,0,.08)` | 卡片悬停阴影 |

> 深色主题下 `--shadow-card` / `--shadow-card-hover` 会在 `[data-theme='dark']` 块内重新定义为更重、透明度更高的阴影（`0 1px 3px rgba(0,0,0,.2) ...`），因为深色背景下浅阴影不易察觉。

### 2.3 内容扩展变量（Prose extras）

表格、callout 提示块、高亮等颜色也走变量，同样分浅 / 深两套：

| 变量 | 用途 |
| --- | --- |
| `--color-table-stripe` | 表格斑马纹（偶数行）背景 |
| `--color-table-header` | 表头背景 |
| `--color-callout-note-bg` / `-border` | `:::note` 提示块背景 / 边框 |
| `--color-callout-tip-bg` / `-border` | `:::tip` 提示块背景 / 边框 |
| `--color-callout-warning-bg` / `-border` | `:::warning` 提示块背景 / 边框 |
| `--color-callout-danger-bg` / `-border` | `:::danger` 提示块背景 / 边框 |
| `--color-highlight` | 高亮文字背景（`mark`、`{.highlight}`） |
| `--color-highlight-text` | 高亮文字颜色（浅色为 `inherit`，深色为 `#fef9c3`） |

---

## 三、文章排版变量（prose.css）

`src/styles/prose.css` 只负责正文（`.prose`）排版。常用可调参数集中在文件顶部 `.prose { ... }` 的「排版变量」区，改一处全局生效：

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--prose-font-size` | `1.03em` | 正文基础字号 |
| `--prose-line-height` | `1.9` | 正文行高 |
| `--prose-paragraph-spacing` | `1.15em` | 段落间距 |
| `--prose-heading-margin-top` | `2em` | 标题上边距 |
| `--prose-heading-margin-bottom` | `0.65em` | 标题下边距 |
| `--prose-code-font-size` | `0.86em` | 行内代码字号 |
| `--prose-h1-size` | `1.75em` | 一级标题字号 |
| `--prose-h2-size` | `1.42em` | 二级标题字号 |
| `--prose-h3-size` | `1.2em` | 三级标题字号 |
| `--prose-h4-size` | `1.08em` | 四级标题字号 |
| `--prose-h5-size` | `1em` | 五级标题字号 |
| `--prose-h6-size` | `0.92em` | 六级标题字号 |

> 颜色部分（正文文字、链接、标题装饰线等）仍然复用 `global.css` 的 `--color-*` 变量，因此换色只需在 `global.css` 改，`prose.css` 会自动跟随，适配深色模式。

### prose.css 中可自行扩展的部分

- **行内指令 class**（文件底部「行内指令常用 class」区）：内置 `.highlight`（高亮）、`.underline`（下划线）、`.strike`（删除线）。要新增 class，直接在该区追加样式即可。
- **Callout 图标**：每种提示块标题前的 emoji 在「标题前的图标」区，用 `content: '💡'` 这类写法定义，可自由替换图标。
- **代码块 mac 红黄绿圆点**：`.prose pre::before` 里的 `#ff5f56 / #ffbd2e / #27c93f` 三个颜色。

---

## 四、主题相关文件速查

| 想改什么 | 改哪里 |
| --- | --- |
| 颜色 / 深色模式 / 字体 / 布局 / 圆角 / 阴影 | `src/styles/global.css` 顶部变量区 |
| 正文排版（标题 / 段落 / 代码 / 表格 / 引用等） | `src/styles/prose.css` |
| 提示块（callout）配色与图标 | `src/styles/prose.css` 的「Callout 提示块」区 |
| 主题切换逻辑（三种模式、localStorage 键名） | `src/components/ThemeToggle.astro` 底部的 `<script>` |
| 站点名称 / 作者 / 头像 / 签名 | `src/config/site.ts` |
| 分类与标签名称 | `src/config/categories.ts` |

---

## 五、修改示例

### 示例 1：整体换成更暖的背景色

只改浅色主题的背景和文字：

```css
:root {
  --color-bg: #fdf6ee;      /* 暖米色背景 */
  --color-text: #2d2a26;    /* 深暖色文字 */
}
```

### 示例 2：让深色卡片更实

把深色卡片背景的 alpha 调大：

```css
[data-theme='dark'] {
  --color-bg-card: #05080d80;   /* 约 50% 不透明度 */
}
```

### 示例 3：加大正文行距

在 `prose.css` 顶部改：

```css
.prose {
  --prose-line-height: 2.05;
}
```

### 示例 4：换强调色

同时改浅 / 深两套，保证两种模式下链接都协调：

```css
:root               { --color-accent: #10b981; --color-accent-hover: #059669; }
[data-theme='dark'] { --color-accent: #34d399; --color-accent-hover: #6ee7b7; }
```

> 提示：改动后运行 `npm run dev`，在浏览器里用右上角主题菜单切换浅 / 深 / 跟随系统，逐项确认效果。
