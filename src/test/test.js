import ABogus from "../libs/abogus.js";

// 示例：生成 ABogus
// async function demo() {
//   const ab = new ABogus();
//   const userAgent =
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
//   const param = {
//     id: "123",
//     name: "test"
//   };
//   const data = {
//     content: "demo"
//   };

//   console.log('demo')
//   try {
//     const aaa = ab.getABogus(userAgent, param, data);
//     console.log("生成的 ABogus：", typeof aaa);
//   } catch (err) {
//     console.log('err')
//   }
//   console.log('demo111')

//   // const aaa = ab.getABogus(userAgent, param, data);
//   // console.log("生成的 ABogus：", aaa);
// }

// 执行示例
// demo();

// ========================= 6. 测试示例 =========================
/**
 * 测试函数：直接运行文件即可执行
 */
async function testABogus() {
  console.log("=== 开始测试 ABogus 生成 ===");
  const ab = new ABogus();

  // 测试参数
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36";
  const param = {
    ewid: "",
    seraph_did: "",
    PIGEON_BIZ_TYPE: "1001",
    verifyFp: "verify_mf4ust37_sJhHGocH_tkTY_4GYt_B7Sg_OpS99v4KujQ7",
    fp: "verify_mf4ust37_sJhHGocH_tkTY_4GYt_B7Sg_OpS99v4KujQ7",
    msToken:
      "qyDdRYPTzFIsVgrj2_6OPd_8rxDXrNyA-q0SXrbDf1rIRH0IHzAoMbvzoppEXL86BbCoEvmRXLJ-6GggdwbCD1eBRX2OA5gzZSy8INYrSheVMHCjJjtp9Juk9I3ioLo-nmruaeI8AOdxoFnMIaRY-oIow5suk3Ig28LzGNpJfHni"
  };

  try {
    // 生成 ABogus
    const startTime = Date.now();
    const abogus = ab.getABogus(userAgent, param);
    const costTime = Date.now() - startTime;

    // 输出结果
    console.log("\n=== 测试结果 ===");
    console.log(`User-Agent：${userAgent}`);
    console.log(`请求参数：${JSON.stringify(param)}`);
    // console.log(`请求数据：${JSON.stringify(data)}`);
    console.log(`生成的 ABogus：${abogus}`);
    console.log(`总耗时：${costTime}ms`);
    console.log(`ABogus 长度：${abogus.length} 字符`);
  } catch (error) {
    console.error("\n=== 测试失败 ===", error);
  }
}

testABogus();
