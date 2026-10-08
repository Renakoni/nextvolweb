export const project = "https://github.com/Renakoni/nextvol";
export const releases = `${project}/releases`;
export const issues = `${project}/issues`;

/** Each page of the home deck is one volume of the NextVol series. */
export const volumes = [
  { id: "cover", label: "封面", title: ["下一卷，", "就在手边。"] },
  { id: "sources", label: "自选来源", title: ["故事从哪来，", "由你来选。"] },
  { id: "progress", label: "按卷追读", title: ["一卷读完，", "下一卷接上。"] },
  { id: "paper", label: "自己的纸张", title: ["这一页，", "是你的。"] },
  { id: "shelf", label: "随身书库", title: ["合上书，", "故事还在。"] },
  { id: "afterword", label: "后记", title: ["后记"] },
  { id: "colophon", label: "版权页", title: ["下一卷，", "等你翻开。"] },
] as const;

export const downloadTitle = { title: ["把下一卷，", "带在身边。"] };

export const sources = [
  {
    id: "legado",
    name: "阅读 3.0 书源",
    image: "sources",
    alt: "NextVol 书源管理：内置书源，以及已添加并启用的阅读 3.0 文本书源",
    lead: "导入常用的阅读 3.0 文本书源，搜索、发现、目录和正文都按书源规则运行。",
    fine: "仅支持文本书源；能否读取取决于规则写法与站点状态。",
  },
  {
    id: "local",
    name: "本地藏书",
    image: "library",
    alt: "NextVol 书架：本地书籍标签下的四本原创示例书",
    lead: "EPUB、TXT 导入后自动解析目录，和其他书放进同一个书架。",
    fine: "导入的书会在设备上保存一份独立副本。",
  },
  {
    id: "novel",
    name: "轻小说",
    image: "volumes",
    alt: "NextVol 轻小说详情：目录按卷展开，每卷显示已读章数",
    lead: "内置轻小说书源，排行、分类，目录按卷展开，读到第几卷一眼看清。",
    fine: "内容来自第三方站点，以站点实际状态为准。",
  },
] as const;

export const papers = [
  { id: "clear", name: "清纸", note: "清纸 · 白天也不刺眼" },
  { id: "sage", name: "豆绿", note: "豆绿 · 给眼睛留一点绿意" },
  { id: "night", name: "夜读", note: "夜读 · 熄灯以后接着读" },
] as const;

export const covers = [
  { file: "cover-1", name: "夜航信笺" },
  { file: "cover-0", name: "风经过的地方" },
  { file: "cover-2", name: "夏日慢行" },
  { file: "cover-3", name: "山海来信" },
] as const;

export const questions = [
  {
    q: "NextVol 能在哪些设备上用？",
    a: "目前支持 Android 7.0 及以上。鸿蒙原生版和 iOS 版尚未开发。",
  },
  {
    q: "支持哪些阅读 3.0 书源？",
    a: "支持阅读 3.0（Legado）的文本书源，可通过链接或文件导入，使用书源里的搜索、发现、目录和正文规则。实际可用性取决于规则写法和站点状态；音频、漫画类书源和部分扩展接口不在兼容范围内。",
  },
  {
    q: "本地的 EPUB、TXT 能直接读吗？",
    a: "可以。导入后解析目录、加入书架，书籍副本保存在设备里。网络书籍也可以下载可用章节离线阅读，具体取决于书源。",
  },
  {
    q: "备份会包含哪些内容？",
    a: "书架、阅读进度、书签和设置，可选包含已缓存的章节。原始 EPUB、TXT 文件需要另外保存。它不是阅读 3.0 的数据迁移，也不是云同步。",
  },
  {
    q: "什么时候能下载？",
    a: "安装包会发布在 GitHub Releases，下载页会自动显示最新版本。发布之前，可以在 GitHub 关注项目，获得发布通知。",
  },
] as const;
