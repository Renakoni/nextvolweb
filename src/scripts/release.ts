// Finds the newest published APK on GitHub Releases. Until one exists, the
// page keeps pointing at the releases list instead of a guessed file URL.
const REPO = "Renakoni/nextvol";
const API = `https://api.github.com/repos/${REPO}/releases?per_page=10`;
const RELEASES = `https://github.com/${REPO}/releases`;
const PROJECT = `https://github.com/${REPO}`;
const CACHE_KEY = "nextvol-release";
const CACHE_MS = 10 * 60 * 1000;

interface Asset {
  name: string;
  size: number;
  browser_download_url: string;
  digest?: string | null;
}
interface Release {
  tag_name: string;
  name: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  assets: Asset[];
}

const card = document.querySelector<HTMLElement>("[data-release]")!;
const field = (name: string) => document.querySelector<HTMLElement>(`[data-r="${name}"]`)!;
const row = (name: string) => card.querySelector<HTMLElement>(`[data-row="${name}"]`)!;
const button = field("button") as HTMLAnchorElement;
const secondary = field("secondary") as HTMLAnchorElement;
const retry = card.querySelector<HTMLButtonElement>("[data-retry]")!;
const copy = card.querySelector<HTMLButtonElement>("[data-copy]")!;
const dynamicRows = ["version", "date", "file", "size", "sha"];
let fullSha = "";

const isApk = (a: Asset) => /\.apk$/i.test(a.name) && !/debug|benchmark/i.test(a.name);
const pickApk = (assets: Asset[]) => {
  const apks = assets.filter(isApk);
  return apks.find((a) => /universal/i.test(a.name)) ?? apks.find((a) => /arm64/i.test(a.name)) ?? apks[0];
};
const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const date = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso)) : "—";

function show(rows: string[]) {
  dynamicRows.forEach((name) => (row(name).hidden = !rows.includes(name)));
}

function setLoading() {
  card.dataset.state = "loading";
  field("status").textContent = "正在查询最新版本…";
  field("version").textContent = "查询中…";
  retry.hidden = true;
  show(["version"]);
}

function setReady(release: Release, asset: Asset) {
  card.dataset.state = "ready";
  retry.hidden = true;
  const version = release.tag_name.replace(/^v?/, "v");
  field("status").textContent = release.prerelease ? "最新的预览版本，可能还有未修复的问题。" : "最新正式版本。";
  field("badge").hidden = !release.prerelease;
  field("version").textContent = version;
  field("date").textContent = date(release.published_at);
  field("file").textContent = asset.name;
  field("size").textContent = megabytes(asset.size);
  fullSha = asset.digest?.startsWith("sha256:") ? asset.digest.slice(7) : "";
  field("sha").textContent = fullSha ? `${fullSha.slice(0, 12)}…${fullSha.slice(-6)}` : "";
  show(fullSha ? dynamicRows : dynamicRows.filter((r) => r !== "sha"));

  button.href = asset.browser_download_url;
  button.dataset.kind = "file";
  button.removeAttribute("target");
  button.setAttribute("download", "");
  field("label").textContent = "下载 APK";
  field("meta").textContent = `${version} · ${megabytes(asset.size)}`;
  field("lead").textContent = `NextVol ${version} 已经可以下载。`;
  field("fine").textContent = "下载后在手机上打开安装包，按系统提示完成安装。";
  secondary.href = release.html_url;
  field("secondary-label").textContent = "更新说明";
}

function setNone() {
  card.dataset.state = "none";
  field("status").textContent = "正式安装包还没有发布，发布后这里会自动显示下载按钮。";
  field("version").textContent = "即将发布";
  retry.hidden = true;
  show(["version"]);
  field("label").textContent = "前往发布页";
  field("meta").textContent = "GitHub Releases";
  field("lead").textContent = "安装包即将发布。";
  field("fine").textContent = "在 GitHub 点 Watch → Custom → Releases，发布时就会收到通知。";
  button.href = RELEASES;
  delete button.dataset.kind;
  secondary.href = PROJECT;
  field("secondary-label").textContent = "在 GitHub 关注";
}

function setError() {
  setNone();
  card.dataset.state = "error";
  field("status").textContent = "暂时连不上 GitHub，可以直接去发布页看看。";
  field("version").textContent = "暂时查不到";
  retry.hidden = false;
}

function apply(list: Release[]) {
  const release = list.find((r) => !r.draft && r.assets?.some(isApk));
  const asset = release && pickApk(release.assets);
  if (release && asset) setReady(release, asset);
  else setNone();
}

async function load(useCache = true) {
  if (useCache) {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
      if (cached && Date.now() - cached.at < CACHE_MS) return apply(cached.list);
    } catch {
      /* storage unavailable: fetch instead */
    }
  }
  setLoading();
  try {
    const response = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(String(response.status));
    const list = (await response.json()) as Release[];
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), list }));
    } catch {
      /* ignore */
    }
    apply(list);
  } catch {
    setError();
  }
}

retry.addEventListener("click", () => void load(false));
copy.addEventListener("click", async () => {
  if (!fullSha) return;
  const label = copy.querySelector<HTMLElement>("[data-copy-label]")!;
  try {
    await navigator.clipboard.writeText(fullSha);
    label.textContent = "已复制";
  } catch {
    label.textContent = "复制失败";
  }
  setTimeout(() => (label.textContent = "复制"), 1800);
});

void load();
