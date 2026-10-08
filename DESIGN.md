---
name: NextVol
description: 文库本腰封——每一屏都是 NextVol 系列的下一卷，翻页即翻卷。
colors:
  cobalt: "#213fc4"
  periwinkle: "#bdceef"
  salmon: "#fba888"
  apricot: "#f3a565"
  brick: "#b94435"
  cornsilk: "#fbe6ae"
  teal: "#3b776e"
  deepteal: "#193f46"
  mint: "#d8e7bd"
  forest: "#2d594a"
  sage: "#d7e8c0"
  butter: "#f4edbb"
  navy: "#0f1a46"
  vermilion: "#d23a1e"
  obi: "#f6f6f1"
  ink: "#121318"
  ink-soft: "#4b4d57"
  slip-rule: "#d8d8d0"
  slip-chip: "#e9e9e2"
  paper-clear-bg: "#faf9f6"
  paper-clear-text: "#262521"
  paper-sage-bg: "#dce8d5"
  paper-sage-text: "#263327"
  paper-night-bg: "#202322"
  paper-night-text: "#d8ddd6"
typography:
  display:
    fontFamily: "'NV Title', 'Noto Serif CJK SC', 'Source Han Serif SC', 'Songti SC', serif"
    fontSize: "min(calc((100cqh - 30px) / (var(--len) + 0.25)), calc(var(--title-w, 34cqw) / (var(--cols) * 1.16)), 132px)"
    fontWeight: 900
    lineHeight: 1.16
    letterSpacing: "0.03em"
    fontFeature: "'vert', 'vpal' 0"
  headline:
    fontFamily: "'NV Latin', 'NV Sans', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
    fontSize: "clamp(22px, 2.2vw, 34px)"
    fontWeight: 900
    lineHeight: 1.34
    letterSpacing: "0.01em"
  title:
    fontFamily: "'NV Latin', 'NV Sans', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
    fontSize: "clamp(20px, 1.9vw, 30px)"
    fontWeight: 900
    lineHeight: 1.34
  body:
    fontFamily: "'NV Latin', 'NV Sans', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  fine:
    fontFamily: "'NV Latin', 'NV Sans', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
  wordmark:
    fontFamily: "'NV Latin', 'NV Sans', sans-serif"
    fontSize: "clamp(40px, 6cqh, 60px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 86"
  code:
    fontFamily: "'NV Latin', 'NV Sans', sans-serif"
    fontSize: "11px"
    fontWeight: 650
    letterSpacing: "0.22em"
    fontVariation: "'wdth' 115"
rounded:
  plate: "3px"
  slip: "4px"
  page: "6px"
  strip: "14px"
  toc: "20px"
  pill: "999px"
spacing:
  pad: "clamp(20px, 3.4vw, 56px)"
  pad-phone: "18px"
  header: "72px"
  header-phone: "60px"
  obi: "clamp(200px, 29svh, 280px)"
  rail: "104px"
  dog-ear-reserve: "76px"
components:
  button-primary:
    backgroundColor: "{colors.vermilion}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 24px 0 28px"
    height: "54px"
  button-primary-xl:
    backgroundColor: "{colors.vermilion}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 26px 0 30px"
    height: "66px"
  button-chrome:
    backgroundColor: "{colors.vermilion}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 18px 0 20px"
    height: "44px"
  button-quiet:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "54px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.obi}"
    rounded: "{rounded.pill}"
    padding: "0 24px 0 28px"
    height: "54px"
  obi-band:
    backgroundColor: "{colors.obi}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "26px calc(var(--pad) + 24px) 30px calc(var(--pad) + var(--rail-w))"
  tab:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "0 18px 0 16px"
    height: "44px"
  tab-selected:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  release-slip:
    backgroundColor: "{colors.obi}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slip}"
    padding: "clamp(22px, 3cqh, 34px) clamp(22px, 2.4cqw, 34px) clamp(18px, 2.6cqh, 28px)"
  copy-chip:
    backgroundColor: "{colors.slip-chip}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "36px"
  toc-sheet:
    backgroundColor: "{colors.obi}"
    textColor: "{colors.ink}"
    rounded: "{rounded.toc}"
    padding: "18px 8px 10px"
---

# Design System: NextVol

## Overview

**Creative North Star: "文库本腰封（Bunko & Obi）"**

NextVol 的官网是一套轻小说文库本。首页每一个全屏页面都是系列里的下一卷：整面满版的书封色（drenched jacket），右侧一列或两列竖排的重磅明朝体书名，真实的 Android 界面截图作为无框的封面插画压在书封上，下沿被一条白色腰封（obi）压住——访客所有的行动都发生在腰封上。卷与卷之间用一次真实的翻页切换：Three.js 着色器在真实 HTML 之上画出卷曲的书页，旧书封在折痕处被裁切，下一卷完整地躺在下面。左下角永远折着一个书角，露出下一卷的颜色和卷号；它可以悬停、聚焦、拖动、点击。`/download/` 是这套书附带的一张出版单（release slip）。

密度是书店平台上的一本书，而不是网页：一屏只说一件事，书名和插画占满封面，说明文字只在腰封里出现。色彩全部来自 NextVol 自己的 CC0 示例书封，每卷一色、满版铺开；朱红只留给「下载」和「当前卷」。字体是三层：竖排书名用 Noto Serif SC 900，腰封与正文用 Noto Sans SC，卷号、编码、数字和所有拉丁字母用 Archivo 窄宽可变字。

已确认的拒绝：分栏英雄区、手机外壳样机、成排功能卡片。截图永远是印在书封上的插画版面，不是装在手机里的屏幕。

**Key Characteristics:**
- 每屏一卷，满版书封色，卷号 NV-01…NV-07，下载页为 NV-DL。
- 竖排重磅明朝书名，靠右排版，旁附圆形卷号章与竖排编码。
- 真实 Android 截图作无框插画版面，下沿藏入腰封之下。
- 白色腰封承载全部文案与行动；第 4 卷腰封跟随读者选的纸张。
- 真实书页卷曲翻卷（WebGL 着色器，CSS 折页兜底），左下角书角预告下一卷。
- 朱红只出现在下载行动与当前卷标记上。

## Colors

一个从自家书封取样的系列色板：每卷一个饱和的满版封面色，配一轮「太阳」与一道山丘，上面压一条近白的腰封。

### Primary
- **钴蓝（cobalt, #213fc4）**：第 1 卷封面与下载页的书封色，也是 `theme-color`。系列的门面色，取自钴蓝示例书封。
- **朱红（vermilion, #d23a1e）**：只用于下载行动（顶栏「下载」、腰封主按钮、下载页 XL 按钮）和当前卷标记（目录轨道的当前横线、目录弹层的当前卷号）。

### Secondary
- **杏橙（apricot, #f3a565）**：第 2 卷「自选来源」书封；配玉米丝太阳（cornsilk, #fbe6ae）与砖红山丘（brick, #b94435）。
- **青绿（teal, #3b776e）**：第 3 卷「随时开听」书封；配深青太阳（deepteal, #193f46）与薄荷山丘（mint, #d8e7bd）。
- **森绿（forest, #2d594a）**：第 5 卷「随身书库」书封；配奶油黄太阳（butter, #f4edbb）与鼠尾草山丘（sage, #d7e8c0）。
- **长春花蓝（periwinkle, #bdceef）**：第 6 卷「后记」书封，第 1 卷与第 7 卷的山丘色，也是下载页安装步骤区的底色。

### Tertiary
- **鲑鱼粉（salmon, #fba888）**：第 1、6、7 卷与下载页的太阳。
- **海军藏青（navy, #0f1a46）**：第 7 卷「版权页」书封与下载页页脚。它**不是**从书封取样的颜色，而是系列的封底——钴蓝封面最深的一次印刷。原因是七卷书只有五个具名书封色，且第 4 卷要跟随读者的纸张，第 7 卷因此用钴蓝的深印收尾。

### Neutral
- **腰封白（obi, #f6f6f1）**：除第 4 卷外所有腰封的底色；版权页卡片、出版单、目录弹层也用它。
- **墨（ink, #121318）**：腰封上的主文字、出版单表头粗线。
- **淡墨（ink-soft, #4b4d57）**：腰封细字、目录次要文字、表格标签。
- **出版单细线（slip-rule, #d8d8d0）** 与 **出版单小钮底（slip-chip, #e9e9e2）**：出版单与版权页的行线、复制/重试小钮和目录弹层的当前行底色。
- **阅读器纸张**：清纸（#faf9f6 / #262521）、豆绿（#dce8d5 / #263327）、夜读（#202322 / #d8ddd6），即 Android 应用 `ReaderPaper` 的真实颜色，只在第 4 卷使用。

### 每卷的配色

| 卷 | 封套 | 太阳 | 山丘 | 封套上文字 / 弱文字 | 腰封 |
| --- | --- | --- | --- | --- | --- |
| 1 封面 | cobalt | salmon | periwinkle（线 salmon） | #ffffff / #d6defb | obi + ink |
| 2 自选来源 | apricot | cornsilk | brick（线 cornsilk） | #3a120a / #6b2716 | obi + ink |
| 3 随时开听 | teal | deepteal | mint（线 deepteal） | #ffffff / #e1eed2 | obi + ink |
| 4 自己的纸张 | 纸张底色 | 纸张太阳 | 纸张山丘（线为纸张强调色） | 纸张文字 / 纸张弱色 | 纸张文字色作底，纸张底色作字 |
| 5 随身书库 | forest | butter | sage（线 butter） | #f3f8e9 / #cfe0b8 | obi + ink |
| 6 后记 | periwinkle | salmon | cobalt（线 salmon） | #14237a / #2a3c98 | obi + ink |
| 7 版权页 | navy | salmon | cobalt（线 salmon） | #f4f5ff / #b3bdea | obi + ink |

每卷的颜色以 `--jacket`、`--on-jacket`、`--on-jacket-soft`、`--sun`、`--hill`、`--hill-line`、`--obi`、`--on-obi`、`--on-obi-soft` 一组变量声明在卷上，并镜像到 `<html data-vol>`，让固定在顶部的标签条和目录轨道跟随当前卷。

### Named Rules
**The One Vermilion Rule.** 朱红只属于下载行动和「当前卷」标记。任何新界面若想用朱红做强调、装饰或状态，答案都是不。

**The Sampled Series Rule.** 新卷的书封色必须从 NextVol 自己的 CC0 示例书封取样，或者是取样色的同色深印（如 navy 之于 cobalt），并在本文件写明来源。不引入书封之外的新色相。

**The Reader's Paper Rule.** 第 4 卷的书封、太阳、山丘和腰封全部跟随读者选择的纸张；腰封反相为纸张文字色。纸张值只能取自应用的 `ReaderPaper`，不做网站专用的近似色。

## Typography

**Display Font:** NV Title = Noto Serif SC 900（书名字形子集；后备 Noto Serif CJK SC、Source Han Serif SC、Songti SC）
**Body Font:** NV Sans = Noto Sans SC 400–900 子集（后备 PingFang SC、Microsoft YaHei、Noto Sans CJK SC）
**Label/Mono Font:** NV Latin = Archivo，ASCII 子集，可变轴 wdth 72–115、wght 500–900

**Character:** 竖排的重磅明朝体像文库本的题字标识，厚重、可辨认；正文黑体干净直接；Archivo 的窄宽变化承担书号、卷号、版本与日期这些「印刷编码」。

全部字体自托管于 `public/fonts/`，OFL 许可证放在 `public/licenses/`。书名字体只包含书名用到的字形，并以 `font-display: block` 加 preload 加载，避免竖排书名先以系统宋体闪现；正文与拉丁字体用 `swap`。**任何文案变更之后都要运行 `node scripts/prepare-fonts.mjs` 重新切子集**，否则新字会落到系统字体。

注意字体栈顺序：`NV Latin` 排在 `NV Sans` 之前，所以正文里的所有拉丁字母和数字（NextVol、3.0、Android 7.0、Apache-2.0）都由 Archivo 排出，中文再落到 Noto Sans SC。

### Hierarchy
- **Display（竖排书名）**（900，按可用高度与栏数计算、上限 132px，手机上限 72px；行高 1.16；字距 0.03em）：每卷封面的书名，`writing-mode: vertical-rl`，一到两列，从右往左读，字号由容器高度除以最长列字数得出，保证整列放下。
- **Headline（腰封主句）**（900，clamp(22px, 2.2vw, 34px)，行高 1.34；手机 clamp(19px, 5.4vw, 23px)）：腰封上的一句话承诺，`text-wrap: balance`。下载页步骤区标题同重量放大到 clamp(32px, 3.6vw, 52px)、行高 1.25。
- **Title（腰封次句）**（900，clamp(20px, 1.9vw, 30px)；手机 clamp(17px, 4.8vw, 20px)）：内容较多的卷用的腰封主句。
- **Body**（400，16px，行高 1.7）：基础正文；FAQ 答案 15px / 1.8，最长 62ch。
- **Fine（腰封细字）**（14px，行高 1.65，淡墨，最长 62ch；手机 13px）：条件、许可、范围说明。
- **Wordmark**（Archivo 800，wdth 86，clamp(40px, 6cqh, 60px)，行高 1，字距 −0.02em）：版权页与出版单上的「NextVol」。顶栏品牌字为 21px / 760 / wdth 92。
- **Code（书号）**（Archivo 650，11px，wdth 115，字距 0.22em，竖排）：NV-01…NV-07、NV-DL。卷号圆章为 Archivo 800、wdth 78、clamp(20px, 2.1vw, 30px)。目录轨道数字 12px / 600 / wdth 110 / 0.08em。

### Named Rules
**The Vertical Ming Rule.** 衬线体只用于竖排书名。不在横排标题、正文或按钮里用明朝体；新增书名必须重切子集。

**The Printed Code Rule.** 卷号、书号、版本号、校验值和步骤序号用 Archivo 并调整宽度轴；中文永远不用 Archivo 的宽度做装饰。

## Layout

每一卷是一个三行网格：顶部标签条（桌面 72px，手机 60px）、书封（剩余高度，作为 `container-type: size` 的容器，内部全部用 cqw/cqh 定位）、腰封（桌面 clamp(200px, 29svh, 280px)；后记与版权页这两卷「后附」只有一句话和一个行动，收成 clamp(112px, 15svh, 140px) 的细腰封，768–1023px 也保持「文案 | 行动」一行；手机按内容自适应）。卷高 max(100svh, 620px)，手机 600px。书名块贴右，距右边距 `--pad`；插画从左侧的目录轨道宽度（104px）之后开始排。太阳和山丘画在书封背后并向上下延伸到标签条和腰封之下；山丘是同一条 SVG 曲线，偶数卷（2、4、6）水平镜像，避免相邻两卷轮廓重复。

**甲板模式（deck）**：首页在有 JS、没有 reduced-motion、视口高度 ≥ 520px 且宽度 ≥ 320px 时进入甲板模式：页面不滚动，所有卷叠放在固定舞台上，只有当前卷和下一卷可见，其余卷 `content-visibility: hidden`。滚轮、方向键、PageUp/PageDown、空格、Home/End、上下滑动、左右拖动、目录链接和 URL hash 都只做一件事：翻到某一卷。卷内可滚动区（FAQ）先滚完自己再翻页。

**流式模式（flow）**：没有 JS、prefers-reduced-motion、视口矮于 520px 时，同样的书封按顺序原生滚动排列，没有翻页、书角和目录轨道；标签条改为页内绝对定位；来源标签页展开为全部面板，换纸选择器隐藏。流式模式必须是完整网站，不是降级提示。

**断点**
- **手机（< 768px）**：插画按宽度定尺（封面截图 58cqw，从书封底部 −16cqh 处伸入腰封下）；腰封单栏、按钮均分整行；目录轨道隐藏，改由顶栏的「01 / 07」目录按钮打开底部弹层；GitHub 链接隐藏；卷号圆章与 NV 编码改为横排、放在书名**上方**。
- **竖屏平板（≥ 768px，portrait）**：插画按宽度定尺（40cqw 左右），书本扇形下移落在山丘上，版权页卡片收窄到 32cqw 并改为单栏表格。
- **768–1023px**：腰封改为单栏，按钮靠左，强制换行取消。
- **≥ 1024px**：腰封两栏，左为文案、右为行动；目录轨道常驻左侧。

### 版式守则（来自碰撞巡检）
- 目录轨道在书封区域内垂直居中：顶部 = 标签条高度 + (视口高 − 标签条 − 当前卷腰封实际高度) / 2；腰封高度在翻到该卷时量一次，只写在轨道自己身上（`--obi-now`），不触发整页重算样式。视口矮于 720px 时每行收到 32px。
- 手机上每个腰封底部保留 76px，左下角属于书角。
- 手机上第 1 卷山丘降到 52%、第 3 卷降到 34%、第 5 卷 58%（第 6 卷 30%），让长书名在山丘之上结束。
- 版权页卡片与目录轨道标签至少相距 24px，与书名至少相距 16px。
- 第 1 卷的翻页提示放在书角右侧（桌面 left 156px，手机 78px），不与书角重叠。

### Named Rules
**The Under-the-Obi Rule.** 插画的下沿永远藏进腰封之下，书名永远在腰封之上结束。任何新卷的截图、书本或纸页都要从书封伸进腰封背后，而不是悬浮在书封中间。

**The Dog-Ear Reserve Rule.** 左下角留给书角。新内容不得进入书角热区（桌面 190px、手机 100px 的三角）；手机腰封底部的 76px 不放任何东西。

## Elevation & Depth

这是印刷品的层次：书封是平的满版色，上面放着「纸」——截图版面、阅读页、书本、版权页卡片、出版单——每一张纸都带一条 1px 发丝边和一道长而柔的投影，好像放在书封上的一张实物。腰封向上投出一道短阴影，表明它压在书封之上。翻页时的阴影由着色器计算：卷曲处的接触阴影、翻起的书页投在下一卷上的柔影，色调偏冷蓝（rgb 0.03, 0.04, 0.09）。没有硬边偏移阴影，没有毛玻璃，没有发光。

### Shadow Vocabulary
- **插画版面（plate）**（`box-shadow: 0 0 0 1px rgb(0 0 0 / 0.1), 0 40px 70px -30px rgb(0 0 0 / 0.55), 0 12px 24px -12px rgb(0 0 0 / 0.35)`）：所有真实截图。
- **出版单 / 版权页（slip）**（`box-shadow: 0 44px 80px -36px rgb(0 0 0 / 0.65), 0 10px 20px -12px rgb(0 0 0 / 0.3)`；版权页为 `0 40px 70px -34px rgb(0 0 0 / 0.7)`）：放在书封上的白卡。
- **腰封（obi）**（`box-shadow: 0 -1px 0 rgb(0 0 0 / 0.08), 0 -18px 40px -26px rgb(0 0 0 / 0.55)`）：腰封压住书封的上沿。
- **书本（book）**（`box-shadow: inset 6px 0 8px -6px rgb(0 0 0 / 0.35), 0 34px 60px -28px rgb(0 0 0 / 0.6), 0 8px 18px -10px rgb(0 0 0 / 0.35)`）：第 5 卷的示例书，左侧内阴影表示书脊。
- **朱红按钮（vermilion lift）**（`box-shadow: 0 14px 28px -14px rgb(0 0 0 / 0.4), inset 0 -2px 0 rgb(0 0 0 / 0.14)`）：主下载按钮，中性投影加底边压痕；不用同色调的彩色光晕。
- **弹层（toc）**（`box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.45), 0 2px 6px rgb(0 0 0 / 0.12)`）：手机目录弹层。

### Named Rules
**The Paper-on-Jacket Rule.** 只有「放在书封上的纸」才有投影，书封本身和腰封上的元素是印刷平面。新增元素先问：它是一张纸吗？不是就不投影。

## Shapes

形态语言是纸张裁切：几乎直角。截图版面 3px 圆角、出版单与版权页 4px、阅读页 6px、示例书 3px/8px（书脊侧更方）。截图和纸页都带一个小角度旋转（−5° 到 +6°，出版单 −1.5°，版权页 −1.5°，阅读页 −2°），像被随手放在书封上。圆只出现在三处：太阳、卷号圆章（2px 描边，手机 1.5px）、以及可交互的胶囊（所有按钮和标签页都是 999px 胶囊）。书角是一个直角三角形，沿 45° 折线翻起。

### Named Rules
**The Plates-Not-Phones Rule.** 真实截图是无框的插画版面：3px 圆角、发丝边、投影，没有手机边框、刘海、状态栏外壳或大圆角屏幕。

## Components

### Buttons
朱红、厚实、可以按下去的胶囊。
- **Shape:** 胶囊（999px）。
- **Primary（下载）:** 朱红底、白字、800 重量、17px，高 54px（手机 52px），内距 0 24px 0 28px，右侧下载图标。悬停上浮 2px、阴影加深，图标下移 2px；按下下沉 1px 并缩到 0.98。
- **XL（下载页）:** 高 66px，两行：主标签 + Archivo 12px 小字（版本与大小，或「GitHub Releases」）。没有真实 .apk 时显示外链箭头并指向发布页；有 .apk 时换成下载图标，`href` 为该文件的 `browser_download_url` 并加 `download` 属性。
- **Chrome（顶栏下载）:** 朱红胶囊，高 44px，15px / 700。
- **Quiet（次要）:** 透明底，1.5px 内描边（腰封文字色 28%），悬停描边变实。用于「查看源码」「在 GitHub 关注」。
- **Ink:** 腰封文字色作底、腰封色作字；用于不是下载的唯一主要行动（如「去 GitHub 提问」）。
- **Focus:** 全站 2.5px currentColor 外框、偏移 4px。

### Chips
- **音色阵容（voice roll）:** 第 3 卷腰封右栏，像有声剧腰封上的演员表一样署名内置音源：13px 小标题「内置音色 · 近百种」，下面一行行「音源名 + 数字」，名字 15px / 800 墨色，数字 Archivo 800、wdth 86、30px，用当卷书封色（第二色墨）印。数字取自应用的内置音源库，应用更新音源时同步改 `src/data/site.ts` 的 `voices`。
- **复制 / 重试小钮:** slip-chip 底、36px 高、13px / 700，悬停加深到 #deded6。

### Cards / Containers
- **腰封（obi band）:** 全宽、无圆角，腰封白底与墨字（第 4 卷反相为纸张色）。左内距让出目录轨道宽度，桌面为「文案 | 行动」两栏。腰封里可放：主句、细字、行动按钮、音色阵容、以斜线分隔的短注（`／`）、或标签页。
- **出版单（release slip）:** 腰封白、4px 圆角、−1.5° 旋转。头部为 Archivo 字标 + 「Android 版」，可选墨色「预览版」小章；状态行固定预留两行；下方是 2px 墨线开头、1px 细线分行的定义表。
- **版权页卡片（colophon）:** 同出版单材质，列平台、源码版本、许可、源码、反馈；链接用 1px 下划线，悬停加粗到 2px。

### Inputs / Fields
- **来源标签页:** 腰封内竖排的胶囊标签，前置 8px 圆点（未选为描边，选中为实心），选中项 8% 墨色底。左右/上下方向键、Home/End 切换。切换时旧截图以 0.42s 加速曲线向下滑入腰封背后，新截图从腰封后以 0.7s expo 曲线升起。手机上标签横排，面板主句至少预留 3em，避免切换跳动。
- **纸张选择（paper strips）:** 三张 64×84px 的小纸样（手机 40×48px），写「Aa」，按下为 `aria-pressed`；悬停上移 4px，选中上移 8px 并加 2.5px 墨色外圈。切换通过 View Transition：新纸张从所点纸样的中心以圆形展开，0.75s expo；不支持或 reduced-motion 时立即换色，各颜色 0.45s 过渡。

### Navigation
- **顶栏标签条:** 固定、透明，左为圆形应用图标 + Archivo 字标 + 「Android 小说阅读器」（手机隐藏），右为 GitHub 与朱红下载。文字色跟随当前卷。
- **目录轨道（rail，≥ 768px）:** 左侧七行，Archivo 卷号前带短横线（28px 宽、以 `scaleX(.5)` 显示为一半，避免宽度过渡）；当前卷横线展开到全长、3px 高、朱红。静止时只印卷号，不印卷名——卷名已经是书封上的竖排大标题，常驻卷名会压到插画。悬停或键盘聚焦时整条轨道展开，衬一块同书封色的圆角底（带 1px 细边和柔和投影），全部卷名印在这块底上，永不叠在内容上。
- **目录弹层（手机）:** 顶栏「01 / 07 ⌄」按钮打开原生 popover，腰封白底、20px 圆角，从底部浮起；当前卷号为朱红。
- **翻页时的色调:** 翻页过程中，品牌、目录按钮、GitHub 和目录轨道各自取其正下方的颜色——仍平躺的旧书封、翻起书页的纸背（墨色）、或正在露出的新书封。

### Page Turn（signature）
真实书页卷曲，是这套书的标志动作。
- **几何:** 书页从左下角翻起（右开本），折线由距离 F、角度 a、卷筒半径 R 决定；静止角 45°，翻完角 11°。
- **渲染:** Three.js 单张全屏四边形的片元着色器只画「翻起的纸背、卷筒和阴影」，旧卷的真实 HTML 留在原处，用 `clip-path` 裁到折线；纸背色为暖灰白，带漫反射、微弱高光和细噪点。DPR 上限桌面 1.5、手机 1.25。
- **时长:** 桌面 1.2s，手机 0.95s，GSAP `power2.inOut`；角度与半径更早到位。翻到 30% 时切换标签条与目录状态。
- **入场:** 新卷在翻起的书页下已经完整；只有书名从上往下「印」出（clip-path，0.9s expo，第二列延迟 0.12s），卷号章淡入，插画从下方 60px 升起（1.1s expo）。首屏封面用同样的 CSS 动画开场，腰封从左侧滑入。
- **兜底:** 先用 CSS 平折（镜像裁切 + 线性渐变纸背）；WebGL 在第一次交互意图（指针移动、按下、触摸、按键、滚轮）或 3 秒后才加载。软件渲染器（SwiftShader、llvmpipe 等）、省流量、设备内存 < 4GB 的客户端保留 CSS 折页；WebGL 上下文丢失时退回 CSS。

### Dog-Ear（signature）
- **静止:** 除最后一卷外，左下角总是折起一个书角：桌面 F 84 / R 6，手机 F 44 / R 4——静止时是利落的折痕，翻页时才张开成卷筒。折角下露出下一卷的书封色与 Archivo 卷号（17px，手机 12px）。
- **悬停 / 聚焦:** 书角抬高到 1.9 倍、半径 1.5 倍，0.4s；聚焦时在角上显示墨色加白圈的圆点。
- **拖动:** 指针按住书角后书页跟随指针，折线是角点与指针连线的中垂线；松手时超过整个翻页的 14% 即提交，否则回落。未移动的点按直接翻页；键盘回车翻页。
- **触摸:** 横向拖动整页翻卷，超过 28% 或速度足够即提交；纵向滑动超过 44px 翻到上一卷或下一卷。

## Do's and Don'ts

### Do:
- **Do** 每卷用一种取样书封色满版铺开，配一轮太阳和一道山丘，并在本文件写明颜色来源。
- **Do** 把书名竖排在右侧，用 NV Title 900，并在改字后运行 `node scripts/prepare-fonts.mjs`。
- **Do** 把真实 Android 截图作为无框版面（3px 圆角、发丝边、长投影），小角度旋转，下沿藏进腰封。
- **Do** 把所有文案和行动放进腰封；腰封用腰封白与墨，第 4 卷跟随纸张。
- **Do** 卷号、书号、版本和数字用 Archivo，并通过 wdth 轴调整宽窄。
- **Do** 在手机上为书角保留腰封底部 76px，把卷号章与编码放到书名上方。
- **Do** 保证流式模式（无 JS、reduced-motion、矮视口）是同一套书封的完整原生滚动页面。
- **Do** 让出版单的版本行始终存在、状态行固定两行，在 static / loading / none / error / ready 之间切换时不移动版面。
- **Do** 下载页的安装步骤用带横线的行，不分栏成卡片。
- **Do** 每张上线的位图都带来源：WebP 用同名 `.json` 旁注文件，PNG 写入 tEXt 块，JPEG 写入 COM 段。
- **Do** 页面上的图一律 WebP：截图 720px（q76）与 440px（q72）两档，开 smartSubsample 保住文字边缘，effort 6。唯一例外是社交分享图 `social.jpg`（链接预览抓取器对 WebP 支持不一）和 favicon PNG。手机实拍截图（1200×2670）在状态栏以下裁成与模拟器截图相同的 9:16 版面。
- **Do** 截图只用原创 CC0 示例书的内容；需要展示的界面状态（例如朗读中的高亮和播放小窗）在真机上用示例书重新拍，不用第三方书的正文或封面。

### Don't:
- **Don't** 把朱红用在下载行动和当前卷标记以外的任何地方。
- **Don't** 给截图加手机外壳、边框或大圆角屏幕样机。
- **Don't** 做分栏英雄区或成排的功能卡片；一屏只放一卷。
- **Don't** 引入书封取样之外的新色相，或给第 4 卷编网站专用的纸张色。
- **Don't** 用明朝体排横排文字，或用系统宋体顶替竖排书名。
- **Don't** 让任何内容进入左下角书角热区。
- **Don't** 在 GitHub Releases 还没有 .apk 时给出猜测的下载地址；先指向发布页。
- **Don't** 用硬边偏移阴影、毛玻璃、发光或渐变字。
