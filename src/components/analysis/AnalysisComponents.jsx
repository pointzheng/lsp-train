import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Row, Col, Input} from 'antd';
import ReportChart from '../ReportChart';
import '../../styles/global.css';
import util from '../../util/util.js';

const serverConfigInfo = util.getServerConfig();
const SERVICE_BASE = serverConfigInfo.SERVICE_BASE;
const userId = serverConfigInfo.userId;
const tenant = serverConfigInfo.tenant;

/**
 * 页面通过2列方式，列表显示所有的组件
 * 公用组件，供如下3个功能模块使用（一级菜单=>二级菜单）:
 * (1)仪表盘=>仪表盘
 * (2)本机构数据分析=>在线分析
 * (3)综合数据分析=>在线分析
 * 区别在于传入的属性pageType取值不同：index, analysis, unionlib，表示菜单：仪表盘、本机构在线分析、综合在线分析
 * 此外，该组件接收另一个参数：scope，代表获取数据的范围：取值"singlelib", "unionlib"或""，代表仪表盘、本机构、所有
 * @author zhengyy
 */
class AnalysisComponents extends Component {

  constructor(props) {
 		super(props);
 		this.state = {
      result: null
 		};
 	}

  addReport(e) {
    e.preventDefault();

    // 本机构=>在线分析
    if (this.props.pageType === "analysis") {
      util.openTab("analysisEdit", {pageType: this.props.pageType})
    // 仪表盘
    } else if (this.props.pageType === "index") {
      util.openTab("dashboardEdit", {pageType: this.props.pageType})
    // 综合=>在线分析
    } else  if (this.props.pageType === "unionlib") {
      util.openTab("templateEditUnion", {pageType: this.props.pageType})
    } else {
      console.warn("参数不对，不能打开Tab!");
    }
  }

  /**
   * 组件各种操作(组件ReportChart的回调)：删除（关闭）、最大最小化，但不包括刷新
   * @param  {[type]} id [description]
   * @param  {[type]} op [description]
   * @return {[type]}    [description]
   */
  onAction(id, op) {
    let thisCtx = this,
        pageType = this.props.pageType ? this.props.pageType : "index";

    if (op === "config") {
      const pageType = this.props.pageType;
      const info = {
        id,
        scope: this.props.scope,
        pageType: this.props.pageType
      };
      let tabId;

      if (pageType === "analysis") {
        tabId = "analysisEdit";
      } else if (pageType === "index") {
        tabId = "dashboardEdit";
      } else if (pageType === "unionlib") {
        tabId = "templateEditUnion";
      }
      util.openTab(tabId, info);
    } else if (op === "close") {
      fetch(`${SERVICE_BASE}/dashboard/widget/${id}?type=${pageType}`, {
        method: "DELETE",
        headers: {
          "x-okapi-tenant": tenant
        }
      }).then((response) => {
        if (response.status >= 400) {
          alert("操作失败，响应状态码：" + response.status);
          return;
        }
        thisCtx.loadData();
        // window.location = window.location.href; // 强制刷新页面，因为上面的语句总是导致结果不正常。TODO：待后续优化后，替换该方式。
      })
    }
  }

  loadData() {
    let thisCtx = this,
        result = null,
        pageType = this.props.pageType ? this.props.pageType : "index";
    const userIdParam = userId ? `&userId=${userId}` : "";

    fetch(`${SERVICE_BASE}/dashboard/widget?type=${pageType}${userIdParam}`, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": tenant
      }
    }).then(function(response) {
      if (response.status !== 200) {
        console.log('fetch调用失败，状态码：' + response.status);
        return;
      }

      response.json().then(function(data) {
        console.log("信息:" + JSON.stringify(data));

        if (typeof data.widgetList !== "undefined") {
          let list = data.widgetList;
          const filteredResult = list.filter((ele) => {
            if (typeof ele.id != "undefined"
              && typeof ele.name != "undefined"
              && typeof ele.type != "undefined") {
              return ele;
            }
          })

          thisCtx.setState({result: filteredResult});
        }
      });
    })
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div>
        <Row style={{textAlign: "right"}}>
          <a href="" onClick={::this.addReport} title="添加">
            <img src={require("./img/addReport.png")} style={{marginRight: "8px"}} />
          </a>
        </Row>
        <Row>
          {
            this.state.result
            ?
            this.state.result.map(ele =>
               <Col span={12}>
                 <ReportChart
                   type={ele.type}
                   title={ele.name}
                   rcid={ele.id}
                   onAction={::this.onAction}
                   pageType={this.props.pageType}
                 />
               </Col>
            )
            :
            null
          }
        </Row>
      </div>
    );
  }
};

export {AnalysisComponents}
