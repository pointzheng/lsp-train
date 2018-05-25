/**
 * 系统配置，包括：
 * (1) 服务器配置：预置1个测试服务器，一个正式服务器。
 * 其中，测试服务器，用于开发阶段的调试。正式服务器，用于实际部署。
 * (2) 是否允许登录
 * @author zhengyy
 */


// 测试服务器配置
const confDev = {
  SERVICE_BASE: "http://222.29.81.251:9130",
  tenant: "l001736",
  userId: sessionStorage.getItem("userId"),
  currentAdmin: sessionStorage.getItem("username"),
  token: sessionStorage.getItem("token")
};

// 正式服务器配置
const confProd = {
  SERVICE_BASE: "http://222.29.81.251:9130", // 服务器配置，待定
  tenant: "l001736",
  userId: sessionStorage.getItem("userId"),
  currentAdmin: sessionStorage.getItem("username"),
  token: sessionStorage.getItem("token")
};

const method2Code = {
  GET: 200,
  POST: 201,
  PUT: 204,
  DELETE: 204
};

const mode = "prod"; // 取值：dev和prod/specificationLib

const anonyLogin = false; // 是否允许匿名登录（即：登录界面中，不验证用户名密码）

export {confDev, confProd, method2Code, mode, anonyLogin};
