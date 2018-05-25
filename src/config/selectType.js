export const AppType = [
  {
    "value": 0,
    "name": "系统类"
  },{
    "value": 1,
    "name": "业务类"
  },{
    "value": 2,
    "name": "支撑类"
  },{
    "value": 3,
    "name": "接口类"
  }
];

export const AppName = [
  {
    "value": 0,
    "name": "联合采访"
  },{
    "value": 1,
    "name": "本地采访"
  },{
    "value": 2,
    "name": "本地大数据分析"
  },{
    "value": 3,
    "name": "联合大数据分析"
  },{
    "value": 4,
    "name": "馆际互借"
  },{
    "value": 5,
    "name": "文献传递"
  },{
    "value": 6,
    "name": "流通管理"
  },{
    "value": 7,
    "name": "联合编目"
  },{
    "value": 8,
    "name": "本地编目"
  },{
    "value": 9,
    "name": "资源发现"
  }
];

export const orderStatus = [
  {
    "value": 0,
    "name": "待付款"
  },{
    "value": 1,
    "name": "已支付"
  },{
    "value": 2,
    "name": "支付成功"
  }
];

export const APIType = [
  {
    "value": "0",
    "name": "公共API"
  },{
    "value": "1",
    "name": "联合采访API"
  },{
    "value": "2",
    "name": "本地采访API"
  },{
    "value": "3",
    "name": "大数据分析API"
  },{
    "value": "4",
    "name": "馆际互借API"
  },{
    "value": "5",
    "name": "联机编目API"
  }
];

export const choiceAPI = [
  {
    "value": "0",
    "name": "apilogin"
  },{
    "value": "1",
    "name": "api/ loginCodeForAuthTokenServcie"
  },{
    "value": "2",
    "name": "api/ getAuthTokenServcie"
  },{
    "value": "3",
    "name": "apilogin"
  },{
    "value": "4",
    "name": "api/ loginCodeForAuthTokenServcie"
  },{
    "value": "5",
    "name": "api/ getAuthTokenServcie"
  },{
    "value": "6",
    "name": "apilogin"
  },{
    "value": "7",
    "name": "api/ loginCodeForAuthTokenServcie"
  },{
    "value": "8",
    "name": "api/ getAuthTokenServcie"
  }
];

export const permissionsList = [
  {
    "value": "index",
    "name": "首页"
  },{
    "value": "user-information",
    "name": "个人信息"
  },{
    "value": "change-password",
    "name": "修改密码"
  },{
    "value": "tenant-registration",
    "name": "租客注册"
  },{
    "value": "tenant-audit",
    "name": "租客审核"
  },{
    "value": "tenant-information-maintain",
    "name": "租客信息维护"
  },{
    "value": "tenant-statu-management",
    "name": "租客状态管理"
  },{
    "value": "tenant-admin-management",
    "name": "租客管理员管理"
  },{
    "value": "tenant-code-management",
    "name": "租客代码管理"
  },{
    "value": "tenantAPP-order-management",
    "name": "租客APP订单管理"
  },{
    "value": "tenantAPP-open",
    "name": "租客APP开通"
  },{
    "value": "tenantAPP-statu-management",
    "name": "租客APP状态管理"
  }
];

export const userRole = [
  {
    "value": 1,
    "name": "APP业务管理"
  },{
    "value": 2,
    "name": "租客业务管理"
  },{
    "value": 3,
    "name": "OpenAPI业务管理"
  },{
    "value": 4,
    "name": "新闻公告管理"
  },{
    "value": 5,
    "name": "系统运行监控管理"
  },{
    "value": 6,
    "name": "平台数据管理"
  },{
    "value": 7,
    "name": "平台权限管理"
  },{
    "value": 8,
    "name": "角色权限管理"
  },{
    "value": 9,
    "name": "用户管理"
  },{
    "value": 10,
    "name": "日志管理"
  },{
    "value": 11,
    "name": "系统管理员"
  }
];

export const userStatu = [
  {
    "value": true,
    "name": "正常"
  },{
    "value": false,
    "name": "停用"
  }
];

export const topMenu = [
  {
    "value": 1,
    "name": "首页"
  },{
    "value": 2,
    "name": "租客业务管理"
  },{
    "value": 3,
    "name": "APP业务管理"
  },{
    "value": 4,
    "name": "OpenAPI管理"
  },{
    "value": 5,
    "name": "大数据分析"
  },{
    "value": 6,
    "name": "系统管理"
  }
];

export const pageMenu = {
  1: [
    {
      "value": 1,
      "name": "我的账户",
      "child":[
        {
          "value": 1,
          "name": "个人信息"
        },{
          "value": 2,
          "name": "修改密码"
        }
      ]
    }
  ],
  2: [
    {
      "value": 1,
      "name": "租客管理",
      "child":[
        {
          "value": 1,
          "name": "租客注册"
        },{
          "value": 2,
          "name": "租客审核"
        },{
          "value": 3,
          "name": "租客信息维护"
        },{
          "value": 4,
          "name": "租客状态管理"
        },{
          "value": 5,
          "name": "租客管理员管理"
        },{
          "value": 6,
          "name": "租客代码管理"
        }
      ]
    },{
      "value": 2,
      "name": "租客APP运行管理",
      "child":[
        {
          "value": 1,
          "name": "租客APP订单提交"
        },{
          "value": 2,
          "name": "租客APP订单管理"
        },{
          "value": 3,
          "name": "租客APP开通"
        },{
          "value": 4,
          "name": "租客APP状态管理"
        },{
          "value": 5,
          "name": "租客APP升级管理"
        }
      ]
    },{
      "value": 3,
      "name": "租客API授权管理",
      "child":[
        {
          "value": 1,
          "name": "API申请"
        },{
          "value": 2,
          "name": "API申请处理"
        },{
          "value": 3,
          "name": "API授权维护"
        }
      ]
    }
  ]
}

export const APICategory = [
  {
    "value": "公共API",
    "name": "公共API"
  },{
    "value": "联合采访API",
    "name": "联合采访API"
  },{
    "value": "本地采访API",
    "name": "本地采访API"
  },{
    "value": "大数据分析API",
    "name": "大数据分析API"
  },{
    "value": "馆际互借API",
    "name": "馆际互借API"
  },{
    "value": "联机编目API",
    "name": "联机编目API"
  }
];

export const docStatu = [
  {
    "value": "已发布",
    "name": "已发布"
  },{
    "value": "待发布",
    "name": "待发布"
  }
];
