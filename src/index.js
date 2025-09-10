import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { urlParse, rootPath } from "./utils/index.js";

const email = "29006754@qq.com";
const pwd = "Wygdy123654.";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userDataDir = path.join(__dirname, "caches", "buyin_" + email);

run();

let page = null;

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: userDataDir,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    page = (await browser.pages())[0];
  } catch (err) {
    console.log(err);
  }
  if (!page) {
    page = await browser.newPage();
  }

  /* 模拟真实浏览器信息 - START */
  await page.evaluateOnNewDocument(() => {
    const newProto = navigator.__proto__;
    delete newProto.webdriver;
    navigator.__proto__ = newProto;
  });
  await page.evaluateOnNewDocument(() => {
    window.chrome = {};
    window.chrome.app = {
      InstallState: "hehe",
      RunningState: "haha",
      getDetails: "xixi",
      getIsInstalled: "ohno"
    };
    window.chrome.csi = function () {};
    window.chrome.loadTimes = function () {};
    window.chrome.runtime = function () {};
  });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "plugins", {
      get: () => [
        {
          description: "Portable Document Format",
          filename: "internal-pdf-viewer",
          length: 1,
          name: "Chrome PDF Plugin"
        }
      ]
    });
  });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "languages", {
      get: () => ["zh-CN", "zh", "en"]
    });
  });
  await page.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "Sec-Ch-Ua":
      '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Accept-Encoding": "gzip, deflate, br, zstd"
  });
  /* 模拟真实浏览器信息 - END */

  await page.setViewport({ width: 1280, height: 0 });

  page.on("requestfailed", async (request) => {
    console.log(
      "[requestfailed]:",
      request.url(),
      request.method(),
      request.response()
    );
  });

  page.on("error", (error) => {
    console.log("[error]:", error.message);
  });

  page.on("response", async (response) => {
    const { path } = urlParse(response.url());
    switch (path) {
      case "https://buyin.jinritemai.com/ecom/captain/institution/activity/list":
        setActivityList(response);
        break;
    }
  });

  try {
    await page.goto(
      "https://buyin.jinritemai.com/dashboard/institution/activity"
    );
  } catch (error) {
    console.error("[goto-activity-error]:", error);
  } finally {
    // await browser.close();
  }
}

const activityList = {
  page: 1,
  page_size: 20,
  list: [],
  finished: false
};
async function setActivityList(response) {
  try {
    console.log("正在获取列表数据：" + activityList.page);
    const { data = [], total = 0 } = await response.json();
    if (!total || !data?.length) {
      onActivityFinished();
      return;
    }
    console.log("获取列表数据成功");
    activityList.list = [...activityList.list, ...data];
    if (activityList.list.length == total) {
      onActivityFinished();
    }
  } catch (error) {
    onActivityFinished();
    console.error("获取列表数据失败:", error);
  } finally {
    setTimeout(() => {
      if (!activityList.finished) {
        // 下一页
        tapPageItem(++activityList.page);
      }
    }, 100);
  }
}

async function tapPageItem(pageIndex) {
  console.log("正在翻页：" + pageIndex);
  await page.waitForSelector(".auxo-pagination");
  const btn = await page.$(
    ".auxo-pagination-item.auxo-pagination-item-" + pageIndex
  );
  if (!btn) {
    onActivityFinished();
    return;
  }
  setTimeout(() => btn.click(), 3000);
}

function onActivityFinished() {
  activityList.finished = true;
  // browser.close();
  if (activityList.list.length) {
    const mkdirName = "dist";
    const mkdirPath = rootPath(mkdirName);
    if (!existsSync(mkdirPath)) {
      mkdirSync(mkdirPath);
    }
    const filePath = "activity-list-" + new Date().getTime() + ".json";
    console.log("拉取完成，开始写入：" + mkdirName + "/" + filePath);
    writeFileSync(
      mkdirPath + "/" + filePath,
      JSON.stringify(activityList.list, null, 2)
    );
    console.log("写入完成");
  } else {
    console.log("未拉取到数据");
  }
}
