/**
 * ABogus.js - 修复后完整实现（支持生成 ABogus 参数）
 * 适用环境：Node.js 14+ 或现代浏览器（ES6+）
 */

// ========================= 1. 核心常量 =========================
const BitStr = {
  s0: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  s1: "Dkdpgh4ZKsQB80/Mfvw36XI1R25+WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe=",
  s2: "Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe=",
  s3: "ckdp1h4ZKsUB80/Mfvw36XIgR25+WQAlEi7NLboqYTOPuzmFjJnryx9HVGDaStCe",
  s4: "Dkdpgh2ZmsQB80/MfvV36XI1R45-WUAlEixNLwoqYTOPuzKFjJnry79HbGcaStCe",
  s5: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-."
};

// ========================= 2. 工具函数 =========================
/**
 * 模拟 JS 左位移（兼容 32 位有符号整数）
 * @param {number} x - 输入值
 * @param {number} y - 位移位数
 * @returns {number} 位移结果
 */
function jsShiftLeft(x, y) {
  return (x << y) | 0;
}

/**
 * 模拟 JS 无符号右位移（兼容 32 位）
 * @param {number} x - 输入值
 * @param {number} y - 位移位数
 * @returns {number} 位移结果
 */
function jsShiftRight(x, y) {
  const uint32 = x >>> 0;
  const shiftBits = y % 32;
  return uint32 >>> shiftBits;
}

/**
 * 生成随机字符串
 * @param {number} num - 长度
 * @param {string} type - 类型（int/str_lower/str_upper/str_all/int_str_lower/int_str_upper/int_str_all/hex）
 * @returns {string} 随机字符串
 */
function randomStr(num, type) {
  const digits = "0123456789";
  const asciiLower = "abcdefghijklmnopqrstuvwxyz";
  const asciiUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const hexChars = digits + "abcdef";
  let pool = "";

  switch (type) {
    case "int": pool = digits; break;
    case "str_lower": pool = asciiLower; break;
    case "str_upper": pool = asciiUpper; break;
    case "str_all": pool = asciiLower + asciiUpper; break;
    case "int_str_lower": pool = digits + asciiLower; break;
    case "int_str_upper": pool = digits + asciiUpper; break;
    case "int_str_all": pool = digits + asciiLower + asciiUpper; break;
    case "hex": pool = hexChars; break;
    default: throw new Error(`不支持的随机字符串类型：${type}`);
  }

  const repeatPool = pool.repeat(Math.ceil(num / pool.length));
  return Array.from({ length: num }, () => {
    const randomIdx = Math.floor(Math.random() * repeatPool.length);
    return repeatPool[randomIdx];
  }).join("");
}

/**
 * 循环左移 + 取模
 * @param {number} e - 输入值
 * @param {number} r - 位移位数
 * @returns {number} 处理结果
 */
function le(e, r) {
  const shiftLeft = jsShiftLeft(e, r % 32);
  const shiftRight = jsShiftRight(e, 32 - (r % 32));
  return (shiftLeft | shiftRight) & 0xFFFFFFFF;
}

/**
 * 返回固定常量（Tj）
 * @param {number} e - 索引
 * @returns {number} 常量值
 */
function de(e) {
  if (e >= 0 && e < 16) return 2043430169;
  if (e >= 16 && e < 64) return 2055708042;
  throw new Error(`无效的 Tj 索引：${e}（需 0-63）`);
}

/**
 * FF 布尔函数
 * @param {number} e - 索引
 * @param {number} r - 参数1
 * @param {number} t - 参数2
 * @param {number} a - 参数3
 * @returns {number} 计算结果
 */
function pe(e, r, t, a) {
  let result;
  if (e >= 0 && e < 16) result = r ^ t ^ a;
  else if (e >= 16 && e < 64) result = (r & t) | (r & a) | (t & a);
  else throw new Error(`无效的 FF 索引：${e}（需 0-63）`);
  return result & 0xFFFFFFFF;
}

/**
 * GG 布尔函数
 * @param {number} e - 索引
 * @param {number} r - 参数1
 * @param {number} t - 参数2
 * @param {number} a - 参数3
 * @returns {number} 计算结果
 */
function he(e, r, t, a) {
  let result;
  if (e >= 0 && e < 16) result = r ^ t ^ a;
  else if (e >= 16 && e < 64) result = (r & t) | (~r & a);
  else throw new Error(`无效的 GG 索引：${e}（需 0-63）`);
  return result & 0xFFFFFFFF;
}

/**
 * BitStr 编码（修复 undefined 问题）
 * @param {string} a1 - 第1字符（必传）
 * @param {string} a2 - 第2字符（"null" 表示缺失）
 * @param {string} a3 - 第3字符（"null" 表示缺失）
 * @param {string} s - BitStr 键（如 s3/s4）
 * @returns {string} 编码结果
 */
function bitwise(a1, a2, a3, s) {
  // 验证 BitStr 有效性
  if (!BitStr.hasOwnProperty(s)) throw new Error(`BitStr 无此键：${s}`);
  const bitStr = BitStr[s];
  if (bitStr.length !== 64) throw new Error(`BitStr.${s} 长度需为 64，当前：${bitStr.length}`);

  // 处理缺失字符（补 0）
  const getCharCode = (char) => {
    if (char === "null" || typeof char !== "string" || char.length === 0) return 0;
    return char.charCodeAt(0) & 0xFF;
  };

  const c1 = getCharCode(a1);
  const c2 = getCharCode(a2);
  const c3 = getCharCode(a3);

  // 计算 24 位整数 + 提取 6 位片段（0-63 范围）
  const x4 = (c1 << 16) | (c2 << 8) | c3;
  const part1 = (x4 >> 18) & 0x3F;
  const part2 = (x4 >> 12) & 0x3F;
  const part3 = (x4 >> 6) & 0x3F;
  const part4 = x4 & 0x3F;

  // 填充规则（模拟 Base64）
  let result = bitStr[part1] + bitStr[part2];
  if (a3 === "null") result += "==";
  else if (a2 === "null") result += bitStr[part3] + "=";
  else result += bitStr[part3] + bitStr[part4];

  return result;
}

/**
 * 时间戳加密函数（系列）
 */
function encryptTs(ts) {
  const n1 = ts & 0xFF;
  const n2 = jsShiftRight(ts, 8) & 0xFF;
  return [(n1 & 0xAA) + 1, (n1 & 0x55) + 2, (n2 & 0xAA) + 64, (n2 & 0x55) + 2];
}

function encryptTs1(ts) {
  const tsMulti = ts * 10000;
  const n1 = Math.floor(tsMulti) & 0xFF;
  const n2 = jsShiftRight(Math.floor(tsMulti), 8) & 0xFF;
  return [
    (n1 & 0xAA) | (3 & 0x55),
    (n1 & 0x55) | (3 & 0xAA),
    (n2 & 0xAA) | (45 & 0x55),
    (n2 & 0x55) | (45 & 0xAA)
  ];
}

function encryptTs2(ts) {
  const tsMulti = ts * 10000;
  const n1 = Math.floor(tsMulti) & 0xFF;
  const n2 = jsShiftRight(Math.floor(tsMulti), 8) & 0xFF;
  return [
    (n1 & 0xAA) | (1 & 0x55),
    (n1 & 0x55) | (1 & 0xAA),
    (n2 & 0xAA) | (0 & 0x55),
    (n2 & 0x55) | (0 & 0xAA)
  ];
}

function encryptTs3(ts) {
  const tsMulti = ts * 10000;
  const n1 = Math.floor(tsMulti) & 0xFF;
  const n2 = jsShiftRight(Math.floor(tsMulti), 8) & 0xFF;
  return [
    (n1 & 0xAA) | (1 & 0x55),
    (n1 & 0x55) | (1 & 0xAA),
    (n2 & 0xAA) | (1 & 0x55),
    (n2 & 0x55) | (1 & 0xAA)
  ];
}

/**
 * RC4 加密（输出字符串）
 * @param {string} key - 密钥
 * @param {string} plaintext - 明文
 * @returns {string} 密文
 */
function rc4Encrypt(key, plaintext) {
  // KSA 初始化 S 盒
  const S = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  const keyLen = key.length;
  for (let i = 0; i < 256; i++) {
    const keyCode = key.charCodeAt(i % keyLen);
    j = (j + S[i] + keyCode) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }

  // PRGA 生成密文
  let i = 0;
  j = 0;
  let ciphertext = "";
  for (const char of plaintext) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    const t = (S[i] + S[j]) % 256;
    const plainCode = char.charCodeAt(0);
    ciphertext += String.fromCharCode(plainCode ^ S[t]);
  }

  return ciphertext;
}

// ========================= 3. Reg 哈希类（修复卡顿） =========================
class Reg {
  constructor() {
    this.chunk = []; // 数据块（64 字节为单位）
    this.reg = [
      1937774191, 1226093241, 388252375, 3666478592,
      2842636476, 372324522, 3817729613, 2969243214
    ]; // 初始寄存器
    this.size = 0; // 数据总长度（字节）
  }

  /**
   * 写入数据（修复分块逻辑）
   * @param {string|number[]} e - 输入数据
   */
  write(e) {
    let f;
    if (typeof e === "string") {
      f = e.split("").map(char => char.charCodeAt(0));
    } else if (Array.isArray(e) && e.every(item => typeof item === "number")) {
      f = e;
    } else {
      throw new Error("输入必须是字符串或数字数组");
    }

    this.size += f.length;
    let remaining = [...f];

    // 循环处理剩余数据，避免无限循环
    while (remaining.length > 0) {
      const freeSpace = 64 - this.chunk.length;
      if (remaining.length <= freeSpace) {
        this.chunk.push(...remaining);
        remaining = [];
      } else {
        const fillData = remaining.slice(0, freeSpace);
        this.chunk.push(...fillData);
        this._compress(this.chunk); // 填满立即压缩
        remaining = remaining.slice(freeSpace);
        this.chunk = []; // 清空块
      }
    }
  }

  /**
   * 压缩 64 字节数据（优化效率）
   * @param {number[]} r - 64 字节数据块
   */
  _compress(r) {
    if (r.length !== 64) {
      throw new Error(`压缩失败：需 64 字节，当前 ${r.length} 字节`);
    }

    // 用 TypedArray 提升效率
    const w = new Uint32Array(132);
    // 初始化 w[0..15]
    for (let t = 0; t < 16; t++) {
      const offset = t * 4;
      w[t] = (r[offset] << 24) | (r[offset + 1] << 16) | (r[offset + 2] << 8) | r[offset + 3];
      w[t] >>>= 0;
    }

    // 计算 w[16..67]
    for (let a = 16; a < 68; a++) {
      const w16 = w[a - 16];
      const w9 = w[a - 9];
      const w3 = le(w[a - 3], 15);
      const n = (w16 ^ w9 ^ w3) ^ le(w16 ^ w9 ^ w3, 15) ^ le(w16 ^ w9 ^ w3, 23);
      w[a] = (n ^ le(w[a - 13], 7) ^ w[a - 6]) & 0xFFFFFFFF;
    }

    // 计算 w[68..131]
    for (let a = 0; a < 64; a++) {
      w[a + 68] = (w[a] ^ w[a + 4]) & 0xFFFFFFFF;
    }

    // 缓存寄存器，减少数组访问
    let n0 = this.reg[0], n1 = this.reg[1], n2 = this.reg[2], n3 = this.reg[3];
    let n4 = this.reg[4], n5 = this.reg[5], n6 = this.reg[6], n7 = this.reg[7];

    // 迭代更新寄存器
    for (let f = 0; f < 64; f++) {
      const leN0_12 = le(n0, 12);
      const deF = de(f);
      let i = leN0_12 + n4 + le(deF, f);
      i &= 0xFFFFFFFF;
      i = le(i >>> 0, 7);
      const o = (i ^ leN0_12) >>> 0;

      const c = (pe(f, n0, n1, n2) + n3 + o + w[f + 68]) >>> 0;
      const s = (he(f, n4, n5, n6) + n7 + i + w[f]) >>> 0;

      // 更新寄存器
      [n3, n2, n1, n0] = [n2, le(n1, 9), n0, c];
      [n7, n6, n5, n4] = [n6, le(n5, 19), n4, (s ^ le(s, 9) ^ le(s, 17)) >>> 0];
    }

    // 合并结果
    this.reg = [
      (n0 ^ this.reg[0]) >>> 0,
      (n1 ^ this.reg[1]) >>> 0,
      (n2 ^ this.reg[2]) >>> 0,
      (n3 ^ this.reg[3]) >>> 0,
      (n4 ^ this.reg[4]) >>> 0,
      (n5 ^ this.reg[5]) >>> 0,
      (n6 ^ this.reg[6]) >>> 0,
      (n7 ^ this.reg[7]) >>> 0
    ];
  }

  /**
   * 数据填充（确保长度为 64 整数倍）
   */
  _fill() {
    const totalBits = this.size * 8;
    this.chunk.push(128); // 追加 0x80

    // 计算填充 0 的数量
    const currentLen = this.chunk.length;
    const padZeroCount = (56 - currentLen % 64 + 64) % 64;
    if (padZeroCount > 0) {
      this.chunk.push(...new Array(padZeroCount).fill(0));
    }

    // 追加 64 位长度（高 32 位 + 低 32 位）
    const high32 = Math.floor(totalBits / 0x100000000);
    const low32 = totalBits & 0xFFFFFFFF;
    this.chunk.push(
      (high32 >>> 24) & 0xFF,
      (high32 >>> 16) & 0xFF,
      (high32 >>> 8) & 0xFF,
      high32 & 0xFF,
      (low32 >>> 24) & 0xFF,
      (low32 >>> 16) & 0xFF,
      (low32 >>> 8) & 0xFF,
      low32 & 0xFF
    );

    // 验证填充结果
    if (this.chunk.length % 64 !== 0) {
      throw new Error(`填充异常：长度 ${this.chunk.length} 字节（需为 64 整数倍）`);
    }
  }
}

// ========================= 4. 哈希数组生成（修复卡顿） =========================
/**
 * 生成哈希数组或十六进制字符串
 * @param {string|number[]} t - 输入数据
 * @param {string|null} a - 输出类型（hex 或 null）
 * @returns {number[]|string} 结果
 */
function strToArrayAb(t, a = null) {
  const reg = new Reg();
  try {
    reg.write(t);
    reg._fill();

    // 仅处理 64 字节完整块
    for (let i = 0; i < reg.chunk.length; i += 64) {
      const chunk = reg.chunk.slice(i, i + 64);
      if (chunk.length === 64) {
        reg._compress(chunk);
      } else {
        console.warn(`跳过无效块：长度 ${chunk.length} 字节`);
      }
    }
  } catch (error) {
    console.error("strToArrayAb 错误：", error);
    throw error;
  }

  if (a === "hex") {
    return reg.reg.map(val => val.toString(16).padStart(8, "0")).join("");
  } else {
    const o = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
      let c = reg.reg[i];
      o[4 * i + 3] = c & 0xFF;
      c >>>= 8;
      o[4 * i + 2] = c & 0xFF;
      c >>>= 8;
      o[4 * i + 1] = c & 0xFF;
      c >>>= 8;
      o[4 * i] = c & 0xFF;
    }
    return Array.from(o);
  }
}

// ========================= 5. ABogus 主类 =========================
class ABogus {
  constructor() {
    // 时间戳
    this.ts1 = null;
    this.ts2 = null;
    // 固定值
    this.ts3 = 397.22701604035683;
    // 随机值
    this.ts4 = null;
    this.ts5 = null;
    this.ts6 = null;
    // 应用配置
    this.pageId = 0;
    this.aid = 1128;
    // 盐值
    this.pdSalt = "cus";
    this.userAgentSalt = [0.00390625, 1, 0];
    // RC4 密钥
    this.rc4KeyUa = "\u0000\u0001\u0000";
    this.rc4KeyAb = "\x79";
  }

  /**
   * 生成 ABogus 值
   * @param {string} userAgent - User-Agent
   * @param {object|string} param - 请求参数（对象或 URL 编码字符串）
   * @param {object|string|null} data - 请求体数据（可选）
   * @returns {string} ABogus 结果
   */
  getABogus(userAgent, param, data = null) {
    try {
      // 1. 生成时间戳（首次调用）
      if (this.ts1 === null) {
        const now = Date.now();
        this.ts2 = now - 300;
        this.ts1 = now - 100;
        console.log(`生成时间戳：ts1=${this.ts1}, ts2=${this.ts2}`);
      }

      // 2. 处理请求参数
      let paramStr = typeof param === "object" 
        ? new URLSearchParams(param).toString() 
        : param;
      paramStr += this.pdSalt;
      const paramArray = strToArrayAb(strToArrayAb(paramStr));
      console.log(`参数哈希数组长度：${paramArray.length}`);

      // 3. 处理请求体
      let dataStr = data === null ? "" : (
        typeof data === "object" 
          ? JSON.stringify(data, null, 0).replace(/\s+/g, "") 
          : data
      );
      dataStr += this.pdSalt;
      const dataArray = strToArrayAb(strToArrayAb(dataStr));
      console.log(`数据哈希数组长度：${dataArray.length}`);

      // 4. 处理 User-Agent（截断超长 + 编码）
      if (userAgent.length > 500) {
        userAgent = userAgent.slice(0, 500);
        console.warn("User-Agent 过长，已截断至 500 字符");
      }
      const uaRc4 = rc4Encrypt(this.rc4KeyUa, userAgent);
      let uaStr = "";
      for (let i = 0; i < uaRc4.length; i += 3) {
        const a1 = uaRc4[i];
        const a2 = i + 1 < uaRc4.length ? uaRc4[i + 1] : "null";
        const a3 = i + 2 < uaRc4.length ? uaRc4[i + 2] : "null";
        uaStr += bitwise(a1, a2, a3, "s3");
      }
      console.log(`UA 编码后长度：${uaStr.length} 字符`);

      // 5. 生成 UA 哈希数组（关键步骤，修复卡顿）
      const startTime = Date.now();
      const uaArray = strToArrayAb(uaStr);
      console.log(`UA 哈希数组生成耗时：${Date.now() - startTime}ms，长度：${uaArray.length}`);

      // 6. 构建新数组
      const newArray = [44];
      newArray.push(
        jsShiftRight(this.ts1, 24) & 0xFF, 0, 0, 0, 0, 4,
        paramArray[21] || 0, dataArray[21] || 0, 0, uaArray[23] || 0,
        jsShiftRight(this.ts1, 16) & 0xFF, 0,
        jsShiftRight(this.pageId, 8) & 0xFF, this.pageId & 0xFF, 1, 0,
        this.aid & 0xFF, paramArray[22] || 0, dataArray[22] || 0, uaArray[24] || 0,
        jsShiftRight(this.ts1, 8) & 0xFF, 0, 0, 0, 0,
        this.ts1 & 0xFF, 0, 0,
        this.userAgentSalt[this.userAgentSalt.length - 1] & 0xFF,
        jsShiftRight(this.ts2, 24) & 0xFF,
        jsShiftRight(this.ts2, 16) & 0xFF, 0,
        jsShiftRight(this.ts2, 8) & 0xFF, this.ts2 & 0xFF,
        3,
        Math.floor(this.ts3), jsShiftRight(Math.floor(this.ts3), 8),
        Math.floor(this.ts3), jsShiftRight(Math.floor(this.ts3), 8),
        67, 0, 0, 0
      );

      // 7. 计算数组异或值
      const arrayLast = newArray.reduce((acc, curr) => acc ^ (curr & 0xFF), 0);

      // 8. 追加固定值
      const fixedBytes = [
        50, 50, 52, 48, 124, 49, 53, 48, 124, 50, 50, 52, 48, 124, 49, 51, 54, 48,
        124, 48, 124, 48, 124, 48, 124, 48, 124, 50, 50, 52, 48, 124, 49, 51, 54,
        48, 124, 50, 50, 52, 48, 124, 49, 52, 48, 48, 124, 50, 50, 52, 48, 124,
        49, 53, 48, 124, 50, 52, 124, 50, 52, 124, 87, 105, 110, 51, 50
      ];
      newArray.push(...fixedBytes, arrayLast);

      // 9. 生成随机值（首次调用）
      if (this.ts4 === null) {
        this.ts4 = parseFloat(`0.${randomStr(16, "int")}`);
        this.ts5 = parseFloat(`0.${randomStr(16, "int")}`);
        this.ts6 = parseFloat(`0.${randomStr(16, "int")}`);
        console.log(`生成随机值：ts4=${this.ts4}, ts5=${this.ts5}, ts6=${this.ts6}`);
      }

      // 10. 加密随机值
      const part1 = encryptTs1(this.ts4).map(c => String.fromCharCode(c)).join("");
      const part2 = encryptTs2(this.ts5).map(c => String.fromCharCode(c)).join("");
      const part3 = encryptTs3(this.ts6).map(c => String.fromCharCode(c)).join("");

      // 11. RC4 加密新数组
      const part4 = newArray.map(c => String.fromCharCode(c & 0xFF)).join("");
      const part4Enc = rc4Encrypt(this.rc4KeyAb, part4);

      // 12. 拼接并编码最终结果
      const abBytes = part1 + part2 + part3 + part4Enc;
      let abogus = "";
      for (let i = 0; i < abBytes.length; i += 3) {
        const a1 = abBytes[i];
        const a2 = i + 1 < abBytes.length ? abBytes[i + 1] : "null";
        const a3 = i + 2 < abBytes.length ? abBytes[i + 2] : "null";
        abogus += bitwise(a1, a2, a3, "s4");
      }

      console.log(`ABogus 生成完成：${abogus}`);
      return abogus;
    } catch (error) {
      console.error("生成 ABogus 错误：", error);
      throw error;
    }
  }
}


export default ABogus