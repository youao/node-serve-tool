import path from "node:path";
import { fileURLToPath } from "node:url";

export function srcPath(url) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "../" + url);
}

export function urlParse(url) {
  if (!url || typeof url !== "string")
    return {
      path: ""
    };
  if (url.indexOf("?") === -1) {
    if (url.indexOf("=") === -1) {
      return {
        path: url
      };
    }
    return {
      path: "",
      params: queryStringParse(url)
    };
  }
  const [path, queryString] = url.split("?");
  return {
    path,
    params: queryStringParse(queryString)
  };
}

export function urlJoin(url, params) {
  if (typeof url !== "string") {
    url = "";
  }
  if (!params) return url;
  if (url.indexOf("?") > -1) {
    const obj = urlParse(url);
    url = obj.path;
    params = { ...obj.params, ...params };
  }
  return url + "?" + queryStringParse(params);
}

export function queryStringParse(str) {
  const obj = {};
  if (!url || typeof url !== "string") return obj;
  str.split("&").forEach((item) => {
    const [k, v] = item.split("=");
    obj[k] = v;
  });
  return obj;
}

export function objectToQueryString(obj) {
  if (typeof obj !== "object") return "";
  let str = "";
  for (let k in obj) {
    str += `${k}=${obj[k]}`;
  }
  return str;
}
