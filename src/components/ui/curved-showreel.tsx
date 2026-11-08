"use client";

import { useEffect, useRef, useState } from "react";

export type ReelItem = {
  title: string;
  category: string;
  image: string;
};

export type CurvedShowreelProps = {
  items: ReelItem[];
  loop?: boolean;
  cursorLabel?: string;
  onSelect?: (item: ReelItem, index: number) => void;
  ariaLabel?: string;
};

const MAX_TILES = 16;
const COLS = 4;
const CELL_W = 960;
const CELL_H = 540;

const VS = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uPos;
uniform float uTheta;
uniform float uH;
uniform float uCy;
uniform float uK;
uniform float uTW;
uniform float uT;
uniform vec3 uBg;
uniform sampler2D uSheet;
uniform vec4 uCell[16];
out vec4 fragColor;

float wrapMod(float x, float n) {
  return mod(mod(x, n) + n, n);
}

vec3 sampleReel(float s, float v) {
  float t = max(uT, 1.0);
  float id = wrapMod(floor(s), t);
  int iid = int(id);
  float f = fract(s);
  vec4 cell = uCell[iid];
  return texture(uSheet, cell.xy + vec2(f, v) * cell.zw).rgb;
}

void main() {
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float x = (fc.x - uRes.x * 0.5) / (uRes.x * 0.5);
  float ax = abs(x);
  float tT = tan(max(uTheta, 0.001));
  float th = atan(x * tT);
  float spx = (th / tT) * uRes.x * 0.5;
  float s = uPos + spx / max(uTW, 1.0);
  float hhPix = uH * mix(1.0, 1.0 / cos(th), uK);
  float v = (fc.y - uCy) / (2.0 * hhPix) + 0.5;
  float feather = 0.006 + ax * ax * 0.16;
  float m = smoothstep(0.0, feather, v) * smoothstep(0.0, feather, 1.0 - v);
  float r = pow(ax, 2.4) * 0.06 * uK;
  vec3 col = vec3(0.0);
  for (int k = -4; k <= 4; k++) {
    float o = float(k) / 4.0;
    col += sampleReel(s + o * r, clamp(v + o * r * 0.6, 0.0, 1.0));
  }
  col /= 9.0;
  col *= mix(1.0, 0.55, ax * ax * uK);
  fragColor = vec4(mix(uBg, col, m), 1.0);
}`;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function wrapMod(v: number, n: number) {
  return ((v % n) + n) % n;
}

function wrapNear(c: number, ref: number, n: number) {
  return c + Math.round((ref - c) / n) * n;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const ir = img.width / img.height;
  const tr = w / h;
  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;
  if (ir > tr) {
    dh = h;
    dw = h * ir;
    dx = x + (w - dw) / 2;
    dy = y;
  } else {
    dw = w;
    dh = w / ir;
    dx = x;
    dy = y + (h - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

export default function CurvedShowreel({
  items,
  loop = false,
  cursorLabel = "Смотреть работы",
  onSelect,
  ariaLabel = "Зал работ",
}: CurvedShowreelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const curLabRef = useRef<HTMLElement>(null);
  const onSelectRef = useRef(onSelect);
  const loopRef = useRef(loop);
  const [front, setFront] = useState(0);
  const n = items.length;

  onSelectRef.current = onSelect;
  loopRef.current = loop;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const list = listRef.current;
    const nextEl = nextRef.current;
    const curEl = curRef.current;
    const curLab = curLabRef.current;
    if (!root || !canvas || !list || !nextEl || !curEl || !curLab || n === 0) return;

    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const black = new Uint8Array([4, 6, 11, 255]);
    const sheetTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sheetTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, black);

    const loc = {
      res: gl.getUniformLocation(prog, "uRes"),
      pos: gl.getUniformLocation(prog, "uPos"),
      theta: gl.getUniformLocation(prog, "uTheta"),
      h: gl.getUniformLocation(prog, "uH"),
      cy: gl.getUniformLocation(prog, "uCy"),
      k: gl.getUniformLocation(prog, "uK"),
      tw: gl.getUniformLocation(prog, "uTW"),
      t: gl.getUniformLocation(prog, "uT"),
      bg: gl.getUniformLocation(prog, "uBg"),
      sheet: gl.getUniformLocation(prog, "uSheet"),
      cell: gl.getUniformLocation(prog, "uCell[0]") ?? gl.getUniformLocation(prog, "uCell"),
    };
    gl.uniform1i(loc.sheet, 0);
    gl.uniform1f(loc.t, n);

    const cells = new Float32Array(MAX_TILES * 4);
    const rows = Math.max(1, Math.ceil(n / COLS));
    const sw = COLS * CELL_W;
    const sh = rows * CELL_H;
    for (let k = 0; k < n; k++) {
      const col = k % COLS;
      const row = Math.floor(k / COLS);
      cells[k * 4] = (col * CELL_W) / sw;
      cells[k * 4 + 1] = (row * CELL_H) / sh;
      cells[k * 4 + 2] = CELL_W / sw;
      cells[k * 4 + 3] = CELL_H / sh;
    }
    gl.uniform4fv(loc.cell, cells);

    let disposed = false;
    const imgs = items.map((item) => {
      const img = new Image();
      img.decoding = "async";
      img.src = item.image;
      return img;
    });
    Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth) resolve();
            else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          }),
      ),
    ).then(() => {
      if (disposed) return;
      const atlas = document.createElement("canvas");
      atlas.width = sw;
      atlas.height = sh;
      const ctx = atlas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#04060b";
      ctx.fillRect(0, 0, sw, sh);
      imgs.forEach((img, k) => {
        if (!img.naturalWidth) return;
        const col = k % COLS;
        const row = Math.floor(k / COLS);
        drawCover(ctx, img, col * CELL_W, row * CELL_H, CELL_W, CELL_H);
      });
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sheetTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    });

    let W = 1;
    let H = 1;
    let pos = 0.5;
    let tgt = 0.5;
    let cur = 0;
    let rollI = n;
    let ref: number | null = null;
    let lastIn = 0;
    let dragging = false;
    let raf = 0;
    let last = performance.now();
    let nextTimer = 0;
    let rollTimer = 0;
    let nextBusy = false;

    const bound = (v: number) => (loopRef.current ? v : clamp(v, 0.5, n - 0.5));

    const markCur = () => {
      const lines = list.querySelectorAll("span");
      lines.forEach((el, i) => el.classList.toggle("cur", i === rollI));
    };

    const applyRoll = (instant: boolean) => {
      if (instant) list.style.transition = "none";
      list.style.transform = `translateY(${-rollI * 7.9}vw)`;
      markCur();
      if (instant) {
        list.getBoundingClientRect();
        list.style.transition = "";
      }
    };

    const setRoll = (i: number, dir: number) => {
      let target = n + i;
      if (dir > 0 && target < rollI) target += n;
      else if (dir < 0 && target > rollI) target -= n;
      rollI = target;
      applyRoll(false);
      window.clearTimeout(rollTimer);
      rollTimer = window.setTimeout(() => {
        if (rollI !== n + i) {
          rollI = n + i;
          applyRoll(true);
        }
      }, 1050);
    };

    const setNext = (i: number) => {
      const title = items[(i + 1) % n]?.title ?? "";
      if (nextBusy) {
        nextEl.textContent = title;
        return;
      }
      nextBusy = true;
      nextEl.style.transition = "transform .7s cubic-bezier(.7,0,.2,1)";
      nextEl.style.transform = "translateY(-110%)";
      window.clearTimeout(nextTimer);
      nextTimer = window.setTimeout(() => {
        nextEl.textContent = title;
        nextEl.style.transition = "none";
        nextEl.style.transform = "translateY(110%)";
        nextEl.getBoundingClientRect();
        nextEl.style.transition = "transform .7s cubic-bezier(.7,0,.2,1)";
        nextEl.style.transform = "none";
        nextBusy = false;
      }, 350);
    };

    const projectAt = (p: number) => wrapMod(Math.floor(p), n);

    const settle = (x: number) => {
      const r = ref ?? x;
      const d = x - r;
      if (Math.abs(d) < 0.18) return bound(r);
      let best: number | null = null;
      let bestDist = Infinity;
      for (let i = 0; i < n; i++) {
        const c = loopRef.current ? wrapNear(i + 0.5, x, n) : i + 0.5;
        if ((c - r) * d > 0.01 && Math.abs(c - x) < bestDist) {
          bestDist = Math.abs(c - x);
          best = c;
        }
      }
      return bound(best ?? r);
    };

    const goP = (i: number) => {
      ref = null;
      const idx = wrapMod(i, n);
      tgt = loopRef.current ? wrapNear(idx + 0.5, pos, n) : idx + 0.5;
    };

    const inHit = (x: number, y: number) => Math.abs(x - W / 2) < 0.3 * W && y > 0.18 * H && y < 0.78 * H;

    const startGesture = () => {
      if (ref == null) ref = loopRef.current ? wrapNear(cur + 0.5, pos, n) : cur + 0.5;
    };

    const size = () => {
      W = root.clientWidth || window.innerWidth;
      H = root.clientHeight || window.innerHeight;
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(W * d));
      canvas.height = Math.max(1, Math.round(H * d));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const frame = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!dragging && ref != null && now - lastIn > 380) {
        tgt = settle(tgt);
        ref = null;
      }

      pos += (tgt - pos) * (1 - Math.exp(-5.5 * dt));
      const a = projectAt(pos);
      if (a !== cur) {
        const dir = wrapMod(a - cur, n) <= n / 2 ? 1 : -1;
        cur = a;
        setFront(a);
        setRoll(a, dir);
        setNext(a);
      }

      const ratio = canvas.width / Math.max(W, 1);
      const hh = 0.245 * H * ratio;
      const cy = 0.455 * H * ratio;
      const tw = 2 * hh * (16 / 9);

      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.pos, pos);
      gl.uniform1f(loc.theta, 0.95);
      gl.uniform1f(loc.h, hh);
      gl.uniform1f(loc.cy, cy);
      gl.uniform1f(loc.k, 1);
      gl.uniform1f(loc.tw, tw);
      gl.uniform3f(loc.bg, 0.0157, 0.0235, 0.0431);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };

    const onWheel = (e: WheelEvent) => {
      const px = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!loopRef.current) {
        const atStart = pos <= 0.52 && px < 0;
        const atEnd = pos >= n - 0.52 && px > 0;
        if (atStart || atEnd) return;
      }
      e.preventDefault();
      startGesture();
      tgt = bound(tgt + px * 0.0032);
      lastIn = performance.now();
    };

    let drag: { x: number; t: number; moved: number; v: number; lastX: number; lastT: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      ref = null;
      startGesture();
      drag = { x: e.clientX, t: tgt, moved: 0, v: 0, lastX: e.clientX, lastT: performance.now() };
      dragging = true;
      root.classList.add("grab");
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* already up */
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      curEl.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
      const hit = inHit(e.clientX - r.left, e.clientY - r.top);
      curEl.classList.toggle("lab", hit);
      curLab.textContent = hit ? cursorLabel : "";

      if (!drag) return;
      const tilePx = H * 0.49 * (16 / 9);
      const dx = e.clientX - drag.x;
      drag.moved = Math.max(drag.moved, Math.abs(dx));
      const now = performance.now();
      const dt = Math.max(1, now - drag.lastT);
      const inst = (e.clientX - drag.lastX) / dt;
      drag.v = drag.v * 0.6 + inst * 0.4;
      drag.lastX = e.clientX;
      drag.lastT = now;
      tgt = bound(drag.t - dx / tilePx);
      pos += (tgt - pos) * 0.65;
      lastIn = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      dragging = false;
      root.classList.remove("grab");
      const r = root.getBoundingClientRect();
      if (drag.moved < 6) {
        ref = null;
        if (inHit(e.clientX - r.left, e.clientY - r.top)) onSelectRef.current?.(items[cur], cur);
      } else {
        const tilePx = H * 0.49 * (16 / 9);
        tgt = bound(settle(tgt - (drag.v * 260) / tilePx));
        ref = null;
        lastIn = 0;
      }
      drag = null;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goP(cur + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goP(cur - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelectRef.current?.(items[cur], cur);
      }
    };

    size();
    setRoll(0, 1);
    const ro = new ResizeObserver(size);
    ro.observe(root);
    root.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    root.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(frame);

    const bNext = root.querySelector("#nrNext");
    const bPrev = root.querySelector("#nrPrev");
    const onNext = () => goP(cur + 1);
    const onPrev = () => goP(cur - 1);
    bNext?.addEventListener("click", onNext);
    bPrev?.addEventListener("click", onPrev);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(nextTimer);
      window.clearTimeout(rollTimer);
      ro.disconnect();
      root.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      root.removeEventListener("keydown", onKey);
      bNext?.removeEventListener("click", onNext);
      bPrev?.removeEventListener("click", onPrev);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.deleteTexture(sheetTex);
    };
  }, [items, n, cursorLabel]);

  const titles = [...items, ...items, ...items];
  const nextTitle = items[(front + 1) % Math.max(n, 1)]?.title ?? "";

  return (
    <div
      ref={rootRef}
      className="nr-root"
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <style>{CSS}</style>
      <canvas ref={canvasRef} className="nr-gl" />
      <section className="nr-home" aria-hidden="true">
        <div className="nr-roll">
          <div className="nr-slide">
            <div ref={listRef} className="nr-list">
              {titles.map((item, i) => (
                <span key={`${item.title}-${i}`} className={i === n ? "cur" : ""}>
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="nr-nx">
          <div className="nr-lab">
            <span>Далее</span>
            <b>
              <i ref={nextRef}>{nextTitle}</i>
            </b>
          </div>
          <button id="nrNext" className="nr-rb" type="button" aria-label="Следующая работа">
            <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden>
              <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </button>
          <button id="nrPrev" className="nr-rb" type="button" aria-label="Предыдущая работа">
            <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden>
              <path d="M16 5l-8 7 8 7" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </button>
        </div>
      </section>
      <div ref={curRef} className="nr-cur">
        <b ref={curLabRef} />
      </div>
    </div>
  );
}

const CSS = `
.nr-root{position:relative;height:100%;width:100%;overflow:hidden;color:#f4f2ee;cursor:none;outline:none;user-select:none;-webkit-user-select:none}
.nr-root.grab,.nr-root.grab *{cursor:none}
.nr-gl{position:absolute;inset:0;width:100%;height:100%;touch-action:none;display:block}
.nr-home{position:absolute;inset:0;z-index:5;pointer-events:none}
.nr-roll{position:absolute;left:1.3vw;bottom:2.2vh;height:7.9vw;overflow:hidden}
.nr-slide{transition:transform .55s cubic-bezier(.7,0,.2,1) .1s}
.nr-list{transition:transform 1s cubic-bezier(.7,0,.2,1)}
.nr-list span{display:block;font-family:var(--font-unbounded),Impact,sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:-.005em;line-height:7.9vw;height:7.9vw;font-size:8.6vw;white-space:nowrap}
.nr-nx{position:absolute;right:1.6vw;bottom:2.4vh;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:var(--font-manrope),sans-serif;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;transition:transform .55s cubic-bezier(.7,0,.2,1) .1s}
.nr-lab{text-align:right;line-height:1.35}
.nr-lab span{display:block;opacity:.5;font-size:8px}
.nr-lab b{display:block;height:13px;overflow:hidden;font-weight:500}
.nr-lab i{display:block;font-style:normal;transition:transform .7s cubic-bezier(.7,0,.2,1)}
.nr-rb{width:26px;height:26px;border-radius:50%;border:0;background:#f4f2ee;color:#04060b;display:grid;place-items:center;pointer-events:auto;cursor:none;transition:transform .25s cubic-bezier(.2,.8,.2,1)}
.nr-rb:hover{transform:scale(1.15)}
.nr-cur{position:absolute;left:0;top:0;z-index:20;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#ff2b2b;pointer-events:none}
.nr-cur b{position:absolute;left:14px;top:-4px;font-family:var(--font-manrope),sans-serif;font-size:9px;font-weight:500;letter-spacing:.08em;color:#f4f2ee;white-space:nowrap;opacity:0;transition:opacity .25s}
.nr-cur.lab b{opacity:1}
@media (hover:none){.nr-cur{display:none}.nr-root{cursor:auto}}
`;
