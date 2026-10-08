import { gsap } from "gsap";
import { createCssCurl } from "./curl-css";
import {
  END_ANGLE,
  REST_ANGLE,
  farFold,
  flatClip,
  type CurlRenderer,
  type CurlState,
} from "./curl-geometry";

const root = document.documentElement;
const vols = [...document.querySelectorAll<HTMLElement>(".vol")];
const ids = vols.map((v) => v.id);
const toc = document.getElementById("toc");
const announcer = document.querySelector<HTMLElement>("[data-announce]");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
// A slow frame should shorten an animation, never stretch it.
gsap.ticker.lagSmoothing(0);

setupSources();
setupPaper();
if (root.classList.contains("deck")) initDeck();

/* ------------------------------------------------------------------ */
/* Volume 2: choose where the story comes from                         */
/* ------------------------------------------------------------------ */
function setupSources() {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>(".tab")];
  if (!tabs.length) return;
  const panels = [...document.querySelectorAll<HTMLElement>("[data-panel]")];
  const screens = [...document.querySelectorAll<HTMLElement>("[data-source-image]")];
  const screenFor = (id: string) => screens.find((s) => s.dataset.sourceImage === id)!;
  let active = tabs[0].dataset.source!;
  let timer = 0;

  const select = (id: string, focus = false) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.source === id;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
    if (id === active) return;
    panels.forEach((panel) => (panel.hidden = panel.dataset.panel !== id));
    const leaving = screenFor(active);
    const arriving = screenFor(id);
    active = id;
    window.clearTimeout(timer);
    screens.forEach((s) => s.classList.remove("is-leaving", "is-arriving"));
    leaving.classList.remove("is-shown");
    leaving.classList.add("is-leaving");
    arriving.classList.add("is-arriving", "is-shown");
    arriving.getBoundingClientRect();
    requestAnimationFrame(() => arriving.classList.remove("is-arriving"));
    timer = window.setTimeout(() => leaving.classList.remove("is-leaving"), 460);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab.dataset.source!));
    tab.addEventListener("keydown", (event) => {
      const moves: Record<string, number> = {
        ArrowRight: i + 1,
        ArrowDown: i + 1,
        ArrowLeft: i - 1,
        ArrowUp: i - 1,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      event.stopPropagation();
      const next = tabs[(moves[event.key] + tabs.length) % tabs.length];
      select(next.dataset.source!, true);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Volume 4: swap the reader's paper                                   */
/* ------------------------------------------------------------------ */
function setupPaper() {
  const section = document.querySelector<HTMLElement>(".vol-paper");
  if (!section) return;
  const buttons = [...section.querySelectorAll<HTMLButtonElement>("[data-paper-choice]")];
  const note = section.querySelector<HTMLElement>("[data-paper-note]");
  const name = section.querySelector<HTMLElement>("[data-paper-name]");
  const notes: Record<string, string> = {
    clear: "清纸 · 白天也不刺眼",
    sage: "豆绿 · 给眼睛留一点绿意",
    night: "夜读 · 熄灯以后接着读",
  };

  const apply = (id: string) => {
    section.dataset.paper = id;
    root.dataset.paper = id;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.paperChoice === id)));
    if (note) note.textContent = notes[id];
    if (name) name.textContent = notes[id].split(" ")[0];
  };

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const id = button.dataset.paperChoice!;
      if (section.dataset.paper === id) return;
      const start = (document as Document & { startViewTransition?: (cb: () => void) => unknown })
        .startViewTransition;
      if (!start || reduced.matches) return apply(id);
      const r = button.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty(
        "--vt-r",
        `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`,
      );
      start.call(document, () => apply(id));
    }),
  );
}

/* ------------------------------------------------------------------ */
/* The deck: one volume on screen, turned with a real page curl        */
/* ------------------------------------------------------------------ */
function initDeck() {
  const layer = document.querySelector<HTMLElement>(".curl-layer")!;
  const hotspot = document.querySelector<HTMLButtonElement>(".corner-hotspot")!;
  const railLinks = [...document.querySelectorAll<HTMLAnchorElement>(".rail [data-goto]")];
  const tocLinks = [...document.querySelectorAll<HTMLAnchorElement>(".toc [data-goto]")];
  const volNow = document.querySelector<HTMLElement>("[data-vol-now]");
  const last = vols.length - 1;

  let W = innerWidth;
  let H = innerHeight;
  let renderer: CurlRenderer = createCssCurl(layer);
  let pending: CurlRenderer | null = null;
  let current = Math.max(0, ids.indexOf(decodeURIComponent(location.hash.slice(1))));
  let top = vols[current];
  let below: HTMLElement | null = vols[current + 1] ?? null;
  let busy = false;
  let queued: number | null = null;
  const state: CurlState = { F: 0, a: REST_ANGLE, R: 10 };

  const phone = () => W < 768;
  // at rest the dog-ear is a crisp crease; the roll opens up as the page turns
  const restR = () => (phone() ? 4 : 6);
  const restFor = (i: number): CurlState => ({
    F: i < last ? (phone() ? 44 : 84) : 0,
    a: REST_ANGLE,
    R: restR(),
  });
  const maxR = () => clamp(Math.min(W, H) * 0.085, 34, 92);
  const end = (): CurlState => ({ F: farFold(W, H, END_ANGLE, maxR()), a: END_ANGLE, R: maxR() });
  const duration = () => (phone() ? 0.95 : 1.2);

  function draw() {
    // under WebGL the page stays flat beneath the roll band; the roll covers it
    const flat = renderer.kind === "webgl" ? { ...state, F: state.F - state.R } : state;
    top.style.clipPath = state.F > 0.5 ? flatClip(flat, W, H) : "";
    renderer.draw(state, W, H);
    tone();
  }

  // Mid-turn, each piece of fixed chrome takes the colours of whatever lies
  // under it: the volume still flat, the paper of the lifted flap, or the
  // volume being revealed.
  const parts = [...document.querySelectorAll<HTMLElement>(".brand, .vol-switch, .chrome-github, .rail")];
  let centres: { el: HTMLElement; x: number; y: number }[] | null = null;
  function tone() {
    if (!root.classList.contains("is-turning") || state.F <= 0.5) {
      parts.forEach((el) => {
        delete el.dataset.vol;
        delete el.dataset.tone;
      });
      return;
    }
    centres ??= parts.flatMap((el) => {
      const r = el.getBoundingClientRect();
      return r.width ? [{ el, x: r.left + r.width / 2, y: H - (r.top + r.height / 2) }] : [];
    });
    const cos = Math.cos(state.a);
    const sin = Math.sin(state.a);
    for (const { el, x, y } of centres) {
      const s = x * cos + y * sin - state.F;
      const k = 2 * s + Math.PI * state.R;
      const qx = x - k * cos;
      const qy = y - k * sin;
      const onFlap = s >= 0 && qx >= 0 && qx <= W && qy >= 0 && qy <= H;
      const page = s < 0 ? below : top;
      if (onFlap) {
        delete el.dataset.vol;
        el.dataset.tone = "paper";
      } else {
        delete el.dataset.tone;
        el.dataset.vol = String(vols.indexOf(page ?? top) + 1);
      }
    }
  }

  function layers(page: HTMLElement, under: HTMLElement | null) {
    vols.forEach((v) => {
      if (v === page || v === under) return;
      v.classList.remove("is-current", "is-under");
      v.style.clipPath = "";
    });
    page.classList.add("is-current");
    page.classList.remove("is-under");
    page.inert = false;
    if (under) {
      under.classList.add("is-under");
      under.classList.remove("is-current");
      under.style.clipPath = "";
      under.inert = true;
    }
    top = page;
    below = under;
  }

  function chrome(i: number) {
    root.dataset.vol = String(i + 1);
    [...railLinks, ...tocLinks].forEach((a) =>
      Number(a.dataset.goto) === i
        ? a.setAttribute("aria-current", "true")
        : a.removeAttribute("aria-current"),
    );
    if (volNow) volNow.textContent = String(i + 1).padStart(2, "0");
    hotspot.hidden = i >= last;
    if (i < last) hotspot.setAttribute("aria-label", `翻到下一卷：${vols[i + 1].dataset.label}`);
  }

  function prepareEntrance(v: HTMLElement) {
    v.classList.add("is-instant", "is-entering");
    v.getBoundingClientRect();
    v.classList.remove("is-instant");
  }

  function land(i: number, settled: boolean) {
    const focusWasInside = vols.some((v) => v !== vols[i] && v.contains(document.activeElement));
    current = i;
    root.classList.remove("is-turning");
    vols.forEach((v) => v.classList.remove("is-departing"));
    layers(vols[i], vols[i + 1] ?? null);
    if (!settled) Object.assign(state, { F: 0, a: REST_ANGLE, R: restR() });
    draw();
    history.replaceState(null, "", `#${ids[i]}`);
    if (announcer) announcer.textContent = `第 ${i + 1} 卷 · ${vols[i].dataset.label}`;
    if (focusWasInside) vols[i].querySelector<HTMLElement>(".vtitle")?.focus({ preventScroll: true });
    vols[0].classList.add("is-turned");
    if (!settled && i < last) {
      gsap.to(state, { ...restFor(i), duration: 0.75, delay: 0.6, ease: "power3.out", onUpdate: draw });
    }
    busy = false;
    swapRenderer();
    if (queued !== null) {
      const next = queued;
      queued = null;
      goTo(next);
    }
  }

  function goTo(to: number) {
    to = Math.round(clamp(to, 0, last));
    if (to === current) return;
    if (busy) {
      queued = to;
      return;
    }
    busy = true;
    root.classList.add("is-turning");
    gsap.killTweensOf(state);
    const target = vols[to];
    const d = duration();
    if (to > current) {
      layers(vols[current], target);
      prepareEntrance(target);
      const e = end();
      gsap
        .timeline({ onUpdate: draw, onComplete: () => land(to, false) })
        .to(state, { F: e.F, duration: d, ease: "power2.inOut" }, 0)
        .to(state, { a: e.a, duration: d * 0.8, ease: "power2.out" }, 0)
        .to(state, { R: e.R, duration: d * 0.45, ease: "power2.out" }, 0)
        .call(() => {
          chrome(to);
          target.classList.remove("is-entering");
        }, [], d * 0.3);
    } else {
      layers(target, vols[current]);
      target.classList.remove("is-entering");
      vols[current].classList.add("is-departing");
      Object.assign(state, end());
      draw();
      const r = restFor(to);
      gsap
        .timeline({ onUpdate: draw, onComplete: () => land(to, true) })
        .to(state, { F: r.F, duration: d, ease: "power2.inOut" }, 0)
        .to(state, { a: r.a, duration: d, ease: "power2.in" }, 0)
        .to(state, { R: r.R, duration: d, ease: "power3.in" }, 0)
        .call(() => chrome(to), [], d * 0.5);
    }
  }

  /* ---- drag: the page follows the finger or the pointer ---------- */
  let drag: { dir: 1 | -1; to: number; t: number } | null = null;

  function dragStart(dir: 1 | -1) {
    const to = current + dir;
    if (busy || to < 0 || to > last) return false;
    busy = true;
    root.classList.add("is-turning");
    gsap.killTweensOf(state);
    drag = { dir, to, t: dir > 0 ? 0 : 1 };
    if (dir > 0) layers(vols[current], vols[to]);
    else {
      layers(vols[to], vols[current]);
      vols[to].classList.remove("is-entering");
      vols[current].classList.add("is-departing");
      Object.assign(state, end());
      draw();
    }
    return true;
  }

  function dragTo(t: number) {
    if (!drag) return;
    drag.t = clamp(t);
    const rest = restFor(drag.dir > 0 ? current : drag.to);
    const e = end();
    state.F = lerp(rest.F, e.F, drag.t);
    state.a = lerp(REST_ANGLE, END_ANGLE, smooth(clamp(drag.t * 1.6)));
    state.R = lerp(rest.R, e.R, smooth(clamp(drag.t * 3)));
    draw();
  }

  function dragRelease(commit: boolean) {
    if (!drag) return;
    const { dir, to } = drag;
    drag = null;
    const finish = (target: CurlState, done: () => void) =>
      gsap.to(state, { ...target, duration: 0.55, ease: "power3.out", onUpdate: draw, onComplete: done });
    if (dir > 0) {
      if (commit) {
        chrome(to);
        finish(end(), () => land(to, false));
      } else
        finish(restFor(current), () => {
          root.classList.remove("is-turning");
          busy = false;
          draw();
        });
    } else if (commit) {
      chrome(to);
      finish(restFor(to), () => land(to, true));
    } else {
      finish(end(), () => {
        vols[current].classList.remove("is-departing");
        layers(vols[current], vols[current + 1] ?? null);
        Object.assign(state, restFor(current));
        root.classList.remove("is-turning");
        draw();
        busy = false;
      });
    }
  }

  /* ---- the dog-eared corner -------------------------------------- */
  let corner: { x: number; y: number; moved: boolean; id: number } | null = null;

  hotspot.addEventListener("pointerenter", (e) => {
    if (busy || e.pointerType !== "mouse") return;
    const r = restFor(current);
    gsap.to(state, { F: r.F * 1.9, R: r.R * 1.5, a: REST_ANGLE - 0.06, duration: 0.4, ease: "power3.out", onUpdate: draw });
  });
  hotspot.addEventListener("pointerleave", () => {
    if (busy || corner) return;
    gsap.to(state, { ...restFor(current), duration: 0.45, ease: "power3.out", onUpdate: draw });
  });
  hotspot.addEventListener("focus", () => {
    if (busy || !hotspot.matches(":focus-visible")) return;
    const r = restFor(current);
    gsap.to(state, { F: r.F * 1.9, R: r.R * 1.5, a: REST_ANGLE - 0.06, duration: 0.4, ease: "power3.out", onUpdate: draw });
  });
  hotspot.addEventListener("blur", () => {
    if (busy || corner) return;
    gsap.to(state, { ...restFor(current), duration: 0.45, ease: "power3.out", onUpdate: draw });
  });
  hotspot.addEventListener("pointerdown", (e) => {
    if (!dragStart(1)) return;
    hotspot.setPointerCapture(e.pointerId);
    corner = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
  });
  hotspot.addEventListener("pointermove", (e) => {
    if (!corner || !drag) return;
    if (Math.hypot(e.clientX - corner.x, e.clientY - corner.y) > 4) corner.moved = true;
    // the lifted corner sits under the pointer: the fold is the bisector
    const px = Math.max(e.clientX, 1);
    const py = Math.max(H - e.clientY, 1);
    const dist = Math.hypot(px, py);
    const R = lerp(restR(), maxR(), smooth(clamp(dist / (W * 0.45))));
    const e2 = end();
    state.a = clamp(Math.atan2(py, px), 0.08, 1.45);
    state.R = R;
    state.F = Math.max(restFor(current).F, (dist + Math.PI * R) / 2);
    drag.t = clamp((state.F - restFor(current).F) / (e2.F - restFor(current).F));
    draw();
  });
  const releaseCorner = () => {
    if (!corner) return;
    const click = !corner.moved;
    corner = null;
    // past 14% of the turn, a corner drag is a deliberate turn
    dragRelease(click || (drag?.t ?? 0) > 0.14);
  };
  hotspot.addEventListener("pointerup", releaseCorner);
  hotspot.addEventListener("pointercancel", () => {
    if (!corner) return;
    corner = null;
    dragRelease(false);
  });
  hotspot.addEventListener("click", (e) => {
    if (e.detail === 0) goTo(current + 1);
  });

  /* ---- wheel, keys, touch, links --------------------------------- */
  const canScroll = (target: EventTarget | null, dir: number) => {
    const el = (target as Element | null)?.closest?.<HTMLElement>("[data-scroll]");
    if (!el || el.scrollHeight <= el.clientHeight + 2) return false;
    return dir > 0
      ? el.scrollTop + el.clientHeight < el.scrollHeight - 2
      : el.scrollTop > 2;
  };
  const tocOpen = () => !!toc?.matches(":popover-open");

  let lastWheel = 0;
  let lastTurn = 0;
  addEventListener(
    "wheel",
    (e) => {
      if (tocOpen() || e.ctrlKey) return;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (canScroll(e.target, Math.sign(delta))) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (Math.abs(delta) < 4 || drag) return;
      const freshGesture = gap > 180;
      const sustained = !busy && now - lastTurn > 1300 && Math.abs(delta) > 30;
      if (!freshGesture && !sustained) return;
      lastTurn = now;
      goTo(current + (delta > 0 ? 1 : -1));
    },
    { passive: false },
  );

  addEventListener("keydown", (e) => {
    if (tocOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.target as HTMLElement;
    if (el.closest("input, textarea, select, [contenteditable]")) return;
    const onControl = !!el.closest("button, summary, a");
    let dir = 0;
    if (["ArrowDown", "PageDown", "ArrowRight"].includes(e.key)) dir = 1;
    else if (["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key)) dir = -1;
    else if (e.key === " " && !onControl) dir = e.shiftKey ? -1 : 1;
    else if (e.key === "Home" && !onControl) dir = -current;
    else if (e.key === "End" && !onControl) dir = last - current;
    if (!dir) return;
    if (Math.abs(dir) === 1 && e.key.startsWith("Arrow") && canScroll(el, dir)) return;
    e.preventDefault();
    goTo(current + dir);
  });

  let touch: { x: number; y: number; lx: number; ly: number; t: number; axis: "" | "x" | "y"; scroller: boolean; target: EventTarget | null } | null = null;
  addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1 || tocOpen() || (e.target as Element).closest?.(".corner-hotspot")) {
        touch = null;
        return;
      }
      const p = e.touches[0];
      touch = { x: p.clientX, y: p.clientY, lx: p.clientX, ly: p.clientY, t: performance.now(), axis: "", scroller: false, target: e.target };
    },
    { passive: true },
  );
  addEventListener(
    "touchmove",
    (e) => {
      if (!touch) return;
      const p = e.touches[0];
      touch.lx = p.clientX;
      touch.ly = p.clientY;
      const dx = p.clientX - touch.x;
      const dy = p.clientY - touch.y;
      if (!touch.axis) {
        if (Math.hypot(dx, dy) < 10) return;
        touch.axis = Math.abs(dx) > Math.abs(dy) * 1.1 ? "x" : "y";
        if (touch.axis === "y") touch.scroller = canScroll(touch.target, dy < 0 ? 1 : -1);
        else if (!dragStart(dx > 0 ? 1 : -1)) touch.axis = "y";
      }
      if (touch.axis === "y") {
        if (!touch.scroller && e.cancelable) e.preventDefault();
        return;
      }
      if (e.cancelable) e.preventDefault();
      if (!drag) return;
      const span = W * 0.82;
      dragTo(drag.dir > 0 ? dx / span : 1 + dx / span);
    },
    { passive: false },
  );
  addEventListener("touchend", () => {
    if (!touch) return;
    const dx = touch.lx - touch.x;
    const dy = touch.ly - touch.y;
    const v = (touch.axis === "x" ? dx : dy) / Math.max(performance.now() - touch.t, 1);
    if (touch.axis === "y" && !touch.scroller && (Math.abs(dy) > 44 || Math.abs(v) > 0.4)) {
      goTo(current + (dy < 0 ? 1 : -1));
    } else if (touch.axis === "x" && drag) {
      const commit = drag.dir > 0 ? drag.t > 0.28 || v > 0.45 : drag.t < 0.72 || v < -0.45;
      dragRelease(commit);
    }
    touch = null;
  });
  addEventListener("touchcancel", () => {
    if (drag) dragRelease(false);
    touch = null;
  });

  document.addEventListener("click", (e) => {
    const link = (e.target as Element).closest<HTMLElement>("[data-goto]");
    if (!link) return;
    e.preventDefault();
    if (link.hasAttribute("data-close-toc")) toc?.hidePopover?.();
    goTo(Number(link.dataset.goto));
  });
  addEventListener("hashchange", () => {
    const i = ids.indexOf(decodeURIComponent(location.hash.slice(1)));
    if (i >= 0) goTo(i);
  });

  let resizeFrame = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      W = innerWidth;
      H = innerHeight;
      renderer.resize(W, H);
      centres = null;
      if (!busy) Object.assign(state, restFor(current));
      draw();
    });
  });

  /* ---- first paint ----------------------------------------------- */
  // The markup already opens on the cover; only a deep link needs re-layering.
  if (current > 0) {
    layers(vols[current], vols[current + 1] ?? null);
    chrome(current);
  }
  vols[current + 1] && (vols[current + 1].inert = true);
  hotspot.hidden = current >= last;
  if (current > 0) vols[0].classList.add("is-turned");
  gsap.to(state, {
    ...restFor(current),
    duration: 0.9,
    delay: current === 0 ? 1.15 : 0.3,
    ease: "power3.out",
    onUpdate: draw,
  });

  function swapRenderer() {
    if (!pending || busy) return;
    renderer.dispose();
    renderer = pending;
    pending = null;
    draw();
  }

  // WebGL waits for the first sign of interest, so loading stays light.
  // Software renderers keep the CSS fold: they cannot hold the frame rate.
  const upgrade = async () => {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory < 4)) return;
    const probe = document.createElement("canvas").getContext("webgl");
    if (!probe) return;
    const info = probe.getExtension("WEBGL_debug_renderer_info");
    const name = String(probe.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : probe.RENDERER));
    probe.getExtension("WEBGL_lose_context")?.loseContext();
    if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name)) return;
    const { createWebglCurl } = await import("./curl-webgl");
    const gl = createWebglCurl(layer, phone() ? 1.25 : 1.5);
    if (!gl) return;
    pending = gl;
    swapRenderer();
    layer.querySelector("canvas")?.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      pending = null;
      renderer.dispose();
      renderer = createCssCurl(layer);
      draw();
    });
  };
  const intents = ["pointermove", "pointerdown", "touchstart", "keydown", "wheel"] as const;
  let upgrading = false;
  const startUpgrade = () => {
    if (upgrading) return;
    upgrading = true;
    intents.forEach((type) => removeEventListener(type, startUpgrade));
    void upgrade();
  };
  intents.forEach((type) => addEventListener(type, startUpgrade, { passive: true }));
  setTimeout(startUpgrade, 3000);
}
