## 安装

安装`node`模块之后，还要安装`puppeteer`调试专用浏览器

```shell
# npm
npm install
npx puppeteer browsers install


# pnpm
pnpm install
pnpm dlx puppeteer browsers install
```

### Puppeteer 对应浏览器版本

[支持浏览器](https://pptr.nodejs.cn/supported-browsers)

调试版本

| Puppeteer | Chrome         |
| --------- | -------------- |
| 24.17.0   | 139.0.7258.138 |

## 目录

- `caches` 浏览器缓存，目前主要是保存用户登录状态用
- `dist` 构建文件保存
- `src` 主要代码
