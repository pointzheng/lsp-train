import React, { Component, PropTypes } from 'react';
import { Select } from 'antd';
import 'whatwg-fetch';
import {confProd} from '../config/sys-config.js';

const Option = Select.Option;
const method2Code = {
  GET: 200,
  POST: 201,
  PUT: 204,
  DELETE: 204
};

/**
 *
 * 工具函数模块，主要实现与业务无关的通用函数
 * @author zhengyy
 */
const util = {
  trim(txt) {
    return txt.replace(/^\s*|\s*$/g, '');
  },

  /**
   * 获取请求地址URL中的参数
   * @param  {[type]} name  参数名称
   * @return {[type]}      具体的参数值。如果无值，返回null
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
   * 获取服务器配置信息：服务基地址、馆名称（英文和中文）、用户名等
   */
  getServerConfig() {
    return confProd
  },

  /**
   * 获取当前登录信息
   * @return 当前登录用户信息，对象类型，包括userId、tocken等属性
   */
  getLoginInfo() {
    return {
      userId: sessionStorage.getItem("userId"),
      currentAdmin: sessionStorage.getItem("username"),
      token: sessionStorage.getItem("token")
    }
  }
}

export default util
