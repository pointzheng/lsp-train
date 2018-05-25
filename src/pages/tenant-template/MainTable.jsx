import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Popconfirm, Icon, Button, Modal } from 'antd';
import util from '../../util/util.js';

const defaultPageSize = 10;

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.initColumns(),
      data: [],
      total: 0,
      searchCons: null,
      currentPage: 1,
      pageSize: this.props.pageSize ? this.props.pageSize : defaultPageSize
    }
  }

  /**
   * 表格进行分页、排序、筛选时触发
   * @param  {[type]} pagination 分页信息
   * @param  {[type]} filters    [description]，当前尚未用到filters和sorters
   * @param  {[type]} sorter     排序信息
   */
  onTableChange (pagination, filters, sorter) {
    console.log('table changed, parameters:', pagination, filters, sorter);
    this.setState({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      filters,
      sorter
    }, this.handleSearch);
  }

  /**
   * 分页区页码改变后的回调
   * @param  {[type]} page     当前页码
   * @param  {[type]} pageSize 每页记录数
   * @return
   */
  onPageNumberChange(pageNum, pageSize) {
    this.setState({
      currentPage: pageNum
    }, this.handleSearch);
  }

  onAddOrUpdate(op, id, tenant) {
    this.props.onAddOrUpdate(op, id, tenant);
  }

  onItemOp(op, entity, event) {
    let thisCtx = this;
    const id = entity.id;
    const tenant = entity.tenant;
    // const targetLib = this.props.serverConf.tenant;

    event.preventDefault();
    console.log(`当前操作ID：${id}`);
    if (op === "del") {
      fetch(`${this.props.serverConf.SERVICE_BASE}/mappingmodelpub/${id}?tenantIdBL=${entity.tenant}`, {
        method: "DELETE",
        headers: {
          "x-okapi-tenant": this.props.serverConf.tenant,
          "X-Okapi-Token": this.props.serverConf.token
        }
      }).then((response) => {
        util.handleResponse(response, "DELETE", () => {thisCtx.handleSearch()});
      })
    } else if (op === "enable" || op === "disable") {
      const statusOp = (op === "enable" ? "VALID" : "INVALD")

      fetch(`${this.props.serverConf.SERVICE_BASE}/mappingmodelpub/${id}/valid/${statusOp}?tenantIdBL=${entity.tenant}`, {
        method: "PUT",
        headers: {
          "x-okapi-tenant": this.props.serverConf.tenant,
          "X-Okapi-Token": this.props.serverConf.token
        }
      }).then((response) => {
        util.handleResponse(response, "PUT", () => {thisCtx.handleSearch()});
      })
    } else if (op == "edit") {
      this.onAddOrUpdate(op, id, tenant);
    }
  }

  _convertObjToFolioParam(obj) {
    let arr = [];

    for (let p in obj) {
      arr.push(`${p}=${obj[p]}`);
    }

    return arr.join(" and ")
  }

  /**
   * 根据如下进行检索：(1)当前页，(2)每页记录数，(3)检索框的检索条件
   */
  handleSearch() {
    const thisCtx = this;
    const queryCons = Object.assign({}, this.state.searchCons, {
      pageSize: this.state.pageSize,
      currentPage: this.state.currentPage
    });
    const serverInfo = this.props.serverConf;
    const baseUrl = `${serverInfo.SERVICE_BASE}/mappingmodelpub`;
    let queryParam = this._convertObjToFolioParam(this.state.searchCons);

    // 形如：192.168.2.49:9130/mappingmodelpub?limit=2&offset=0&query=contentValue="*测试*"&tenantIdBL=testlib
      if (queryCons.tenant === undefined){
          queryCons.tenant = this.props.serverConf.tenant
      }
    let url = `${baseUrl}?limit=${this.state.pageSize}&offset=${(this.state.currentPage - 1)*this.state.pageSize}&tenantIdBL=${queryCons.tenant}`;
    if (queryParam.length > 0) {
      url += `&query=${queryParam}`;
    }
    fetch(url, {
      method: "GET",
      headers: {
        "x-okapi-tenant": serverInfo.tenant,
        "X-Okapi-Token": serverInfo.token
      }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((json) => {
          thisCtx.setState({
            data: json.mappingmodels,
            total: json.total_records
          });
        });
      } else if (response.status === 404) {
        console.log("返回数据：错误")
        thisCtx.setState({
          data: [],
          total: 0
        });
      }
    }).catch((res) => {
      alert("获取数据失败!" + res)
    })
  }

  componentWillReceiveProps(nextProp) {
    console.log(`table will receive props：${JSON.stringify(nextProp)}`);
    this.setState({
      searchCons: nextProp.searchCons,
      currentPage: 1
    }, this.handleSearch);
  }

  componentDidMount() {
    this.setState({
      searchCons: this.props.searchCons,
      currentPage: 1
    }, this.handleSearch);
  }

  initColumns() {
    let columns = [{
      title: '映射模板名称',
      dataIndex: 'modelName',
      key: 'modelName'
    }];
    const columnsCommon = [{
      title: '资源类型',
      dataIndex: 'resourceTypeNameForDisplay',
      key: 'resourceTypeNameForDisplay'
    }, {
      title: '文件类型',
      dataIndex: 'datafileType',
      key: 'datafileType'
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => record.status === "VALID" ? "启用" : "禁用"
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#" onClick={this.onItemOp.bind(this, "edit", record)}>编辑</a>
          <span className="ant-divider" />
          <a href="#" onClick={this.onItemOp.bind(this, (record.status === "INVALID" ? "enable" : "disable"), record)}>{record.status === "INVALID" ? "启用" : "禁用"}</a>
          <span className="ant-divider" />
          <a href="#" className="ant-dropdown-link" onClick={this.onItemOp.bind(this, "del", record)}>删除</a>
        </span>
      )
    }];

    if (this.props.isCenter) {
      columns.push({
        title: '租客名称',
        dataIndex: 'tenantNameForDisplay',
        key: 'tenantName'
      })
    }
    columns = columns.concat(columnsCommon);

    return columns;
  }

  render() {
    return (
      <div className="tableWrapper" >
        <div className="button-box" >
          <Button type="primary" className="op-button" onClick={this.onAddOrUpdate.bind(this, "add", null)}>新建</Button>
        </div>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
          bordered
          onChange={this.onTableChange.bind(this)}
          pagination={{
            defaultCurrent: 1,
            current: (typeof currentPage === "undefined" ? 1 : parseInt(currentPage)),
            total: this.state.total,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: this.onPageNumberChange.bind(this)
          }}
        />
      </div>
    )
  }
}
