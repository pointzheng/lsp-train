window.$ = window.jQuery = require('jquery');
require('bootstrap/dist/css/bootstrap.css');
require('./styles/bootstrap-cov.css');
require('bootstrap');
require('font-awesome/css/font-awesome.css');
require('admin-lte/dist/css/AdminLTE.css');
require('admin-lte/dist/css/skins/_all-skins.css');
require('./styles/adminlte-cov.css');
require('./styles/_all-skins-cov.css');
require('admin-lte/plugins/slimScroll/jquery.slimscroll.min');
require('admin-lte');
//require('./plugins/theme-setting/theme-setting');
require('./plugins/contabs/contabs.css');
require('./plugins/contabs/contabs.min');
require('./plugins/waves/waves');
require('./styles/waves-cov.css');
require('animate.css/animate.css');
require('./styles/index-style.css');
import { menuConfig , menuTitleConfig } from "./config/index-menu.js";
import util from './util/util.js';

/**
 * [暂时使用sessionStorage模拟登陆效果，接口完善后，正常调用接口实现登陆并获取tooken]
 * @type {[function]}
 */
let sessionIsLogin = sessionStorage.getItem("isLogin");
let isLogin = (sessionIsLogin == "" || sessionIsLogin == undefined || sessionIsLogin == null)? false:sessionIsLogin;

console.log("util is,", util)
if(!util.isAnonyLogin() && !isLogin) {
  window.location.href="pages/login.html";
}


/**
 * [根据json数据生成并返回html节点]
 * @param  {[array]} m [请求获得或从本地读取得列表json数据]
 * @param  {[number]} a [索引]
 * @return {[dom]}   [返回得html节点]
 */
function changeHtml (m,a) {
  let len = m.length;
  let menuHtml = '';

  for (var i = 0; i < len; i++) {
    menuHtml = menuHtml +
    `<li class="treeview"> \
        <a href="#"><i class="fa fa-link"></i><span>${m[i].menuName}</span>\
          <span class="pull-right-container">\
            <i class="fa fa-angle-left pull-right"></i>\
          </span>\
        </a>\
        <ul class="treeview-menu">`;

    let listLen = m[i].menuList.length;
    let listMenu = '';
    for (var j = 0; j < listLen; j++) {
      let menu = m[i].menuList[j];

      // 额外属性：描述子菜单的ID（默认无ID）、是否可见（默认可见）。
      let id = (typeof menu.id === "undefined" ? "" : menu.id);
      let show = (typeof menu.show === "undefined" ? "1" : menu.show);
      let idAttr = (id ? ` id=${id} ` : "");
      let showClz = (show === "1" ? "" : 'class="hide"');

      listMenu = listMenu + `<li ${idAttr} ${showClz}><a href="${m[i].menuList[j].url}" class="J_menuItem">${m[i].menuList[j].name}</a></li>`
    }
    menuHtml = menuHtml + listMenu + '</ul></li>';
  }
  menuHtml = menuHtml + '</ul>';
  let titleHtml = `<li><a class="J_menuItem menu-title">${menuTitleConfig[a]}</a></li>`;
  menuHtml = titleHtml + menuHtml;
  $(".sidebar-menu").eq(a).html(menuHtml);
  
}


/**
 * [遍历json数据并调用changeHtml方法生成dom节点]
 */
for (var i = 0; i < menuConfig.length; i++) {
  for (var s in menuConfig[i]) {
    changeHtml(menuConfig[i][s],i);
  }
}

/**
 * tab切换效果实现
 */
$(".seconde-header-nav li").click(function() {
  $(".J_tabCloseAll").click();
  let _index = $(".seconde-header-nav li").index($(this));
  $(".sidebar-menu").eq(_index).css("display","block");
  $(".sidebar-menu").eq(_index).siblings().css("display","none");
})


$(".J_tabExit").click(() => {
  sessionStorage.setItem("isLogin",false);
  sessionStorage.removeItem('token');
})
