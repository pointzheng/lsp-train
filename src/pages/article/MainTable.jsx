import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Popconfirm, Icon, Button, Modal } from 'antd';
import util from '../../util/util.js';

const defaultPageSize = 10;

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      total: 0,
      searchCons: null,
      currentPage: 1,
      pageSize: this.props.pageSize ? this.props.pageSize : defaultPageSize
    }
  }

  /**
   *
   * 表格进行分页、排序、筛选时触发
   * @param  pagination 分页信息
   * @param  filters    [description]，当前尚未用到filters和sorters
   * @param  sorter     排序信息
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
   * @param  page     当前页码
   * @param  pageSize 每页记录数
   * @return
   */
  onPageNumberChange(pageNum, pageSize) {
    this.setState({
      currentPage: pageNum
    }, this.handleSearch);
  }

  onAddOrUpdate(op, id, event) {
    this.props.onAddOrUpdate(op, id);
  }

  onItemOp(op, entity, event) {
    const thisCtx = this;
    const id = entity.id;
    const tenant = entity.tenant;

    event.preventDefault();
    console.log(`当前操作ID：${id}`);
    if (op === "del") {
      const url = `${this.props.interfaceBase}/deleteArticle/${id}`;

      fetch(url, {
        method: "DELETE",
        headers: {
          // "x-okapi-tenant": loginInfo.tenant,
          // "X-Okapi-Token": loginInfo.token
        }
      }).then((response) => {
        util.handleResponse(response, "DELETE", () => {thisCtx.handleSearch()});
      })
    } else if (op == "edit") {
      this.onAddOrUpdate(op, id, tenant);
    }
  }

  /**
   * 根据条件进行检索：当前页、每页记录数、检索框的检索条件
   */
  handleSearch() {
    const thisCtx = this;
    const queryCons = Object.assign({}, this.state.searchCons, {
      pageSize: this.state.pageSize,
      currentPage: this.state.currentPage
    });
    const pagerInfo = `limit=${this.state.pageSize}&offset=${(this.state.currentPage - 1)*this.state.pageSize}`;
    const url = `${this.props.interfaceBase}/findAllArticle?${pagerInfo}`;

    fetch(url, {
      method: "GET",
      headers: {
        // "x-okapi-tenant": loginInfo.tenant,
        // "X-Okapi-Token": loginInfo.token
      }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((json) => {
          thisCtx.setState({
            data: json,
            total: json.length
          });
        });
      } else if (response.status === 404) {
        console.log("404：无数据")
        thisCtx.setState({
          data: [],
          total: 0
        });
      }
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

  /**
   * 工具函数：形如"20180614162641702"的日期格式转换为"yyyy-MM-dd hh:ss:mm"
   * @param  {[type]} dateStr
   * @return {[type]}
   */
  handleDate(dateStr) {
    let year, month, day, hour, minute, second, rt;

    console.log("需要转换的时间字符串:" + dateStr);
    if (dateStr === undefined || dateStr === '') {
      return "";
    }
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

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  render() {
    const thisCt = this;
    const columns = [{
      title: '标题',
      dataIndex: 'article_title',
      key: 'article_title'
    }, {
      title: '内容',
      dataIndex: 'article_content',
      key: 'article_content'
    }, {
      title: '描述',
      dataIndex: 'article_desc',
      key: 'article_desc'
    }, {
      title: '创建日期',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text, record, index) => thisCt.handleDate(text)
    }, {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#" onClick={this.onItemOp.bind(this, "edit", record)}>修改</a>
          <span className="ant-divider" />
          <a href="#" className="ant-dropdown-link" onClick={this.onItemOp.bind(this, "del", record)}>删除</a>
        </span>
      )
    }];

    return (
      <div className="tableWrapper">
        <div className="button-box">
          <Button type="primary" className="op-button" onClick={this.onAddOrUpdate.bind(this, "add", null)}>新建</Button>
        </div>
        <Table
          columns={columns}
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
