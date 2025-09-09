let currentTab = null;
const rankUrl =
  "https://buyin.jinritemai.com/dashboard/merch-picking-hall/rank";

onLoad();

async function onLoad() {
  currentTab = await getCurrentTab();
  if (!currentTab) return;
  if (currentTab.url.indexOf(rankUrl) === 0) {
    $("#not-rank").style.display = "none";
    $("#has-rank").style.display = "block";

    setTimeout(() => {
      $("#btn-pull-rank").onclick = () => {
        chrome.runtime.sendMessage("tap-pull-rank");
      };
    }, 1000);
  } else {
    $("#not-rank").style.display = "block";
    $("#has-rank").style.display = "none";
  }
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });
  return tab;
}

function $(selector) {
  return document.querySelector(selector);
}
