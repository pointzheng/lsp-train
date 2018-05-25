import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Table, Form, Pagination } from 'antd';
import TestServerData from './serverData.jsx'; // 自造测试数据。TODO：后续删除
import ServerResData from './ServerResData.jsx';
import ServerResData2 from './ServerResData2.jsx';
import $ from 'jquery';
import './tableStyle.css';

/**
 * gitlib任务：#59
 * @type {Number}
 */

const DIM_CNT = 1; // 维度个数，与界面中"行表头"拖动个数相等
const COL_WIDTH = 80;
const PAGE_SIZE = 10;

// 基偶行的样式设置
const rowClass = (record, index) => {
  if (index%2) {
    return "odd"
  } else {
    return "even"
  }
};
const pagerStyle = {
  textAlign: "right",
  margin: "20px 10px 20px 0"
};

/**
 * "仪表盘-表格"模块
 * @author zhengyy
 */
export default class ReportTable extends Component {
  constructor(props) {
    super(props);

    // const serverInfo = TestServerData;
    // const serverInfo = ServerResData;
    // const serverInfo = ServerResData2;

    const serverInfo = this.props.serverInfo;

    if (!serverInfo) {
      alert("获取表格信息失败!");
      return;
    }
    this.state = {
      dimCnt: this.props.dimCnt ? this.props.dimCnt : 1,
      total: (serverInfo && serverInfo.tableData && serverInfo.tableData.length > 0) ? serverInfo.tableData.length : 0,
      currentPage: 1,
      dataSource: [],
      serverInfo
    };
  }

  // 统计的[维度列]：其他维度列渲染。
  renderStatOtherDimCol(value, row, index) {
    const obj = {
      children: value,
      props: {colSpan: 0}
    };
    return obj;
  }

  // 查找最后一层节点名字，按顺序。作为备用。
  _findLastNode(arr, initInfo = []) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        this._findLastNode(arr[i].children, initInfo);
      } else {
        initInfo.push(arr[i].dataIndex);
      }
    }
  }

  // 表格头基础上进行处理：每个元素加width属性
  _constructColInfo(header) {
    for (let i = 0; i < header.length; i++) {
      const one = header[i];

      if (one.children && one.children.length > 0) {
        this._constructColInfo(one.children);
      } else {
        one.width = COL_WIDTH;
        delete one.children; // 本句非常必然，放置ant表格插件的错误渲染
      }
    }

    return header;
  }

  // 生成统计表头：表格表头的基础上，多加了维度列的合并
  _constructStatColInfo(header) {
    let displayedHeader = this._constructColInfo(header);
    const cnt = this.state.dimCnt;

    // 处理维度列（列数，与界面中"行表头"个数相等）：第1维度列，colspan跨度值为维度数。其他维度列，跨列为0。
    // 注意：仅针对维度列，后面的其他列不做变动，正常显示。
    for (let i = 0, l = displayedHeader.length; i < this.state.dimCnt; i++) {
      if (i === 0) {
        // displayedHeader[i].render = this.renderStatFirstDimCol; // 横向单元格（维度列）合并功能函数。下同。
        displayedHeader[i].render = (text, row, index) => {
          return {
            children: <span>{text}</span>,
            props: {
              colSpan: cnt  // 跨列（与维度个数相等）。如果为1， 与正常显示无区别。
            }
          };
        }
      } else {
        displayedHeader[i].render = this.renderStatOtherDimCol;
      }
    }

    return displayedHeader;
  }

  doPagination(currentPage) {
    let allData = this.state.serverInfo.tableData;
    let dataSource = [];

    for (let i = (currentPage - 1) * PAGE_SIZE, l = currentPage * PAGE_SIZE; i < Math.min(l, allData.length); i++) {
      dataSource.push(allData[i])
    }

    // 额外加入统计行(相当于：每页实际显示的记录数，为分页数目基础上加1。例如pageSize为10，此时页面显示11条数据)
    if (this.state.serverInfo && this.state.serverInfo.colStat) {
      dataSource.push(this.state.serverInfo.colStat);
    }
    this.setState({dataSource, currentPage});
  }

  componentDidMount() {
    const serverInfo = this.state.serverInfo;

    if (serverInfo.tableData.length > 0) {
      this.doPagination(1);
    }
  }

  componentWillReceiveProps(nextProps) {
    const serverInfo = nextProps.serverInfo;

    this.setState({serverInfo}, () => {
      if (serverInfo.tableData.length > 0) {
        this.doPagination(1);
      }
    })
  }

  render() {
    const serverInfo = this.state.serverInfo;
    const tableHeader = serverInfo.tableHeader;
    const columns = this._constructColInfo(JSON.parse(JSON.stringify(tableHeader)));
    const statColumns = this._constructStatColInfo(JSON.parse(JSON.stringify(tableHeader)));
    const colStatData = serverInfo.colStat;
    const dataSource = this.state.dataSource;

    // column中额外的属性children，不是API规定属性，需要删除。该代码有问题。
    columns.map(one => {
      if (one.children && one.children.length === 0) {
        delete one.children;
      }
    });

    statColumns.map(one => {
      if (one.children && one.children.length === 0) {
        delete one.children;
      }
    });

    return (
      <div style={{margin: "6px"}}>
        {/*表格显示：单独分页，表格内不分页*/}
        <Table
         columns={columns}
         dataSource={dataSource}
         bordered
         size="small"
         pagination={false}
         rowClassName={rowClass}
         // scroll={{ x: '130%', y: '100%' }}
       />
      {
        /*表格外分页*/
        dataSource && dataSource.length > 0
        ?
        <div style={pagerStyle}>
          <Pagination
            current={this.state.currentPage}
            total={this.state.total}
            onChange={::this.doPagination}
          />
        </div>
        :
        null
      }
     </div>
    )
  }
};
