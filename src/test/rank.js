fetch(
  "https://buyin.jinritemai.com/pc/leaderboard/center/pmt?rank_type=pay_author_cnt&industry_id=5&prod_mesh=all&date_type=1d&genre_type=all&alli_cate_id=all&category=5&is_flagship=0&ewid=1995b1ef0f028739015a27954860ed6f&verifyFp=verify_meqi1w2x_JcXSNME0_qK8X_4Se8_BGlL_KTVsQv5XFB9H&fp=verify_meqi1w2x_JcXSNME0_qK8X_4Se8_BGlL_KTVsQv5XFB9H&msToken=K3mkT_7OOWDva_jdRozLpCXQCf6YaGTQZZbSr2p7HY_k-ZybRy2y84tPPMwT__27cWk0M-ke22lbtBWZ4IdKCbSXpLdOVDpT7f7W1hWokWCr0Hnv5HEuRf-H47XLnegGCiG8awbxQxuhKFUkLU6msXKYAczjgsK8iG2iZ21sZ2VVpg%3D%3D&a_bogus=Oy4fgtUJEoWfepeSmOsn7RcU50oANsWyvFiQReATCqOYcXeGOnpGgObBboFy3xtXXuBHwepH-nFMGEVcs2ssZoCkzmpkSFv61TVcI08ogqwXGzTBEqbgCwTFKwMNUQsia%2F5ti1WV8UaH6ndAkqQL%2Fp5r7%2FKF5cWBPpxbk%2FYcN9BhZMgAgZn-PQbpO7raU-cj",
  {
    method: "GET",
    // credentials: "include",
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9",
      "Cookie":
        "passport_csrf_token=9abae34f0881f4ae8e0a9aff03cef9ee; passport_csrf_token_default=9abae34f0881f4ae8e0a9aff03cef9ee; s_v_web_id=verify_meqi1w2x_JcXSNME0_qK8X_4Se8_BGlL_KTVsQv5XFB9H; is_staff_user=false; manage_relation_type=1; d_ticket=18c6d4d483cee9bff37862c83882b29b2dbbd; passport_mfa_token=CjE93HuMOLh5TBo0QWwwqZTI1jt1f7ekT6XE4jujuEwvAJoWGHoLxUmwxnorDXlmrTJlGkoKPAAAAAAAAAAAAABPZdZpG9k6amk26qPbn02KgYQX4tAqUdV%2FpQpVpeWzj5vWS3l8AwrUknXiVTAnmCJntBC6u%2FoNGPax0WwgAiIBA5CTaqQ%3D; _tea_utm_cache_3813=undefined; csrf_session_id=f24e3dcf5ffebf78ee8a8615de510b1a; business-account-center-csrf-secret=d264c434bbe9c0d8a54c565dc106d112; business-account-center-csrf-token=Tst1Rwe4-X5Oonnhlud9QAjytDX6EYv3iSpQ; x-web-secsdk-uid=79da3306-b439-44b6-a151-35605399677f; gfkadpd=2631,22740; ttwid=1%7C4nN3r0ojaOL_TI3OIXAaCapLU--7dMT4IRWOYqsVEn8%7C1757295887%7C88c428fa417d22bb4aecc76f1967a610166272d451c269968138ee4d0fd3896b; passport_auth_status=6cd41a856f7068e404d4ce3d04c889ae%2Cef1afbfa9085744b74321bfbde244a35; passport_auth_status_ss=6cd41a856f7068e404d4ce3d04c889ae%2Cef1afbfa9085744b74321bfbde244a35; uid_tt=bd456f3c1d9c1e25fa0bba22c952cae2; uid_tt_ss=bd456f3c1d9c1e25fa0bba22c952cae2; sid_tt=3b65e2fa49d857bbeea34679673fb40a; sessionid=3b65e2fa49d857bbeea34679673fb40a; sessionid_ss=3b65e2fa49d857bbeea34679673fb40a; odin_tt=a53770b57d28b3059ab43f2fcd21c223222a8ef7643da79ebbc0f77baa8af294f46cb253edc03580018707a52be89bf8012add56f8daebeac4eda3132c082071; ucas_c0_buyin=CkEKBTEuMC4wEKeIh8KDoo3faBi9LyD86qDaxqzEBCiPETDzyoD85syqAkCS6vjFBkiSnrXIBlCJvMzC-tXx1WhYfhIU1epB80sZ5EZe1SpYWleChlCDraA; ucas_c0_ss_buyin=CkEKBTEuMC4wEKeIh8KDoo3faBi9LyD86qDaxqzEBCiPETDzyoD85syqAkCS6vjFBkiSnrXIBlCJvMzC-tXx1WhYfhIU1epB80sZ5EZe1SpYWleChlCDraA; SASID=SID2_7547527460092608831; BUYIN_SASID=SID2_7547527460092608831; buyin_shop_type=24; buyin_account_child_type=1128; buyin_app_id=1128; buyin_shop_type_v2=24; buyin_account_child_type_v2=1128; buyin_app_id_v2=1128; scmVer=1.0.1.9313; sid_guard=3b65e2fa49d857bbeea34679673fb40a%7C1757296681%7C5184000%7CFri%2C+07-Nov-2025+01%3A58%3A01+GMT; session_tlb_tag=sttt%7C3%7CO2Xi-knYV7vuo0Z5Zz-0Cv________-pvPRzBGFsWiTDtBZ8smPG6Hu9xgz_0o2aXvw-Ck2W7Ao%3D; sid_ucp_v1=1.0.0-KDc1YzkwMDlmODBiOTg5OGIxZmI5YjI3NTRjZjI2YTc3NjM3YWRhZjUKGAjzyoD85syqAhCp8PjFBhiPESAMOAhAJhoCbHEiIDNiNjVlMmZhNDlkODU3YmJlZWEzNDY3OTY3M2ZiNDBh; ssid_ucp_v1=1.0.0-KDc1YzkwMDlmODBiOTg5OGIxZmI5YjI3NTRjZjI2YTc3NjM3YWRhZjUKGAjzyoD85syqAhCp8PjFBhiPESAMOAhAJhoCbHEiIDNiNjVlMmZhNDlkODU3YmJlZWEzNDY3OTY3M2ZiNDBh; COMPASS_LUOPAN_DT=session_7547530311694106880",
      "referer":
        "https://buyin.jinritemai.com/dashboard/merch-picking-hall/rank?btm_ppre=a0.b0.c0.d0&btm_pre=a0.b0.c0.d0&pre_universal_page_params_id=&universal_page_params_id=24a9ef89-7de5-4691-8ab0-37497939b786",
      "sec-ch-ua":
        '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
    }
  }
)
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
