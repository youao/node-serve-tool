import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";

import puppeteer from "puppeteer";
import accountCookies from "../caches/buyin.cookies.json" with { type: "json" };
import { fetchBuyinLoginByEmail } from "../libs/buyin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const globalBrowser = await puppeteer.launch({
  headless: false,
  devtools: false,
  args: ["--no-sandbox"],
  ignoreDefaultArgs: ["--enable-automation"]
});
const puppeteerPage = (await globalBrowser.pages())[0];

const cookieDomain = {
  "ssid_ucp_v1": [".jinritemai.com"],
  "buyin_app_id_v2": [".buyin.jinritemai.com"],
  "buyin_shop_type": [".buyin.jinritemai.com"],
  "is_staff_user": [".jinritemai.com"],
  "sid_ucp_v1": [".jinritemai.com"],
  "sessionid": [".jinritemai.com"],
  "SASID": [".buyin.jinritemai.com"],
  "uid_tt": [".jinritemai.com"],
  "buyin_account_child_type_v2": [".buyin.jinritemai.com"],
  "uid_tt_ss": [".jinritemai.com"],
  "passport_csrf_token_default": [".jinritemai.com"],
  "buyin_shop_type_v2": [".buyin.jinritemai.com"],
  "ucas_c0_ss_buyin": [".buyin.jinritemai.com"],
  "sid_tt": [".jinritemai.com"],
  "_tea_utm_cache_3813": [".buyin.jinritemai.com"],
  "BUYIN_SASID": [".jinritemai.com"],
  "buyin_app_id": [".buyin.jinritemai.com"],
  "buyin_account_child_type": [".buyin.jinritemai.com"],
  "ucas_c0_buyin": [".buyin.jinritemai.com"],
  "s_v_web_id": ["buyin.jinritemai.com"],
  "sessionid_ss": [".jinritemai.com"],
  "sid_guard": [".jinritemai.com"],
  "passport_csrf_token": [".jinritemai.com"],
  "store-region": [".jinritemai.com"],
  "store-region-src": [".jinritemai.com"],
  "gfkadpd": ["buyin.jinritemai.com"]
};

// https://buyin.jinritemai.com/index/getUser

const setPageCookies = async (cookies) => {
  const arr = [];
  for (const key in cookies) {
    const domains = cookieDomain[key] || [
      ".jinritemai.com",
      ".buyin.jinritemai.com"
    ];
    for (const domain of domains) {
      arr.push({
        name: key,
        value: cookies[key],
        domain
      });
    }
  }
  await globalBrowser.setCookie(...arr);
};

async function start() {
  await puppeteerPage.evaluateOnNewDocument(() => {
    const newProto = navigator.__proto__;
    delete newProto.webdriver;
    navigator.__proto__ = newProto;
  });
  await puppeteerPage.evaluateOnNewDocument(() => {
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
  await puppeteerPage.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "plugins", {
      //伪装真实的插件信息
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
  await puppeteerPage.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "languages", {
      //添加语言
      get: () => ["zh-CN", "zh", "en"]
    });
  });
  await puppeteerPage.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query; //notification伪装
    window.navigator.permissions.query = (parameters) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  });
  await puppeteerPage.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
  );
  await puppeteerPage.setExtraHTTPHeaders({
    "Sec-Ch-Ua":
      '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Accept-Encoding": "gzip, deflate, br, zstd"
  });

  await setPageCookies(accountCookies["29006754@qq.com"]);
  await puppeteerPage.setViewport({ width: 0, height: 0 });

  puppeteerPage.on("requestfailed", async (request) => {
    console.log("requestfailed:::");
    console.log(request);
  });

  puppeteerPage.on("error", (error) => {
    console.log("[error]: ", error.message);
  });

  puppeteerPage.on("response", async (response) => {
    const url = response.url();
    console.log("[response]-url: ", url);
  });

  await puppeteerPage.goto(
    "https://buyin.jinritemai.com/dashboard/institution/activity",
    {
      waitUntil: "domcontentloaded",
      timeout: 0
    }
  );
}

// fetchBuyinLoginByEmail({
//   email: "29006754@qq.com",
//   password: "Wygdy123654.",
//   account: "热度星推"
// })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// function setAccountCookie(email, cookie) {
//   accountCookies[email] = cookie;
//   writeFileSync(
//     path.resolve(__dirname, "./account.json"),
//     JSON.stringify(accountCookies, null, 2)
//   );
// }

start();
