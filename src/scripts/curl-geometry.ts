/**
 * Page-curl geometry shared by the WebGL renderer and the CSS fallback.
 *
 * Coordinates follow GL: origin at the bottom-left corner of the viewport,
 * y up, in CSS pixels. The sheet is lifted from the bottom-left corner (a
 * right-bound book turns its pages left to right). `n` is the unit vector
 * pointing from the lifted corner into the page; the fold line is every point
 * whose projection on `n` equals `F`. Points with a smaller projection have
 * been lifted, wrapped round a cylinder of radius `R`, and laid back over the
 * page on the far side of the fold.
 */
export interface CurlState {
  F: number;
  a: number;
  R: number;
}

export const REST_ANGLE = Math.PI / 4;
export const END_ANGLE = (11 * Math.PI) / 180;

export function farFold(W: number, H: number, a: number, R: number) {
  return W * Math.cos(a) + H * Math.sin(a) + R * 1.3 + 8;
}

type Pt = [number, number];
const corners = (W: number, H: number): Pt[] => [
  [0, 0],
  [W, 0],
  [W, H],
  [0, H],
];

function cut(points: Pt[], side: (p: Pt) => number) {
  const out: Pt[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    const sp = side(p);
    const sq = side(q);
    if (sp >= 0) out.push(p);
    if (sp >= 0 !== sq >= 0) {
      const t = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}

const toCss = (points: Pt[], H: number) =>
  points.length < 3
    ? "polygon(0 0, 0 0, 0 0)"
    : `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${(H - y).toFixed(1)}px`).join(",")})`;

/** The part of the page still lying flat, as a CSS clip-path. */
export function flatClip({ F, a }: CurlState, W: number, H: number) {
  const nx = Math.cos(a);
  const ny = Math.sin(a);
  return toCss(cut(corners(W, H), ([x, y]) => x * nx + y * ny - F), H);
}

/** The lifted part mirrored over the fold: a flat-fold approximation for CSS. */
export function flapClip({ F, a }: CurlState, W: number, H: number) {
  const nx = Math.cos(a);
  const ny = Math.sin(a);
  const lifted = cut(corners(W, H), ([x, y]) => F - (x * nx + y * ny));
  const mirrored = lifted.map(([x, y]): Pt => {
    const d = 2 * (F - (x * nx + y * ny));
    return [x + d * nx, y + d * ny];
  });
  return toCss(mirrored, H);
}

export interface CurlRenderer {
  kind: "webgl" | "css";
  draw(state: CurlState, W: number, H: number): void;
  resize(W: number, H: number): void;
  dispose(): void;
}
