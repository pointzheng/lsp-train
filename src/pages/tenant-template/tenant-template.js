import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Table, Modal } from 'antd';
import '../../styles/global.css';
import SearchForm from './SearchForm.jsx';
import TemplateEdit from './TemplateEdit.jsx';
import MainTable from './MainTable.jsx';
import util from '../../util/util.js';

/**
 * 区分是中心，还是租客。不同的身份，界面不同。
 * 做此处理，便于中心和租客，2套代码的配置：对于租客端代码，此处填写false；中心为true
 */
const isCenter = true;
let SERVER_CONF = util.getServerConfig();
const TENANT_GET_PREFIX = encodeURIComponent('[["tenant.tenant_status", "3", "=", "AND"]]');
const SELECT_DEFAULT = "NONE";

/**
 * "租客映射模板管理"模块，#69
 * @author zhengyy
 */
class MappingModelManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resTypeMap: {},
      resTypeList: [],
      tenantList: [],  // 租客列表，供查询组件SearchForm、添加操作组件TemplateEdit使用
      isEdit: false,   // 是否导航到编辑页面
      editId: "",
      currentTenant:"",
      searchCons: {}
    }
  }

  /**
   * op 区分是编辑还是增加，取值：add, ononAddOrUpdate
   */
  onAddOrUpdate(op, id, tenant) {
    this.setState({isEdit: true, editId: id, currentTenant:tenant});
  }

  // 页面左上角导航"返回"链接
  returnList() {
    this.setState({isEdit: false});
  }

  onFormResearch(searchCons) {
    console.log(`根组件，检索条件：${JSON.stringify(searchCons)}`);
    this.setState({searchCons});
  }

  /**
   * 编辑（包括增加）后的回调：重新刷新列表数据
   * @param  String op
   */
  onEditAction(op) {
    this.setState({isEdit: false, searchCons: {}});
  }

  componentDidMount() {
    let thisCtx = this;
    const tenantInfoUrl = `${SERVER_CONF.SERVICE_BASE}/tenantman/tenants?query=${TENANT_GET_PREFIX}`;
    const resTypeUrl = `${SERVER_CONF.SERVICE_BASE}/sc_type_configs/option/list?pageNo=1&pageSize=1000&isActive=enable&dataSource=["upfile"]`;

    // 租客信息
    fetch(tenantInfoUrl, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": SERVER_CONF.tenant,
        "X-Okapi-Token": SERVER_CONF.token
      }
    }).then(response => {
      if (response.status !== 200) {
        console.log('主组件，获取租客列表失败，状态码：' + response.status);
        return;
      }
      response.json().then(jsonObj => {
        console.log("主组件，JSON[所有租客]：\n", JSON.stringify(jsonObj.data.list));
        const tenantList = jsonObj.data.list;

        thisCtx.setState({tenantList});
      });
    });

    // 资源类型
    fetch(resTypeUrl, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": SERVER_CONF.tenant
      }
    }).then(response => {
      if (response.status !== 200) {
        console.log('获取资源类型列表失败，状态码：' + response.status);
        return;
      }
      response.json().then(jsonObj => {
        console.log("主组件，JSON[所有资源类型]：\n", JSON.stringify(jsonObj.scConfigs));
        let resTypeList = jsonObj.scConfigs;
        let resTypeMap = {};

        resTypeList.forEach((ele, idx) => {
          resTypeMap[ele.id] = ele;
        });
        thisCtx.setState({resTypeList, resTypeMap});
      });
    })
  }

  render() {
    return (
      <div>
        {
          this.state.isEdit
          ?
          <div>
            <nav><a onClick={::this.returnList} className="navTips">返回 | 新增租客映射模板</a></nav>
            <TemplateEdit
              id={this.state.editId}
              tenant={this.state.currentTenant}
              onEditAction={::this.onEditAction}
              isCenter={isCenter}
              serverConf={SERVER_CONF}
              tenantList={this.state.tenantList}
              resTypeList={this.state.resTypeList}
              resTypeMap={this.state.resTypeMap}
              selectDefault={SELECT_DEFAULT}
            />
          </div>
          :
          <div>
            <SearchForm
              onSearch={::this.onFormResearch}
              isCenter={isCenter}
              tenantList={this.state.tenantList}
              resTypeList={this.state.resTypeList}
              selectDefault={SELECT_DEFAULT}
            />
            <MainTable
              isCenter={isCenter}
              serverConf={SERVER_CONF}
              searchCons={this.state.searchCons}
              onAddOrUpdate={::this.onAddOrUpdate}
              pageSize={10}
            />
          </div>
        }
      </div>
    );
  }
};

ReactDOM.render(<MappingModelManagement />, document.getElementById("root"));
