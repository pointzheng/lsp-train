export const menuConfig = [{
    "account": [{
        menuName: "我的账户",
        menuList: [{
            name: "个人信息",
            url: "./pages/user-information.html"
        }, {
            name: "修改密码",
            url: "./pages/change-password.html"
        }]
    }]
}, {
    "openAPI-management": [{
        menuName: "API注册管理",
        menuList: [{
            name: "API注册",
            url: "./pages/API-registration.html"
        }, {
            name: "API变更",
            url: "./pages/API-change.html"
        }, {
            name: "API启停",
            url: "./pages/API-start-stop.html"
        }]
    }, {
        menuName: "API文档管理",
        menuList: [{
            name: "文档发布",
            url: "./pages/API-doc-publish.html"
        }, {
            name: "文档维护",
            url: "./pages/API-doc-maintain.html"
        }]
    }]
}, {
    "big-data-analysis": [{
        menuName: "数据采集管理",
        menuList: [{
            name: "上传文件管理",
            url: "./pages/upload-file.html"
        }, {
            name: "租客映射模板管理",
            url: "./pages/tenant-template.html"
        }]
    }]
}]

export const menuTitleConfig = ["", "OpenAPI管理", "大数据分析"]
