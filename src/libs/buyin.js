import { urlJoin } from "../utils/index.js";

const jinritemaiCookieDomainMap = {
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

const jinritemaiCookieDefaultDomainList = [
  ".jinritemai.com",
  ".buyin.jinritemai.com"
];

export function getBuyinCookieDatas(cookieRows) {
  const arr = [];
  for (const name in cookieRows) {
    const domains =
      jinritemaiCookieDomainMap[key] || jinritemaiCookieDefaultDomainList;
    for (const domain of domains) {
      const value = cookieRows[name];
      arr.push({ name, value, domain });
    }
  }
  return arr;
}

/**
 * @description 邮箱登录接口
 * @param {String} params.email
 * @param {String} params.password
 * @param {String} params.account
 * */
export function fetchBuyinLoginByEmail(params) {
  const path =
    "https://e.reduxingxuan.com/bj/baize/api/douyin/selenium/autoLoginBuyInByEmail";
  const url = urlJoin(path, params);
  console.log(url);
  return fetch(url).then((res) => res.json());
}
