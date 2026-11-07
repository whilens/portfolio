/**
 * Port of Pavel Dobryakov's WebGL Fluid Simulation
 * https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 * MIT License — Copyright (c) 2017 Pavel Dobryakov
 *
 * Bloom, sunrays, GUI and mobile promo are omitted for overlay performance.
 */

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

type RGB = { r: number; g: number; b: number };

type GLExt = {
  formatRGBA: { internalFormat: number; format: number };
  formatRG: { internalFormat: number; format: number };
  formatR: { internalFormat: number; format: number };
  halfFloatTexType: number;
  supportLinearFiltering: boolean;
};

export type FluidHandle = {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
};

const BASE_VERT = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const DISPLAY_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uTexture;
uniform vec2 texelSize;
void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;
  vec3 lc = texture2D(uTexture, vL).rgb;
  vec3 rc = texture2D(uTexture, vR).rgb;
  vec3 tc = texture2D(uTexture, vT).rgb;
  vec3 bc = texture2D(uTexture, vB).rgb;
  float dx = length(rc) - length(lc);
  float dy = length(tc) - length(bc);
  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
  c *= diffuse;
  float a = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c, a);
}
`;

const SPLAT_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
`;

const ADVECTION_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
}
`;

const DIVERGENCE_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}
`;

const CURL_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}
`;

const VORTICITY_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = clamp(velocity, -1000.0, 1000.0);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const PRESSURE_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`;

const GRADIENT_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const CLEAR_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || "compile");
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fsSource: string) {
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  if (!program) throw new Error("program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "link");
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
}

function supportFormat(
  gl: WebGLRenderingContext,
  internalFormat: number,
  format: number,
  type: number,
) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(texture);
  return ok;
}

function getWebGL(canvas: HTMLCanvasElement) {
  const params: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    premultipliedAlpha: true,
  };
  const gl2 = canvas.getContext("webgl2", params);
  const gl = (gl2 ||
    canvas.getContext("webgl", params) ||
    canvas.getContext("experimental-webgl", params)) as WebGLRenderingContext | null;
  if (!gl) return null;

  const isWebGL2 = Boolean(gl2);
  let halfFloat: OES_texture_half_float | null = null;
  let supportLinearFiltering = false;

  if (isWebGL2) {
    gl.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = Boolean(gl.getExtension("OES_texture_float_linear"));
  } else {
    halfFloat = gl.getExtension("OES_texture_half_float");
    supportLinearFiltering = Boolean(gl.getExtension("OES_texture_half_float_linear"));
  }

  const halfFloatTexType = isWebGL2
    ? (gl as WebGL2RenderingContext).HALF_FLOAT
    : halfFloat?.HALF_FLOAT_OES;
  if (halfFloatTexType == null) return null;

  const gl2c = gl as WebGL2RenderingContext;
  let formatRGBA: { internalFormat: number; format: number } | null = null;
  let formatRG: { internalFormat: number; format: number } | null = null;
  let formatR: { internalFormat: number; format: number } | null = null;

  if (isWebGL2) {
    formatRGBA = supportFormat(gl, gl2c.RGBA16F, gl.RGBA, halfFloatTexType)
      ? { internalFormat: gl2c.RGBA16F, format: gl.RGBA }
      : null;
    formatRG = supportFormat(gl, gl2c.RG16F, gl2c.RG, halfFloatTexType)
      ? { internalFormat: gl2c.RG16F, format: gl2c.RG }
      : supportFormat(gl, gl2c.RGBA16F, gl.RGBA, halfFloatTexType)
        ? { internalFormat: gl2c.RGBA16F, format: gl.RGBA }
        : null;
    formatR = supportFormat(gl, gl2c.R16F, gl2c.RED, halfFloatTexType)
      ? { internalFormat: gl2c.R16F, format: gl2c.RED }
      : formatRG;
  } else {
    formatRGBA = supportFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
      ? { internalFormat: gl.RGBA, format: gl.RGBA }
      : null;
    formatRG = formatRGBA;
    formatR = formatRGBA;
  }

  if (!formatRGBA || !formatRG || !formatR) return null;

  gl.clearColor(0, 0, 0, 0);

  const ext: GLExt = {
    formatRGBA,
    formatRG,
    formatR,
    halfFloatTexType,
    supportLinearFiltering,
  };
  return { gl, ext };
}

function hsvToRgb(h: number, s: number, v: number): RGB {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      return { r: v, g: t, b: p };
    case 1:
      return { r: q, g: v, b: p };
    case 2:
      return { r: p, g: v, b: t };
    case 3:
      return { r: p, g: q, b: v };
    case 4:
      return { r: t, g: p, b: v };
    default:
      return { r: v, g: p, b: q };
  }
}

function studioColor(): RGB {
  const c = hsvToRgb(0.58 + Math.random() * 0.14, 0.85, 1);
  return { r: c.r * 0.18, g: c.g * 0.18, b: c.b * 0.22 };
}

export function createFluidSimulation(
  canvas: HTMLCanvasElement,
  options?: { simResolution?: number; dyeResolution?: number; dpr?: number },
): FluidHandle | null {
  const ctx = getWebGL(canvas);
  if (!ctx) return null;
  const { gl, ext } = ctx;

  const config = {
    SIM_RESOLUTION: options?.simResolution ?? 128,
    DYE_RESOLUTION: options?.dyeResolution ?? 512,
    DENSITY_DISSIPATION: 0.965,
    VELOCITY_DISSIPATION: 0.18,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 18,
    CURL: 28,
    SPLAT_RADIUS: 0.28,
    PAUSED: false,
  };

  const dprCap = options?.dpr ?? 1;
  const vs = compileShader(gl, gl.VERTEX_SHADER, BASE_VERT);
  const display = createProgram(gl, vs, DISPLAY_FRAG);
  const splat = createProgram(gl, vs, SPLAT_FRAG);
  const advection = createProgram(gl, vs, ADVECTION_FRAG);
  const divergence = createProgram(gl, vs, DIVERGENCE_FRAG);
  const curl = createProgram(gl, vs, CURL_FRAG);
  const vorticity = createProgram(gl, vs, VORTICITY_FRAG);
  const pressure = createProgram(gl, vs, PRESSURE_FRAG);
  const gradient = createProgram(gl, vs, GRADIENT_FRAG);
  const clear = createProgram(gl, vs, CLEAR_FRAG);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  function blit(target: FBO | null) {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  function createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): FBO {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    if (!texture) throw new Error("tex");
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    if (!fbo) throw new Error("fbo");
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);
    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const tmp = fbo1;
        fbo1 = fbo2;
        fbo2 = tmp;
      },
    };
  }

  function getResolution(resolution: number) {
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max };
  }

  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
  let dye: DoubleFBO;
  let velocity: DoubleFBO;
  let divergenceFBO: FBO;
  let curlFBO: FBO;
  let pressureFBO: DoubleFBO;

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);
    const texType = ext.halfFloatTexType;
    dye = createDoubleFBO(
      dyeRes.width,
      dyeRes.height,
      ext.formatRGBA.internalFormat,
      ext.formatRGBA.format,
      texType,
      filtering,
    );
    velocity = createDoubleFBO(
      simRes.width,
      simRes.height,
      ext.formatRG.internalFormat,
      ext.formatRG.format,
      texType,
      filtering,
    );
    divergenceFBO = createFBO(
      simRes.width,
      simRes.height,
      ext.formatR.internalFormat,
      ext.formatR.format,
      texType,
      gl.NEAREST,
    );
    curlFBO = createFBO(
      simRes.width,
      simRes.height,
      ext.formatR.internalFormat,
      ext.formatR.format,
      texType,
      gl.NEAREST,
    );
    pressureFBO = createDoubleFBO(
      simRes.width,
      simRes.height,
      ext.formatR.internalFormat,
      ext.formatR.format,
      texType,
      gl.NEAREST,
    );
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  function correctRadius(radius: number) {
    const aspect = canvas.width / canvas.height;
    return aspect > 1 ? radius * aspect : radius;
  }

  function splatAt(x: number, y: number, dx: number, dy: number, color: RGB) {
    gl.useProgram(splat.program);
    gl.uniform1i(splat.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splat.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splat.uniforms.point, x, y);
    gl.uniform3f(splat.uniforms.color, dx, dy, 0);
    gl.uniform1f(splat.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splat.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(splat.uniforms.color, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = studioColor();
      color.r *= 10;
      color.g *= 10;
      color.b *= 10;
      splatAt(
        Math.random(),
        Math.random(),
        1000 * (Math.random() - 0.5),
        1000 * (Math.random() - 0.5),
        color,
      );
    }
  }

  function step(dt: number) {
    gl.disable(gl.BLEND);

    gl.useProgram(curl.program);
    gl.uniform2f(curl.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(curl.uniforms.uVelocity, velocity.read.attach(0));
    blit(curlFBO);

    gl.useProgram(vorticity.program);
    gl.uniform2f(vorticity.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(vorticity.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticity.uniforms.uCurl, curlFBO.attach(1));
    gl.uniform1f(vorticity.uniforms.curl, config.CURL);
    gl.uniform1f(vorticity.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(divergence.program);
    gl.uniform2f(divergence.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergence.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergenceFBO);

    gl.useProgram(clear.program);
    gl.uniform1i(clear.uniforms.uTexture, pressureFBO.read.attach(0));
    gl.uniform1f(clear.uniforms.value, config.PRESSURE);
    blit(pressureFBO.write);
    pressureFBO.swap();

    gl.useProgram(pressure.program);
    gl.uniform2f(pressure.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressure.uniforms.uDivergence, divergenceFBO.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressure.uniforms.uPressure, pressureFBO.read.attach(1));
      blit(pressureFBO.write);
      pressureFBO.swap();
    }

    gl.useProgram(gradient.program);
    gl.uniform2f(gradient.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradient.uniforms.uPressure, pressureFBO.read.attach(0));
    gl.uniform1i(gradient.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(advection.program);
    gl.uniform2f(advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    const velocityId = velocity.read.attach(0);
    gl.uniform1i(advection.uniforms.uVelocity, velocityId);
    gl.uniform1i(advection.uniforms.uSource, velocityId);
    gl.uniform1f(advection.uniforms.dt, dt);
    gl.uniform1f(advection.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(advection.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advection.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(advection.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  }

  function render() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(display.program);
    gl.uniform2f(
      display.uniforms.texelSize,
      1 / gl.drawingBufferWidth,
      1 / gl.drawingBufferHeight,
    );
    gl.uniform1i(display.uniforms.uTexture, dye.read.attach(0));
    blit(null);
    gl.disable(gl.BLEND);
  }

  let lastTime = performance.now();
  let raf = 0;
  let running = true;
  let autoSplat = 0.4;
  let nextCloud = 1.2 + Math.random() * 1.4;

  function randomCloud() {
    const color = studioColor();
    color.r *= 8 + Math.random() * 6;
    color.g *= 8 + Math.random() * 6;
    color.b *= 8 + Math.random() * 6;
    splatAt(
      0.12 + Math.random() * 0.76,
      0.12 + Math.random() * 0.76,
      900 * (Math.random() - 0.5),
      700 * (Math.random() - 0.5),
      color,
    );
  }

  function loop(now: number) {
    if (!running || document.hidden) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - lastTime) / 1000, 0.016666);
    lastTime = now;
    if (resizeCanvas()) initFramebuffers();
    autoSplat += dt;
    if (autoSplat >= nextCloud) {
      autoSplat = 0;
      nextCloud = 1.1 + Math.random() * 2.2;
      randomCloud();
      if (Math.random() > 0.55) randomCloud();
    }
    if (!config.PAUSED) step(dt);
    render();
  }

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      return;
    }
    lastTime = performance.now();
    raf = requestAnimationFrame(loop);
  };

  resizeCanvas();
  initFramebuffers();
  multipleSplats(8);
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(loop);

  return {
    setPaused(paused: boolean) {
      config.PAUSED = paused;
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    },
  };
}
