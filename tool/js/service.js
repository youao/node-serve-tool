// let rankTab = null;

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   console.log(
//     "Tab with ID" +
//       activeInfo.tabId +
//       "was activated in window" +
//       activeInfo.windowId
//   );
//   // 可以使用 chrome.tabs.get 来获取更多有关新激活标签的信息
//   chrome.tabs.get(activeInfo.tabId, function (tab) {
//     if (
//       tab.url.indexOf(
//         "https://buyin.jinritemai.com/dashboard/merch-picking-hall/rank"
//       ) === 0
//     ) {
//       rankTab = tab;
//     }
//     console.log("Activated tab URL:", tab);
//   });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     // if (rankTab && rankTabtabId)
//   // 当页面加载完成且有URL时，获取URL
//   if (changeInfo.status === "complete" && tab.url) {
//     console.log("Tab updated, new URL:", tab.url);
//     // 这里可以添加自定义逻辑，如发送消息给content script等
//   }
// });
