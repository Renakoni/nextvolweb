import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import type { CurlRenderer } from "./curl-geometry";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/*
 * One full-screen quad. For every pixel we ask which part of the lifted jacket
 * lies above it: the inside of the jacket laid flat past the fold, the back of
 * the roll, or (rarely) the printed front on the underside of the roll. The
 * printed face is never visible from above except on that sliver, so the
 * page's real HTML stays on screen everywhere else and is clipped at the fold.
 */
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform float uDpr;
  uniform float uF;
  uniform vec2 uN;
  uniform float uR;
  uniform vec3 uPaper;
  const float PI = 3.14159265;

  float inside(vec2 q) {
    float d = min(min(q.x, q.y), min(uRes.x - q.x, uRes.y - q.y));
    return clamp(d * uDpr + 0.5, 0.0, 1.0);
  }

  // x: 0 none, 2 roll back, 3 flat back; y: angle on the roll; z: coverage;
  // w: source y on the page. The roll's printed underside is never drawn: where
  // the back runs off the page edge, the flat page beneath shows instead, so
  // the roll ends cleanly at the crease.
  vec4 sheet(vec2 p) {
    float s = dot(p, uN) - uF;
    if (s > 0.0) {
      float d = s + PI * uR;
      vec2 q = p - (d + s) * uN;
      float a = inside(q);
      return a > 0.0 ? vec4(3.0, PI, a, q.y) : vec4(0.0);
    }
    if (s >= -uR && uR > 0.0) {
      float edge = clamp((s + uR) * uDpr + 0.5, 0.0, 1.0);
      float t2 = PI - asin(clamp(-s / uR, 0.0, 1.0));
      vec2 q2 = p - (t2 * uR + s) * uN;
      float a2 = inside(q2);
      if (a2 > 0.0) return vec4(2.0, t2, a2 * edge, q2.y);
    }
    return vec4(0.0);
  }

  // signed distance to the page rectangle
  float sdPage(vec2 q) {
    vec2 c = uRes * 0.5;
    vec2 d = abs(q - c) - c;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 p = gl_FragCoord.xy / uDpr;
    vec2 L = normalize(vec2(-0.55, 1.0));
    vec2 halfway = normalize(L + vec2(0.0, 1.0));
    vec4 h = sheet(p);

    if (h.x > 0.5) {
      vec2 nrm;
      vec3 base;
      if (h.x < 2.5) {
        nrm = vec2(-sin(h.y), -cos(h.y));
        base = uPaper;
      } else {
        nrm = vec2(0.0, 1.0);
        // the back still curves away near the fold
        float s = dot(p, uN) - uF;
        base = uPaper * (0.9 + 0.1 * smoothstep(0.0, 26.0 + uR, s));
      }
      float diff = max(dot(nrm, L), 0.0);
      float spec = pow(max(dot(nrm, halfway), 0.0), 36.0) * 0.07;
      vec3 col = base * (0.66 + 0.38 * diff) + spec;
      col +=(hash(floor(p * uDpr)) - 0.5) * 0.018;
      gl_FragColor = vec4(col * h.z, h.z);
      return;
    }

    float s = dot(p, uN) - uF;
    float shadow = 0.0;
    if (s < -uR) {
      // contact shadow of the roll on the volume underneath
      vec2 onRoll = p - (s + uR * 0.6) * uN;
      if (sheet(onRoll).x > 0.5) {
        float k = -s - uR;
        shadow = 0.36 * exp(-k / (uR * 0.6 + 5.0));
      }
    } else if (s <= 0.0) {
      // where the roll's back has run off the page, the page itself shows,
      // curving up into the roll: shade it by how far it has turned from the light
      float t1 = asin(clamp(-s / uR, 0.0, 1.0));
      float lit = max(dot(vec2(sin(t1), cos(t1)), L), 0.0);
      shadow = 0.3 * (1.0 - lit / L.y);
    } else {
      // the lifted flap shades the page it lies on: a soft falloff from the
      // flap's edge, measured in the flap's own (unfolded) frame, nudged away
      // from the light
      vec2 o = p - uN * (2.0 + uR * 0.2);
      float so = dot(o, uN) - uF;
      vec2 q = o - (2.0 * so + PI * uR) * uN;
      float dist = max(max(sdPage(q), -so), 0.0);
      shadow = 0.26 * exp(-dist / (5.0 + uR * 0.35));
    }
    vec3 tint = vec3(0.03, 0.04, 0.09);
    gl_FragColor = vec4(tint * shadow, shadow);
  }
`;

export function createWebglCurl(layer: HTMLElement, maxDpr: number): CurlRenderer | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  layer.append(renderer.domElement);

  const uniforms = {
    uRes: { value: new Vector2(window.innerWidth, window.innerHeight) },
    uDpr: { value: dpr },
    uF: { value: 0 },
    uN: { value: new Vector2(1, 0) },
    uR: { value: 10 },
    uPaper: { value: new Vector3(0.937, 0.933, 0.914) },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2);
  scene.add(new Mesh(geometry, material));

  return {
    kind: "webgl",
    draw(state, W, H) {
      uniforms.uRes.value.set(W, H);
      uniforms.uF.value = state.F;
      uniforms.uN.value.set(Math.cos(state.a), Math.sin(state.a));
      uniforms.uR.value = state.R;
      renderer.domElement.style.visibility = state.F > 0.5 ? "visible" : "hidden";
      if (state.F > 0.5) renderer.render(scene, camera);
    },
    resize(W, H) {
      renderer.setSize(W, H, false);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
