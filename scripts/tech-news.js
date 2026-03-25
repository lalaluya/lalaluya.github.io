const fs = require('fs');
const path = require('path');
const BLOG_DIR = path.join(__dirname, '..');

const RSS_FEEDS = [
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: '36kr', url: 'https://36kr.com/feed/' }
];

const POSTS_DIR = path.join(__dirname, '..', 'source/_posts');

async function fetchWithTimeout(url, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response.text();
  } catch (error) {
    clearTimeout(id);
    console.error(`Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
    const itemXml = match[1];
    const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[2] || '';
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const desc = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/)?.[1] || itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/)?.[2] || '';
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    
    if (title && link) {
      items.push({ title: title.trim(), link: link.trim(), description: desc.trim().replace(/<[^>]+>/g, '').substring(0, 200), pubDate });
    }
  }
  return items;
}

function generatePostContent(news) {
  const date = new Date().toISOString().split('T')[0];
  let content = `---
title: 科技新闻速报 - ${date}
date: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}
categories:
  - 科技新闻
tags:
  - 资讯
  - 科技
---

# 科技新闻速报

> 每日科技新闻汇总，来自 Hacker News、TechCrunch、36氪

---

`;

  news.forEach((item, index) => {
    content += `## ${index + 1}. ${item.title}

${item.description || '暂无描述'}

**来源**: ${item.source}

[查看原文](${item.link})

---

`;
  });

  content += `
> 本速报由自动脚本生成
`;

  return content;
}

async function main() {
  console.log('开始获取科技新闻...');
  
  const allNews = [];
  
  for (const feed of RSS_FEEDS) {
    console.log(`正在获取: ${feed.name}...`);
    const xml = await fetchWithTimeout(feed.url);
    if (xml) {
      const items = parseRSS(xml);
      items.forEach(item => item.source = feed.name);
      allNews.push(...items);
      console.log(`  获取到 ${items.length} 条新闻`);
    }
  }

  if (allNews.length === 0) {
    console.error('未能获取到任何新闻，请检查网络连接');
    process.exit(1);
  }

  const date = new Date().toISOString().split('T')[0];
  const filename = `tech-news-${date}.md`;
  const filepath = path.join(POSTS_DIR, filename);
  
  const content = generatePostContent(allNews);
  fs.writeFileSync(filepath, content, 'utf8');
  
  console.log(`\n已生成文章: ${filepath}`);
  console.log(`共 ${allNews.length} 条新闻`);

  if (process.argv.includes('--deploy')) {
    console.log('\n开始部署博客...');
    try {
      execSync('npx hexo clean', { cwd: BLOG_DIR, stdio: 'inherit' });
      execSync('npx hexo g -d', { cwd: BLOG_DIR, stdio: 'inherit' });
      console.log('部署完成!');
    } catch (error) {
      console.error('部署失败:', error.message);
      process.exit(1);
    }
  } else {
    console.log('\n如需部署，请运行: node scripts/tech-news.js --deploy');
  }
}

main();
