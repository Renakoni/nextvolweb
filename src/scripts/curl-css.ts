import { flapClip, type CurlRenderer } from "./curl-geometry";

/** Flat-fold page turn for browsers without WebGL. */
export function createCssCurl(layer: HTMLElement): CurlRenderer {
  const wrap = document.createElement("div");
  wrap.className = "curl-css-flap";
  const flap = document.createElement("div");
  wrap.append(flap);
  layer.append(wrap);

  return {
    kind: "css",
    draw(state, W, H) {
      if (state.F <= 0.5) {
        wrap.hidden = true;
        return;
      }
      wrap.hidden = false;
      flap.style.clipPath = flapClip(state, W, H);
      // The gradient starts at the lifted corner, so the fold sits at exactly F.
      const deg = 90 - (state.a * 180) / Math.PI;
      const f = state.F;
      flap.style.background = `linear-gradient(${deg}deg, #c9c7bf ${f}px, #e4e3dd ${f + 12}px, #f1f0eb ${f + 48}px, #f5f4f0 ${f * 2}px)`;
    },
    resize() {},
    dispose() {
      wrap.remove();
    },
  };
}
