import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import ReactDOM from 'react-dom';
import { util } from '../../util/util.js';
import ReportTable from '../ReportTable';
import './style.css';

const serverConfigInfo = util.getServerConfig();
const SERVICE_BASE = serverConfigInfo.SERVICE_BASE;
const userId = serverConfigInfo.userId;
const tenant = serverConfigInfo.tenant;

/**----------自定义主题：当前没有使用到----------
echarts.registerTheme('my_theme', {
  backgroundColor: '#fff'
});
*/
const graphConf = {title: {show: false},  textStyle: {fontSize: "8px"}};
const tableContentStyle = {
  height: "220px", // 组件总高度260，header部分30。此处220根据差值计算而来。
  boxSizing: "content-box",
  overflowY: "scroll"
};

/**
 * 单个组件的渲染，类型包括：柱状图、饼图、折线图、表格。
 * 组件是对Echarts组件的进一步封装：通过小组件形式展示，添加了右上方的最大化、最小化、编辑按钮
 * @param rcid
 * @param title
 * @param type
 */
class ReportChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 以下3个属性，通过父组件传入
      type: this.props.type,
      title: this.props.title,
      rcid: this.props.rcid,

      // 以下2个属性，为内部状态，与父组件无关（父组件不传入）
      options: null,
      tableInfo: null // 仅应用于表格内容的展示
    };
  }

  onAction(id, op) {
    // 刷新为组件内部行为，除此之外的其他动作，在父组件执行
    if (op === "refresh") {
      this.fetchComponentData();
    } else {
      if (op === "max" || op === "min") {
        alert("暂未支持!");
        return;
      }
      if (typeof this.props.onAction === "function") {
        this.props.onAction(id, op);
      }
    }
  }

  fetchComponentData() {
    let thisCtx = this;

    // fetch(`${SERVICE_BASE}/dashboard/widget/${rcid}/${type}`, { // 原有接口，已经废弃
    fetch(`${SERVICE_BASE}/dashboard/widget/${this.state.rcid}/chart?type=${this.props.pageType}`, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": tenant
      }
    }).then(function(response) {
      if (response.status !== 200) {
        console.error(`fetch调用失败，状态码：${response.status}，组件ID：${rcid}`);
        return;
      }
      // 返回数据包括2部分信息：type描述组件形状(bar, pie等)，data为真实的数据（echart的展示数据）
      response.json().then(function(resObj) {
        // console.log("组件信息:" + JSON.stringify(resObj));
        let {data, type} = resObj;
        let title;

        if (type === "bar" || type === "line") {
          title = data.title.text;
          thisCtx.setState({
            options: Object.assign(data, graphConf),
            title: title,
            tableInfo: null
          });
        } else if (type === "pie") {
          if (Array.isArray(data)) {
            if (data.length === 1) {
              title = data[0].title.text;
              thisCtx.setState({
                options:  Object.assign(data[0], graphConf),
                title: title,
                tableInfo: null
              });
            } else {
              console.log("TODO：处理多个pie情况");
            }
          }
        } else if (type === "table") {
          thisCtx.setState({tableInfo: resObj, options: null});
        }
      });
    })
  }

  componentDidMount() {
    this.fetchComponentData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.type,
      title: nextProps.title,
      rcid: nextProps.rcid,
      options: null,
      tableInfo: null
    }, this.fetchComponentData);
  }

  render() {
    const imgStyle = {
      marginLeft: "3px",
      marginRight: "3px",
      width: "10px",
      height: "10px",
      cursor: "pointer"
    };
    const minStyle = {
      margin: "0 3px",
      width: "10px",
      height: "1px",
      cursor: "pointer"
    };
    const noDataStyle = {
      color: "red",
      lineHeight: "220px",
      fontSize: "18px",
      textAlign: "center",
      letterSpacing: "3px"
    };
    const imgBase = "./imgs";
    const tableInfo = this.state.tableInfo;

    return (
      <div className="chartWrapper">
        <div className="header">
          <span style={{float: "left", fontWeight: "bold"}}>{this.state.title}</span>
          {/*暂时隐藏最大、最小图标，待后续实现后放开*/}
          <img style={Object.assign({}, imgStyle, {display: "none"})} src={require(`${imgBase}/maxmize.png`)}  onClick={this.onAction.bind(this, this.state.rcid, "max")} title="最大化" />
          <img style={Object.assign({}, minStyle, {display: "none"})} src={require(`${imgBase}/minimize.png`)}  onClick={this.onAction.bind(this, this.state.rcid, "min")} title="最小化" />
          <img style={imgStyle} src={require(`${imgBase}/configure.png`)} onClick={this.onAction.bind(this, this.state.rcid, "config")} title="编辑" />
          <img style={imgStyle} src={require(`${imgBase}/refresh.png`)} onClick={this.onAction.bind(this, this.state.rcid, "refresh")} title="刷新" />
          <img style={imgStyle} src={require(`${imgBase}/close.png`)} onClick={this.onAction.bind(this, this.state.rcid, "close")} title="删除" />
        </div>
        {/*如果是表格，按表格插件（自定义开发的组件）显示；否则（如：bar，chart）按echarts标准插件显示*/}
        <div style={this.state.tableInfo ? tableContentStyle : {}}>
          {
            tableInfo
            ?
            (
              (
                typeof tableInfo.data === "undefined"
                ||
                typeof tableInfo.data.tableData === "undefined" || tableInfo.data.tableData.length === 0
                ||
                typeof tableInfo.data.tableHeader === "undefined" || tableInfo.data.tableHeader.length === 0
              )
              ?
              <div style={noDataStyle}>无数据</div>
              :
              <ReportTable
                serverInfo={tableInfo.data}
                dimCnt={tableInfo.dimCount}
              />
            )
            :
            (
              this.state.options ?
              <ReactEcharts
                option={this.state.options}
                notMerge={true}
                lazyUpdate={true}
                style={{height: "200px"}}
                // theme={"my_theme"} // 可以自定义样式，此处不用
              />
              :
              null
            )
          }
        </div>
      </div>
    )
  }
}

export default ReportChart;
