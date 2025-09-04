import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";

import puppeteer from "puppeteer";
import accountCookies from "../caches/buyin.cookies.json" with { type: "json" };

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

const acookie = [
  {
    domain: "buyin.jinritemai.com",
    hostOnly: true,
    httpOnly: false,
    name: "business-account-center-csrf-token",
    path: "/",
    sameSite: null,
    secure: true,
    session: true,
    storeId: null,
    value: "Tst1Rwe4-X5Oonnhlud9QAjytDX6EYv3iSpQ"
  },
  {
    domain: "buyin.jinritemai.com",
    hostOnly: true,
    httpOnly: false,
    name: "csrf_session_id",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: true,
    storeId: null,
    value: "f24e3dcf5ffebf78ee8a8615de510b1a"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1762151248.5776,
    hostOnly: false,
    httpOnly: true,
    name: "uid_tt_ss",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value: "cb0019463071a38a4bcf21533e9a313d"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1788501099.501337,
    hostOnly: false,
    httpOnly: true,
    name: "ttwid",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "1%7C4nN3r0ojaOL_TI3OIXAaCapLU--7dMT4IRWOYqsVEn8%7C1756965100%7Ce4b0149ddcfcdfa0203e073ace08b2b3e2cc7a27d4183ae7bf54820bbdea7e89"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1757930693.869487,
    hostOnly: false,
    httpOnly: false,
    name: "passport_csrf_token",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value: "9abae34f0881f4ae8e0a9aff03cef9ee"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1761360629.746847,
    hostOnly: false,
    httpOnly: true,
    name: "passport_mfa_token",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value:
      "CjE93HuMOLh5TBo0QWwwqZTI1jt1f7ekT6XE4jujuEwvAJoWGHoLxUmwxnorDXlmrTJlGkoKPAAAAAAAAAAAAABPZdZpG9k6amk26qPbn02KgYQX4tAqUdV%2FpQpVpeWzj5vWS3l8AwrUknXiVTAnmCJntBC6u%2FoNGPax0WwgAiIBA5CTaqQ%3D"
  },
  {
    domain: "buyin.jinritemai.com",
    hostOnly: true,
    httpOnly: true,
    name: "business-account-center-csrf-secret",
    path: "/",
    sameSite: null,
    secure: true,
    session: true,
    storeId: null,
    value: "d264c434bbe9c0d8a54c565dc106d112"
  },
  {
    domain: "buyin.jinritemai.com",
    expirationDate: 1757151855,
    hostOnly: true,
    httpOnly: false,
    name: "gfkadpd",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value: "2631,22740"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1759557101.415651,
    hostOnly: false,
    httpOnly: true,
    name: "passport_auth_status_ss",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value: "aa81fbc8ed7f81d23d0484ebf022e3c0%2C52d86e34d07e32c57596499574948c0f"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1762151248.578831,
    hostOnly: false,
    httpOnly: true,
    name: "session_tlb_tag",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "sttt%7C5%7CC31uwzC2UyOHExwKayXwJ__________Wwevy-wx6Eka4oz5wWSDFKH4T6Z-_je5uSKDWb1GMivI%3D"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1762151248.578535,
    hostOnly: false,
    httpOnly: true,
    name: "sessionid_ss",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value: "0b7d6ec330b6532387131c0a6b25f027"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1762151248.579438,
    hostOnly: false,
    httpOnly: true,
    name: "sid_ucp_v1",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value:
      "1.0.0-KGE1NGIyMDY1YTUzOTRhYmQ2NWExYjM0NWI0MTVhZWYyMjdmMDYxMDYKFgjzyoD85syqAhDR4uTFBhiPETgIQCYaAmhsIiAwYjdkNmVjMzMwYjY1MzIzODcxMzFjMGE2YjI1ZjAyNw"
  },
  {
    domain: ".jinritemai.com",
    expirationDate: 1762151248.579737,
    hostOnly: false,
    httpOnly: true,
    name: "ssid_ucp_v1",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "1.0.0-KGE1NGIyMDY1YTUzOTRhYmQ2NWExYjM0NWI0MTVhZWYyMjdmMDYxMDYKFgjzyoD85syqAhDR4uTFBhiPETgIQCYaAmhsIiAwYjdkNmVjMzMwYjY1MzIzODcxMzFjMGE2YjI1ZjAyNw"
  },
  {
    domain: ".buyin.jinritemai.com",
    expirationDate: 1762151248.57642,
    hostOnly: false,
    httpOnly: true,
    name: "ucas_c0_ss_buyin",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "CkEKBTEuMC4wEKqIkZzXqczcaBi9LyD86qDaxqzEBCiPETDzyoD85syqAkDR4uTFBkjRlqHIBlCJvMzC-tXx1WhYfhIUiZnpwusAqHm9qUinXMeVlTNqKg8"
  }
];

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

start();

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

  // await setPageCookies(accountCookies["youao2588@qq.com"]);
  await globalBrowser.setCookie(
    ...acookie.map((item) => {
      return {
        domain: item.domain,
        // hostOnly: true,
        // httpOnly: false,
        name: item.name,
        // path: "/",
        // sameSite: null,
        // secure: true,
        // session: true,
        // storeId: null,
        value: item.value
      };
    })
  );
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

  await puppeteerPage.goto("https://buyin.jinritemai.com/dashboard", {
    waitUntil: "domcontentloaded",
    timeout: 0
  });
}

function setAccountCookie(email, cookie) {
  accountCookies[email] = cookie;
  writeFileSync(
    path.resolve(__dirname, "./account.json"),
    JSON.stringify(accountCookies, null, 2)
  );
}
