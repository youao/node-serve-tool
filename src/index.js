import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { urlParse, rootPath, sleep } from "./utils/index.js";
import { puppeteerLaunch } from "./utils/browser.js";

const email = "29006754@qq.com";
const pwd = "Wygdy123654.";
const account = "热度星推";

let browser = null;
let page = null;
let isLogin = false;

const activityPath =
  "https://buyin.jinritemai.com/dashboard/institution/activity";
const loginPath =
  "https://buyin.jinritemai.com/mpa/account/institution-role-select";

run();

async function run() {
  const cachedirName = "caches";
  const cachedirPath = rootPath(cachedirName);
  if (!existsSync(cachedirPath)) {
    mkdirSync(cachedirPath);
  }

  const userDataDir = rootPath(cachedirName + "/buyin_" + email);
  const pup = await puppeteerLaunch(userDataDir);
  browser = pup.browser;
  page = pup.page;
  setPageListener();

  if (!existsSync(userDataDir)) return toLogin();

  try {
    await page.goto(activityPath);
  } catch (error) {
    console.error("[goto-activity-error]:", error);
  }
}

const activityList = {
  page: 1,
  page_size: 20,
  list: [],
  finished: false
};
async function setActivityList(response) {
  isLogin = true;
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
    await sleep(300);
    if (!activityList.finished) {
      // 下一页
      tapPageItem(++activityList.page);
    }
  }
}

function setPageListener() {
  page.on("requestfailed", async (request) => {
    console.log("[requestfailed]:", request.method(), request.url());
  });

  page.on("error", (error) => {
    console.log("[error]:", error.message);
  });

  page.on("response", async (response) => {
    const { path } = urlParse(response.url());
    console.log(path);
    switch (path) {
      case "https://buyin.jinritemai.com/ecom/captain/institution/activity/list":
        setActivityList(response);
        break;
      case "https://buyin.jinritemai.com/ecomauth/loginv1/get_login_subject":
        onEmailLogin(response);
        break;
      case "https://buyin-institution-sso.jinritemai.com/aff/subject/login/":
        onSelectAccountLogin(response);
        break;
      case "https://buyin.jinritemai.com/dashboard/institution/activity":
        await sleep(3000);
        !isLogin && toLogin();
        break;
    }
  });
}

async function tapPageItem(pageIndex) {
  console.log("正在翻页：" + pageIndex);
  await sleep(3000);
  await page.waitForSelector(".auxo-pagination");
  const btn = await page.$(
    ".auxo-pagination-item.auxo-pagination-item-" + pageIndex
  );
  if (!btn) return onActivityFinished();
  btn.click();
}

function onActivityFinished() {
  if (activityList.finished) return;
  activityList.finished = true;
  browser.close();
  if (activityList.list.length) {
    const distdirName = "dist";
    const distdirPath = rootPath(distdirName);
    if (!existsSync(distdirPath)) {
      mkdirSync(distdirPath);
    }
    const filePath = "activity-list-" + new Date().getTime() + ".json";
    console.log("拉取完成，开始写入：" + distdirName + "/" + filePath);
    writeFileSync(
      distdirPath + "/" + filePath,
      JSON.stringify(activityList.list, null, 2)
    );
    console.log("写入完成");
  } else {
    console.log("未拉取到数据");
  }
}

async function toLogin() {
  console.log("未登录，正在前往登录...");
  // 登录招商团长
  try {
    if (page.url().indexOf(loginPath) != 0) {
      await page.goto(loginPath);
    }
    await page.waitForSelector(".auxo-spin-container");
    await page.locator("div ::-p-text(招商团长)").click();

    await sleep(1000);
    const tabEmail = await page.waitForSelector(
      ".account-center-switch-button.email"
    );
    tabEmail.click();
    await sleep(1000);
    await page.type("input.ace-input[name='email']", email, { delay: 100 });
    await sleep(300);
    await page.type("input.ace-input[name='password']", pwd, { delay: 100 });
    await sleep(1000);
    await page.locator("label.auxo-checkbox-wrapper").click();

    await sleep(1000);
    await page.locator("button ::-p-text(登录)").click();
  } catch (error) {
    console.error("[goto-login-error]:", error);
  }
}

async function onEmailLogin(response) {
  try {
    await response.json();
    await sleep(2000);
    await page.locator("div ::-p-text(" + account + ")").click();
  } catch (err) {
    console.log("onEmailLogin Error: " + err);
  }
}

async function onSelectAccountLogin(response) {
  try {
    const res = await response.json();
    if (res.code !== 0) return;
    console.log("登录成功");
    await sleep(3000);
    if (page.url().indexOf(activityPath) === 0) return;
    await page.goto(activityPath);
  } catch (err) {
    console.log("onSelectAccountLogin Error: " + err);
  }
}
