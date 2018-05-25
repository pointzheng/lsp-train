/**
 * 创建人:林俊杰
 * 创建时间:2017/1/5.
 * 描述:Jquery扩展
 **/


import $ from 'jquery';

var _ajax=$.ajax;

$.ajax=function (opt) {
    opt.crossDomain=true;
    if(opt.xhrFields)
        opt.xhrFields.withCredentials=true;
    else
        opt.xhrFields={withCredentials:true};
    _ajax(opt);
};

export default $;