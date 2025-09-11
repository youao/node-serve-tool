import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function srcPath(url) {
  return path.resolve(__dirname, "../" + url);
}

export function rootPath(url) {
  return path.resolve(__dirname, "../../" + url);
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
  return url + "?" + objectToQueryString(params);
}

export function queryStringParse(str) {
  const obj = {};
  if (!str || typeof str !== "string") return obj;
  str.split("&").forEach((item) => {
    const [k, v] = item.split("=");
    obj[k] = v;
  });
  return obj;
}

export function objectToQueryString(obj) {
  if (typeof obj !== "object") return "";
  const arr = [];
  for (let k in obj) {
    arr.push(`${k}=${obj[k]}`);
  }
  return arr.join("&");
}

export function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
