import { createServer } from 'node:http';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Original demonstration books, used only to capture the real Android app.
// Text and geometric cover artwork are authored for this project, CC0.
const root = 'evidence/product/fixture';
await mkdir(root, { recursive: true });
const titles = ['风经过的地方', '夜航信笺', '夏日慢行', '山海来信'];
const palettes = [['#d7e8c0', '#2d594a', '#f4edbb'], ['#213fc4', '#bdceef', '#fba888'], ['#f3a565', '#b94435', '#fbe6ae'], ['#428379', '#d8e7bd', '#193f46']];
const paragraphs = [
  '清晨六点，小镇还没有醒来。车站旁的面包店亮起了第一盏灯，风从街角转过来，带着刚出炉的麦香。',
  '我把车票夹进书里，沿着海边的小路慢慢往前走。今天没有必须赶上的列车，也没有非去不可的地方。',
  '昨天借来的那本书还剩下最后一章。书页边缘有一点卷起，像一片准备离开枝头的叶子。我一直舍不得读完。',
  '桥上站着一位提着水壶的老人。他每天在这个时间给栏杆边的花浇水，今天也一样。看到我，他抬起手，指了指远处的灯塔。',
  '「今天看得很清楚。」他说。',
  '海面是一整块安静的蓝。几只鸟贴着水面飞过，影子一闪就散了。我想起书里的那句话：有些风景，只有停下来才能遇见。',
  '我在长椅上坐下，把那张车票放回口袋，翻开了下一页。阳光刚好落在第一行字上。',
];
for (let i = 0; i < titles.length; i++) {
  const [bg, ink, accent] = palettes[i];
  const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850"><rect width="600" height="850" fill="${bg}"/><circle cx="430" cy="415" r="120" fill="${accent}"/><path d="M0 600Q180 340 320 580T650 530V850H0" fill="${ink}"/><path d="M0 710Q190 500 370 700T650 640" fill="none" stroke="${bg}" stroke-width="3"/><text x="48" y="100" fill="${ink}" font-family="Microsoft YaHei" font-size="18" letter-spacing="3">NEXTVOL ORIGINAL</text><text x="45" y="200" fill="${ink}" font-family="Microsoft YaHei" font-weight="700" font-size="59">${titles[i].slice(0,3)}</text><text x="45" y="278" fill="${ink}" font-family="Microsoft YaHei" font-weight="700" font-size="59">${titles[i].slice(3)}</text><text x="48" y="790" fill="${bg}" font-family="Microsoft YaHei" font-size="22">一段可以慢慢读的故事</text></svg>`;
  await sharp(Buffer.from(cover)).png().toFile(`${root}/cover-${i}.png`);
}
const base = 'http://127.0.0.1:4174';
const source = {
  bookSourceUrl: base, bookSourceName: '纸间书房', bookSourceType: 0,
  bookSourceGroup: '原创故事', enabled: true, enabledExplore: true,
  searchUrl: `${base}/search?q={{key}}`, exploreUrl: `原创故事::${base}/search`,
  ruleSearch: { bookList: '.book', name: 'h2@text', author: '.author@text', bookUrl: 'a@href', coverUrl: 'img@src', intro: '.intro@text' },
  ruleExplore: { bookList: '.book', name: 'h2@text', author: '.author@text', bookUrl: 'a@href', coverUrl: 'img@src', intro: '.intro@text' },
  ruleBookInfo: { name: 'h1@text', author: '.author@text', intro: '.intro@text', coverUrl: 'img@src', tocUrl: '.toc@href' },
  ruleToc: { chapterList: '.chapter', chapterName: 'a@text', chapterUrl: 'a@href' },
  ruleContent: { content: 'article@html' },
};
await writeFile(`${root}/source.json`, JSON.stringify(source, null, 2));
const html = content => `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><body>${content}</body></html>`;
createServer(async (req, res) => {
  const url = new URL(req.url, base);
  if (url.pathname === '/source.json') { res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(source)); return; }
  if (url.pathname.startsWith('/cover-')) { res.setHeader('Content-Type','image/png'); res.end(await readFile(`${root}${url.pathname}`)); return; }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (url.pathname === '/search') {
    res.end(html(titles.map((title, i) => `<section class="book"><a href="${base}/book/${i}"><img src="${base}/cover-${i}.png"><h2>${title}</h2></a><span class="author">NextVol</span><p class="intro">${paragraphs[i]}</p></section>`).join(''))); return;
  }
  const book = Number(url.pathname.split('/')[2] || 0);
  if (url.pathname.startsWith('/book/')) { res.end(html(`<h1>${titles[book]}</h1><span class="author">NextVol</span><p class="intro">${paragraphs[book]}</p><img src="${base}/cover-${book}.png"><a class="toc" href="${base}/toc/${book}">目录</a>`)); return; }
  if (url.pathname.startsWith('/toc/')) { res.end(html(['风来的清晨','沿着海岸线','下一站晴天'].map((title,i)=>`<div class="chapter"><a href="${base}/chapter/${book}/${i}">第${['一','二','三'][i]}章 ${title}</a></div>`).join(''))); return; }
  res.end(html(`<article>${paragraphs.map(p=>`<p>${p}</p>`).join('')}</article>`));
}).listen(4174, '127.0.0.1', () => console.log('Original product research fixture at '+base));
