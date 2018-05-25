import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { Row, Col, Input, Button, Icon, Select } from 'antd';
import Transfer from 'bfd/Transfer';
import { province } from '../../config/dateConfig.js';
import '../../styles/global.css';
import './TenantSelect.css';

const Option = Select.Option;

/**
 * 通用的租客选取组件，组件使用效果详见：租客代码管理=>新建 功能
 * @author zhengyy
 * @version 1.2.0
 * @see
 *
 * API说明：
 * @param onSelectTenant Function类型，选取租用馆并且进行左右选取之后的回调函数。带2个默认参数，分别代表左侧和右侧数据。可选。
 * @param serviceUrl 组件中点击"检索"按钮后，远程查询的接口基地址。可选，默认为"http://www.baidu.com"
 * @param width 组件宽度，单位为px。可选，默认为100%(占满父容器)。
 * @param title 组件内的标题。可选，默认为空。
 * @param titleRatio 组件标题所占的列数，以24为基础（来源于ant design的24列布局）。可选，默认为4列。
 * @param transferHeight 穿梭框的高度，单位为像素。可选，默认200像素。
 *
 * 使用示例：
 * <TenantSelect
     onSelectTenant={this.selectTenant}
     width={600}
     title={"租客名称"}
     serviceUrl={"http://www.baidu.com"}
     titleRatio={2}
     transferHeight={160}
   />
 *
 * 修订历史：
 * <2017-08-02>  1.0.0  zhengyy  完成组件封装
 * <2017-08-03>  1.0.1  zhengyy  API中添加title参数
 * <2017-08-29>  1.1.0  zhengyy  重构组件，将下方的下拉框改为多选文本框
 * <2017-09-01>  1.2.0  zhengyy  加入实际业务逻辑：远程数据访问等
 * <2017-09-04>  1.3.0  zhengyy  API中加入2个参数：titleRatio、transferHeight
 */

const ALL_VALUE = "-1";
const ALL_DATA = [{
  id: ALL_VALUE,
  label: "全部"
}];
const filter = (ele) => ele.id != ALL_VALUE;
const SERVICE_BASE = "http://192.168.2.49:9130/";
const SERVER_INTERFACE = SERVICE_BASE + "sysman/codes?query=";
const seachTypeList = [{
  name: "租客名称",
  value: "tName"
}, {
  name: "租客类型",
  value: "tType"
}, {
  name: "省份",
  value: "province"
}];

class TenantSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {

      // 搜索类型（下拉）：租客类型、租客名称、省份
      typeList: seachTypeList,
      searchType: seachTypeList[0].value,

      // 搜索类型为租客名称时的文本框
      value: "",

      // 租客类型列表：高校图书馆、公共图书馆等
      tenantTypeList: [],
      curTenantType: "",

      // 省份列表
      provinceList: [],
      curPro: "",

      // 与穿梭框相关的数据
      sourceData: [],
      targetData: []
    };
  }

  componentWillMount() {
    this.fetchServerData(3);
    this.fetchServerData(1);
  }

  fetchServerData (code) {
    fetch(SERVER_INTERFACE + JSON.stringify([["tabid", code, "=", "AND"]]), {
      method: 'GET',
      // headers: { 'X-Okapi-Tenant': "okapi.supertenant"}
    }).then((response) => {
      if (response.status >= 400) {
        console.log("获取数据失败!");
      } else {
        response.json().then((data) => {
          if (data.code == 200) {
            console.log("return data:" + JSON.stringify(data.data));

            let list = this.buildData(data.data);
            if (code === 1) { // 租客类型
              if (typeof list !== "undefined") {
                this.setState({
                  tenantTypeList: list,
                  curTenantType: list[0].value
                });
              }
            } else if (code === 3) { // 省份
              if (typeof list !== "undefined") {
                this.setState({
                  provinceList: list,
                  curPro: list[0].value
                });
              }
            }
          } else {
            console.log("错误的返回值类型!");
          }
        });
      }
    });
  }

  /**
   * 通用处理：获取租客类型或国家，返回的数据结构相似，因此做统一处理
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  buildData(data) {
    let list = data.map((ele, idx, input) => {
      var obj = {};
      try {
        let cvalueObj = JSON.parse(ele.cvalue);
        obj = {
          value: cvalueObj.id,
          name: cvalueObj.name
        };
      } catch (ex) {
        obj = {};
      }
      return obj;
    });

    return list;
  }

  doSearch() {
    var type = this.state.searchType,
        value = "",
        serviceUrl = this.props.serviceUrl,
        tanantInfo,
        queryStr = SERVICE_BASE + "tenantman/tenants?query=",
        params;

    if (typeof serviceUrl === "undefined") {
      serviceUrl = "http://www.baidu.com";
    }

    if (type === "tName") {
      value = this.state.value;
      if (value.length == 0) {
        alert("请输入租客名称!");
        return;
      }
      params = [["tenant.tenant_name_cn", value, "LIKE", "AND"]];
    } else if (type === "tType") {
      value = this.state.curTenantType;
      params = [["tenant.tenant_type", value + "", "=", "AND"]];
    } else if (type === "province") {
      value = this.state.curPro;
      params = [["tenant.tenant_province", value + "", "=", "AND"]];
    }
    console.log("start to search, current type:" + this.state.searchType + ", value:" +  value);

    fetch(queryStr + JSON.stringify(params), {
      method: 'GET',
      // headers: { 'X-Okapi-Tenant': "okapi.supertenant"}
    }).then((response) => {
      if (response.status >= 400) {
        console.log("获取数据失败!");
      } else {
        response.json().then((data) => {
          if (data.code == 200) {
            tanantInfo = data.data;
            console.log("租客列表：" + JSON.stringify(tanantInfo));

            if (typeof tanantInfo !== "undefined" && tanantInfo.totalNum > 0) {
              let list = tanantInfo.list.map((ele) => {
                var tenant = ele.tenant,
                    info;

                // 有信息则放入list，如果没有，跳过该元素(忽略)。
                if (tenant) {
                  if (typeof tenant === "string") {
                    tenant = JSON.parse(tenant);
                  }
                  try {
                    info = {
                      // id: tenant.id,
                      id: ele.id,
                      label: tenant.tenant_name_cn
                    }
                  } catch (ex) {
                    info = {};
                  }
                }

                return info;
              });
              this.setState({
                sourceData:  list,
                targetData: ALL_DATA
              })
            } else {
              this.setState({
                sourceData: [],
                targetData: []
              })
            }
          } else {
            console.log("错误的数据类型!");
          }
        });
      }
    });
  }

  handleTransferChange(sourceData, targetData) {
    sourceData = sourceData.filter((ele) => ele.id != ALL_VALUE);
    targetData = targetData.filter((ele) => ele.id != ALL_VALUE);

    console.log("插件内选取，sourceData:" + JSON.stringify(sourceData) + ", targetData:" + JSON.stringify(targetData));
    this.setState({
      sourceData: sourceData,
      targetData: targetData
    })

    var callback = this.props.onSelectTenant;
    if (callback && typeof callback === "function") {
      callback(sourceData, targetData);
    }
  }

  changeTxt(e) {
    var value = e.target.value;

    this.setState({value});
  }

  selectTenantType(value) {
    this.setState({
      curTenantType: value
    });
  }

  selectProvince(value) {
    this.setState({
      curPro: value
    });
  }

  changeSearchType(value) {
    console.log("type value:" + value);
    this.setState({
      searchType: value
    });

    // 更换搜索类型（租客名称、租客类型、省份）下拉以后，更换其后的组件，设置默认值
    if (value == "tName") {
      this.setState({
        value: ""
      });
    } else if (value === "tType") {
      // do nothing
    } else if (value === "province") {
      this.setState({
        curPro: province[0].value
      });
    }
  }

  buildOption(obj) {
    return  (<Option value={obj.value||obj.id}>{obj.name}</Option>);
  }

  render() {

    let {width, title, titleRatio, transferHeight} = this.props;
    titleRatio = (typeof titleRatio === "undefined" ? 4 : titleRatio);
    transferHeight = (typeof transferHeight === "undefined" ? 200 : transferHeight);

    const widthPx = (typeof width === "undefined" ? "100%" : width + "px");
    const restRatio = 24 - titleRatio;
    const titleCol = (typeof title === "undefined" ? "" : (<Col span={titleRatio} style={{textAlign: "right"}}>{title}</Col>));

    return (
      <div className="tenantWrapper" style={{width: widthPx, margin: "0 auto"}}>
        <Row gutter={"20"}>
          {titleCol}
          <Col span={restRatio}>
              <Row gutter={8}>
                <Col span={6}>
                  <Select value={this.state.searchType} onChange={::this.changeSearchType} className="sel">
                    {this.state.typeList.map(this.buildOption)}
                  </Select>
                </Col>
                <Col span={12}>{{
                  tName: <Input onChange={::this.changeTxt} />,

                  /*注意：defaultValue废弃！*/
                  tType: (<Select size="large" value={this.state.curTenantType} onChange={::this.selectTenantType} className="sel">
                           {this.state.tenantTypeList.map(this.buildOption)}
                         </Select>),
                  province: (<Select size="large" value={this.state.curPro} onChange={::this.selectProvince} className="sel">
                           {this.state.provinceList.map(this.buildOption)}
                         </Select>)
                }[this.state.searchType]}</Col>
                <Col span={6}><Button type="primary" className="tenantSearch" onClick={::this.doSearch}>检索</Button></Col>
              </Row>
              <Row className="tenantList">
                <Transfer
                  height={transferHeight}
                  title="已选择列表"
                  searchPlaceholder="检索结果列表"
                  sdata={this.state.sourceData}
                  tdata={this.state.targetData}
                  onChange={::this.handleTransferChange}
                  render={item => `${item.label}`}
                />
              </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export {TenantSelect}
