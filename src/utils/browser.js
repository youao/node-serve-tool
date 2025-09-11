import puppeteer from "puppeteer";

export async function puppeteerLaunch(userDataDir) {
  const options = {
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  };
  if (userDataDir) {
    options.userDataDir = userDataDir;
  }
  const browser = await puppeteer.launch(options);
  let page = null

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

  await page.setViewport({ width: 0, height: 0 });

  return {
    browser,
    page
  };
}
