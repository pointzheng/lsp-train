import React, { Component, PropTypes } from 'react';
import { Select, message } from 'antd';
import 'whatwg-fetch';
import {confDev4SpecificationLib, confDev, confProd, method2Code, mode, anonyLogin} from '../config/sysConfig.js';
const Option = Select.Option;

/**
 *
 * 工具函数模块，主要实现与业务无关的通用函数
 * @author kongxc, zhengyy
 */
const util = {
  trim(txt) {
    return txt.replace(/^\s*|\s*$/g, '');
  },

  /**
   * 获取页面参数
   * @param  {[type]} name [description]
   * @return {[type]}      具体的参数值，如果无值，返回null
   */
  getParameter(name) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		 if(results == null) {
			 return null;
		 } else {
			 return results[1];
		 }
	},

  /**
   * 对操作（DELETE、PUT、POST）的相应统一处理
   * @param  {[type]}   response   [description]
   * @param  {[type]}   method   [description]
   * @param  {Function} callback [description]
   */
  handleResponse(response, method, callback) {
    if (response.status >= 400) {
      alert("操作失败，响应状态码：" + response.status);
      return;
    } else if (response.status === method2Code[method] || response.status === 200) {
      alert("操作成功!");
      if (callback && typeof callback === "function") {
        callback();
      }
    } else {
      alert("操作失败!");
    }
  },

  /**
   * 根据当前模式（开发或是生产模式），获取服务器配置信息：服务基地址、馆名称（英文和中文）、用户名等
   * @param config 各个参数配置，JS Object类型。当前作为备用，尚未启用。
   */
  getServerConfig(config) {
    return confProd;
  },

  // 是否允许匿名登录
  isAnonyLogin() {
    return anonyLogin;
  }
}

export default util
