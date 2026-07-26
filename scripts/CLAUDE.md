# scripts/
> L2 | 父级: /CLAUDE.md

## 成员清单

**brain-bytes-curation.js**: Brain & Bytes 主题策展表，导出 TOPICS 与 SLUG_TOPICS，把 56 篇论文 slug 映射到主题分区

**generate-bytes-index.js**: Brain & Bytes 索引生成器，扫描 `public/brain-bytes/<slug>/index.html`，抽取标题/论文/作者/年份/topic，并幂等注入返回 Brain & Bytes 的导航条

**generate-posts-index.js**: 博客索引生成器，扫描 `public/posts/` 的 Markdown 文件，提取 Frontmatter 元数据与完整内容，输出至 `public/posts/index.json`，依赖 fs、path、gray-matter

**test-brain-bytes-terminal.js**: Brain & Bytes OS 终端逐行启动、浏览器标题与论文档案叙事的轻量 Node 断言测试，验证入口终端按行逐步显现且文案只服务论文展示

---

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
