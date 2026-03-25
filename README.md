# 咔咔咔迪斯科的博客

> 基于 Hexo + Fluid 主题的静态博客

---

## 一、项目信息

| 配置 | 值 |
|------|-----|
| 框架 | Hexo 7.3.0 |
| 主题 | fluid 1.9.8 |
| 部署 | GitHub Pages |
| 仓库 | lalaluya.github.io |
| 域名 | www.lesterhome.asia（暂未备案） |

---

## 二、快速开始

```bash
cd /Users/lalaluya/-blog

# 安装依赖
npm install

# 本地预览
hexo server

# 生成静态文件
hexo generate

# 部署到 GitHub
hexo deploy
```

---

## 三、文章管理

### 3.1 文章目录
```
source/_posts/
├── index.md              # 欢迎页（置顶）
├── iOS-Base.md           # iOS 开发基础知识
├── Auto-Layout-Core-Graphics.md
├── iOS-Performance-Optimization.md
└── tech-news-2026-03-16.md  # 科技新闻速报
```

### 3.2 创建新文章
```bash
hexo new "文章标题"
# 或手动在 source/_posts/ 下创建 .md 文件
```

### 3.3 文章格式
```markdown
---
title: 文章标题
date: 2025-02-28
categories:
  - 分类1
  - 分类2
tags:
  - 标签1
---

# 正文内容
```

### 3.4 文章日期规范
- 日期应与文件实际修改时间一致
- 使用 `YYYY-MM-DD` 格式

---

## 四、主题配置

### 4.1 配置文件
- `_config.yml` - Hexo 根配置
- `themes/fluid/_config.yml` - Fluid 主题配置

### 4.2 主题功能
| 功能 | 状态 |
|------|------|
| 首页 Banner | ✓ |
| 文章 Banner | ✓ |
| 归档页 Banner | ✓ |
| 代码高亮 | ✓ |
| 本地搜索 | ✓ |
| RSS 订阅 | ✓ |
| Sitemap | ✓ |
| Gitalk 评论 | 待配置 |

### 4.3 域名配置
> ⚠️ CNAME 中的域名暂未备案，已注释
- 文件位置：`CNAME`
- 恢复时取消注释即可

---

## 五、部署流程

### 5.1 自动部署
```bash
hexo clean && hexo generate && hexo deploy
```

### 5.2 手动部署
1. 修改 `_config.yml` 中的 deploy 配置
2. 执行 `hexo deploy`

### 5.3 GitHub Pages 设置
- 仓库：`lalaluya/lalaluya.github.io`
- 分支：`main`
- 源：GitHub Actions / master 分支

---

## 六、科技新闻速报

### 6.1 概述
自动化科技新闻聚合，每周更新。

### 6.2 来源
- Hacker News
- TechCrunch
- 36氪

### 6.3 生成方式
手动执行脚本或 CI 自动化生成。

---

## 七、待办事项

### 高优先级
- [ ] 域名备案完成后恢复 CNAME
- [ ] 配置 Gitalk 评论系统
- [ ] 科技新闻自动化采集脚本

### 中优先级
- [ ] 添加更多技术文章
- [ ] 配置 RSS 订阅
- [ ] SEO 优化

### 低优先级
- [ ] 自定义主题样式
- [ ] 添加简历页面
- [ ] 配置 CDN 加速

---

## 八、常见问题

### 8.1 部署失败
检查 `_config.yml` 中 deploy 配置是否正确：
```yaml
deploy:
  type: git
  repo: https://github.com/lalaluya/lalaluya.github.io.git
  branch: main
```

### 8.2 主题样式异常
```bash
hexo clean
hexo generate
```

### 8.3 文章不显示
检查文章 front-matter 是否完整：
```markdown
---
title: xxx
date: YYYY-MM-DD
---
```

---

## 九、文件索引

| 文件/目录 | 说明 |
|-----------|------|
| `_config.yml` | Hexo 主配置 |
| `source/` | 博客内容（文章、页面） |
| `source/_posts/` | 文章目录 |
| `themes/fluid/` | 主题文件 |
| `public/` | 生成的静态文件 |
| `db.json` | 本地搜索数据库 |
| `CNAME` | 自定义域名（已禁用） |
| `.deploy_git/` | 部署临时目录 |

---

## 十、相关链接

- [Hexo 文档](https://hexo.io/zh-cn/docs/)
- [Fluid 主题文档](https://hexo-fluid.github.io/)
- [GitHub Pages](https://pages.github.com/)
