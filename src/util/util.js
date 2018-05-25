import React, { Component, PropTypes } from 'react';
import { Select, message } from 'antd';
import 'whatwg-fetch';
import {confDev4SpecificationLib, confDev, confProd, method2Code, mode, anonyLogin} from '../config/sysConfig.js';
const Option = Select.Option;
//import { getServerConfig } from  'util.js';
/**
 *
 * 工具函数模块，主要实现与业务无关的通用函数
 * @author kongxc, zhengyy
 */
const util = {
  /**
   * 根据传入的数据，组装Option组件列表
   * @param arr, Array类型
   * @author kongxc
   * @return Array类型，组装后的Option列表
   */
  getSelectItems: (tabid) => {
    var type = [];
    let SERVER_CONF = util.getServerConfig();
    //let url = SERVER_CONF.SERVICE_BASE+`/sysman/codes?query=`+encodeURI([["tabid","1","=","AND"]])+"&orderBy=cvalue.name";
    let url = SERVER_CONF.SERVICE_BASE+`/sysman/codes?query=`+encodeURI(JSON.stringify([["tabid",`${tabid}`,"=","AND"]]))+"&orderBy=cvalue.name";
    fetch(url,{
        method: 'GET',
        headers: {
            "X-Okapi-Tenant": SERVER_CONF.tenant,
            "X-Okapi-Token":SERVER_CONF.token
        }
    }).then((response) => {
        if (response.status >= 400) {
            response.text().then((text) => {
               message.error("Get Tenant type error: "+text);
            });
        } else {
            response.json().then((data) => {
                type.push(<Option key="default" value="">请选择</Option>);
                data.data.forEach((ty) => {
                    type.push(<Option key={ty.cvalue.id} value={ty.cvalue.id}>{ty.cvalue.name}</Option>);
                });
            });
            console.log(type)
        }
    }).catch((res) => {
        message.warning("获取数据失败!" + res)
    });
    return type;
  },

    getTypes: (tabid) => {
        var type = {};
        let SERVER_CONF = util.getServerConfig();
        //let url = SERVER_CONF.SERVICE_BASE+`/sysman/codes?query=`+encodeURI([["tabid","1","=","AND"]]);
        let url = SERVER_CONF.SERVICE_BASE+`/sysman/codes?query=`+encodeURI(JSON.stringify([["tabid",`${tabid}`,"=","AND"]]))+"&orderBy=cvalue.name";
        fetch(url,{
            method: 'GET',
            headers: {
                "X-Okapi-Tenant": SERVER_CONF.tenant,
                "X-Okapi-Token":SERVER_CONF.token
            }
        }).then((response) => {
            if (response.status >= 400) {
                response.text().then((text) => {
                    message.error("Get Tenant type error: "+text);
                });
            } else {
                response.json().then((data) => {
                    data.data.forEach((ty) => {
                        //type.push(Object.assign({[ty.cvalue.id]:`${ty.cvalue.name}`}));
                        type[ty.cvalue.id] = ty.cvalue.name;
                    });
                });
            }
        }).catch((res) => {
            message.warning("获取数据失败!" + res)
        });
        return type;
    },

  getData: (_this,type,values) => {
    _this.setState({
        loading:true
    });
    let SERVER_CONF = util.getServerConfig();
    let _submitInfor = values?values:_this.state.submitInfor;
    let urlStr = [];
    let url ;
    if(type=="audit"){
      urlStr.push(["tenant.tenant_status","0","=","AND"]);
    } else if(type=="maintain"){
      urlStr.push(["tenant.tenant_status","0","!=","AND"]);
      urlStr.push(["tenant.tenant_status","2","!=","AND"]);
    } else if(type=="management"){
        urlStr.push(["tenant.tenant_status","0","!=","AND"]);
        urlStr.push(["tenant.tenant_status","2","!=","AND"]);
    } else if(type=="stateManagement"){
        urlStr.push(["tenant.tenant_status","0","!=","AND"]);
        urlStr.push(["tenant.tenant_status","2","!=","AND"]);
    }
    for (var key in _submitInfor) {
      if (_submitInfor[key]!=="") {
        if(key=="tenant_name_cn"){
          urlStr.push([`tenant.${key}`,`%${_submitInfor[key]}%`,"LIKE","AND"]);
        }else if(key=="tenant_from"){
          urlStr.push([`regdate`,`${_submitInfor[key]}`,">=","AND"]);
        }else if(key=="tenant_to"){
          urlStr.push([`regdate`,`${_submitInfor[key]}`,"<=","AND"]);
        } else if(key=="id") {
            urlStr.push([`${key}`,`%${_submitInfor[key]}%`,"LIKE","AND"]);
        } else {
          urlStr.push([`tenant.${key}`,`%${_submitInfor[key]}%`,"LIKE","AND"]);
        }/*else{
          urlStr.push([`tenant.${key}`,`${_submitInfor[key]}`,"=","AND"]);
        }*/
      }
    }
    urlStr = JSON.stringify(urlStr);
      url = `${SERVER_CONF.SERVICE_BASE}/tenantman/tenants?query=`+encodeURI(`${urlStr}&currPage=`+_this.state.currentPage+"&perPage="+_this.state.perPage+"&orderBy="+_this.state.orderBy+"&order="+_this.state.order);
      fetch(url, {
      method: 'GET',
      headers: {
          "X-Okapi-Tenant": SERVER_CONF.tenant,
          "X-Okapi-Token":SERVER_CONF.token
      }
    }).then((response) => {
      if (response.status >= 400) {
          response.json().then((data)=>{
              message.error(data.message);
              _this.setState({
                  update: true,
                  loading: false,
              });
          });
      }else {
        response.json().then((data)=>{
          if (data.message=="success") {
            let _data = data.data.list;
            let _arr = [];
            let eventData = {};
            for (let i in _data) {
              eventData[_data[i].id] = Object.assign({},_data[i].tenant);
              _arr[i] = Object.assign({},_data[i].tenant);
              _arr[i].id = _data[i].id;
              _arr[i].regdate = _data[i].regdate;
              _arr[i].udpdate = _data[i].udpdate;
            };
            _this.setState({
                update: true,
              loading: false,
              data: _arr,
              total: data.data.totalNum,
              eventData
            });
          }else{
            // alert(data.error.errorMessageCN);
            if(data.data==null){
              _this.setState({
                  update: true,
                  loading: false,
                  total: 0,
                  data: []
              });
            }
          }
        });
      }
    });
  },

  getSingleData: (_this,key) => {
    let SERVER_CONF = util.getServerConfig();
    // fetch(`http://222.29.81.252:9130/tenantman/tenants/${key}`, {
    fetch(`${SERVER_CONF.SERVICE_BASE}/tenantman/tenants/${key}`, {
      method: 'GET',
      headers: {
          'X-Okapi-Tenant': SERVER_CONF.tenant,
          "X-Okapi-Token":SERVER_CONF.token
      },
      // body: JSON.stringify(_this.state.submitData),
    }).then((response) => {
      if (response.status >= 400) {
          response.text().then((text)=>{
              message.error("操作失败！"+text, 3);
          });
      }else {
        response.json().then((data)=>{
          if (data.code == 200 && data.message=="success") {
            let _data = data.data.tenant;
            _data.key = data.data.id;
            _data.regdate = data.data.regdate;
            _data.udpdate = data.data.udpdate;
            _this.setState({
              tenantData: _data
            });
          }else{
            _this.setState({tenantData:{}});
          }
        });
      }
    });
  },

    getOkapiClusterUrls : (callback) => {
        let SERVER_CONF = util.getServerConfig();
        // fetch(`http://222.29.81.252:9130/tenantman/tenants/${key}`, {
        fetch(`${SERVER_CONF.SERVICE_BASE}/_/discovery/nodes`, {
            method: 'GET',
            /*headers: {
                'X-Okapi-Tenant': SERVER_CONF.tenant,
                "X-Okapi-Token":SERVER_CONF.token
            },*/
            // body: JSON.stringify(_this.state.submitData),
        }).then((response) => {
            if (response.status >= 400) {
                response.text().then((text)=>{
                    message.error("操作失败！"+text, 3);
                });
            } else if (response.status == 200) {
                response.json().then((data) => {
                    //callback(data);
                    //现在固定为具体的值，之后有了OKAPI集群配置，再调接口
                    callback([{"clusterName":"测试用例Okapi集群名称","clusterUrl":`${SERVER_CONF.SERVICE_BASE}`}]);
                    //callback([{"clusterName":"测试用例Okapi集群名称","clusterUrl":"http://222.29.81.252:9130"}]);
                });
            }
        }).catch((res) => {
            message.warning("操作异常!" + res);
        });
    },

  trim(txt) {
    return txt.replace(/^\s*|\s*$/g, '');
  },

    handleDate(dateStr) {
        if(dateStr === '------'){
            return dateStr;
        }

        console.log("dateStr:" + dateStr);
        if (dateStr === undefined || dateStr === ''){
          return "";
        }

        let year, month, day, hour, minute, second;

        try {
            year = dateStr.substring(0, 4);
            month = dateStr.substring(4, 6);
            day = dateStr.substring(6, 8);
            hour = dateStr.substring(8, 10);
            minute = dateStr.substring(10, 12);
            second = dateStr.substring(12, 14);
        } catch (ex) {
            console.error("处理时间错误!");
            return "";
        }

        return (year + "-" + month + "-"  + day + " "  + hour + ":"  + minute + ":"  + second);
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
   * 页签对应的ID，详见index-memu.js里面的配置
   * @param  {[type]} tabId  页签对应的ID
   * @param  {[type]} params 参数，通过字符串或JSON对象描述。
   *                         如果是字符串类型，多个参数形如"a=3&b=4&c=5"，或者单个参数"a=3"
   *                         如果是JSON对象，对象值形如{a:3, b:4, c:5}
   * @return {[type]}        [description]
   */
  openTab(tabId, params) {

    let paramStr = "",
        link;

    console.log("即将打开菜单：" + tabId);
    if (typeof params === "string") {
      if (params.indexOf("?") === -1) {
          paramStr += "?";
      }
      paramStr += params;
    } else if (Object.prototype.toString.call(params) === "[object Object]") {
      for (let o in params) {
        if (paramStr.length === 0) {
          paramStr += ("?" + o + "=" + params[o]);
        } else {
          paramStr += ("&" + o + "=" + params[o]);
        }
      }
    }
    if (parent.$ && parent.$(`#${tabId} a`).length > 0) {
      link = parent.$(`#${tabId} a`);
      let originHref = link.attr("href");

      if (paramStr.length > 0) {
        link.attr("href", originHref + paramStr + "&t=" + (new Date().getTime()));
        parent.$(`#${tabId} a`).trigger("click");
      }
      link.attr("href", originHref);
    } else {
      console.warn("当前页面的父页面，没有jQUery配置，或者ID不正确!");
    }
  },

  /**
   * 按src（模糊匹配，包含即可）刷新对应src的iframe
   * @param  {[type]} src [description]
   * @return {[type]}     [description]
   */
  reloadFrame(src) {
    let fuzzyName = `iframe[src*="${src}"`;
    let compFrm = parent.$(fuzzyName);
    if (compFrm.length > 0) {
      compFrm.attr("src", compFrm.attr("src"));
    } else {
      console.warn("模糊查找不到对应的frame：", fuzzyName);
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
    if (mode === "confDev4SpecificationLib") {
      return confDev4SpecificationLib;
    } else if (mode === "dev") { // 开发模式，取自server.js。
      return confDev;
    } else if (mode === "prod") {
      return confProd;
    } else {
      return confProd;
    }
  },

  // 获取开发模式
  getEnv() {
    return mode;
  },

  // 是否允许匿名登录
  isAnonyLogin() {
    return anonyLogin;
  }

};

export { util }
export default util
