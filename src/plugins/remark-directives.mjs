// 将 Markdown 中的自定义指令语法渲染为可样式化的 HTML。
// 配合 astro.config.mjs 里的 remark-directive 使用，顺序必须在 remark-directive 之后。
//
// 支持语法：
//   :::note[标题]       -> <div class="callout callout-note"><div class="callout-title">标题</div>...</div>
//   :::tip / :::warning / :::danger / :::info / :::success（标题可选）
//   :span[文字]{.class} -> <span class="class">文字</span>（未写 class 时用指令名作为 class）
//
// 提示块的标题 [标题] 会被解析为容器内第一个带 directiveLabel 标记的段落。
import { visit } from 'unist-util-visit';

export default function remarkDirectiveRenderer() {
  return (tree) => {
    visit(tree, (node) => {
      // 1) 容器指令 -> callout 提示块
      if (node.type === 'containerDirective') {
        const type = (node.name || '').toLowerCase();
        const data = (node.data = node.data || {});
        data.hName = 'div';
        data.hProperties = { className: ['callout', `callout-${type}`] };

        // 提取标题段（[标题]），改渲染成 .callout-title
        const first = node.children && node.children[0];
        if (first && first.type === 'paragraph' && first.data && first.data.directiveLabel) {
          first.data.hName = 'div';
          first.data.hProperties = { className: ['callout-title'] };
        }
        return;
      }

      // 2) 行内指令 -> 带 class 的 span（属性语法）
      if (node.type === 'textDirective') {
        const data = (node.data = node.data || {});
        data.hName = 'span';
        const raw = node.attributes && node.attributes.class;
        const classes = raw
          ? String(raw).split(/[\s.]+/).filter(Boolean)
          : [node.name];
        data.hProperties = { className: classes };
      }
    });
  };
}
