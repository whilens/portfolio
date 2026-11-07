import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve("C:/Users/ArtemNew/Desktop/2027-2030/Портфолио");
const OUT = path.resolve("C:/Users/ArtemNew/Desktop/2027-2030/Портфолио/studio-portfolio/public/videos");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ico": "image/x-icon",
};

const PUBLIC = path.resolve(
  "C:/Users/ArtemNew/Desktop/2027-2030/Портфолио/studio-portfolio/public",
);

const projects = [
  {
    slug: "arrow",
    file: "ARROW/index.html",
    shots: ["cases/arrow/1.png", "cases/arrow/2.png", "cases/arrow/3.png", "cases/arrow/4.png"],
  },
  {
    slug: "stroy",
    file: "СТРОЙ/index.html",
    shots: ["cases/stroy/1.png", "cases/stroy/2.png", "cases/stroy/3.png", "cases/stroy/4.png"],
  },
  {
    slug: "rumtibet",
    file: "РУМТИБЕТ/index.html",
    shots: [
      "cases/rumtibet/1.png",
      "cases/rumtibet/2.png",
      "cases/rumtibet/3.png",
      "cases/rumtibet/4.png",
    ],
  },
  {
    slug: "vr",
    file: "VR-референс по анимациям/index.html",
    shots: ["cases/vr/man.png", "cases/vr/child.png", "posters/vr.png"],
  },
  {
    slug: "southpark",
    file: "ЮЖНЫЙ ПАРК-референс по анимациям/index.html",
    shots: ["cases/southpark/frame.png", "cases/southpark/g1.png", "cases/southpark/details.png"],
  },
];

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      let filePath = path.join(ROOT, urlPath.replace(/^\//, ""));
      if (urlPath.startsWith("/public-shots/")) {
        filePath = path.join(PUBLIC, urlPath.replace("/public-shots/", ""));
      }
      if (urlPath.endsWith("/")) filePath = path.join(filePath, "index.html");
      fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
          res.writeHead(404);
          res.end("not found");
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
      });
    });
    server.listen(8765, "127.0.0.1", () => resolve(server));
  });
}

async function recordOne(browser, item) {
  const tmp = fs.mkdtempSync(path.join(OUT, `.tmp-${item.slug}-`));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 810 },
    deviceScaleFactor: 1,
    recordVideo: { dir: tmp, size: { width: 1280, height: 720 } },
    locale: "ru-RU",
  });
  const page = await context.newPage();
  const url = `http://127.0.0.1:8765/${item.file.split("/").map(encodeURIComponent).join("/")}`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    const bodyText = await page.evaluate(() => document.body?.innerText?.length || 0);
    if (bodyText < 40) throw new Error("empty page");
    await page.waitForTimeout(800);
    for (let i = 0; i < 7; i += 1) {
      await page.mouse.move(180 + i * 140, 220 + (i % 3) * 80, { steps: 12 });
      await page.mouse.wheel(0, 620);
      await page.waitForTimeout(480);
    }
    await page.waitForTimeout(600);
  } catch (error) {
    console.warn(`live site failed for ${item.slug}, using stills:`, error.message);
    const slides = (item.shots || [])
      .map(
        (src, i) =>
          `<img src="/public-shots/${src}" style="animation-delay:${i * 1.6}s" alt="">`,
      )
      .join("");
    await page.setContent(`<!doctype html><html><head><style>
      html,body{margin:0;background:#05070f;height:100%;overflow:hidden}
      img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;
        animation:ken 8s linear infinite;transform-origin:center}
      @keyframes ken{0%{opacity:0;transform:scale(1)}8%{opacity:1}28%{opacity:1;transform:scale(1.12)}36%{opacity:0}100%{opacity:0}}
    </style></head><body>${slides}</body></html>`, { waitUntil: "load" });
    await page.waitForTimeout(7200);
  }
  await page.close();
  await context.close();
  const files = fs.readdirSync(tmp).filter((name) => name.endsWith(".webm"));
  if (!files[0]) {
    fs.rmSync(tmp, { recursive: true, force: true });
    throw new Error(`no video for ${item.slug}`);
  }
  const dest = path.join(OUT, `${item.slug}.webm`);
  fs.copyFileSync(path.join(tmp, files[0]), dest);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("saved", dest);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const item of projects) {
      await recordOne(browser, item);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
