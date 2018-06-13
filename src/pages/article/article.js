import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import '../../styles/global.css';
import SearchForm from './SearchForm.jsx';
import Edit from './Edit.jsx';
import MainTable from './MainTable.jsx';
import util from '../../util/util.js';

let serverConf = util.getServerConfig();
const SELECT_DEFAULT = "NONE";

/**
 * 示例模块
 * @author zhengyy
 * @copyright CALIS管理中心
 */
class ArticleManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,      // 是否导航到编辑页面
      id: null,
      searchCons: {}
    }
  }

  /**
   * op 区分是编辑还是增加，取值：add, ononAddOrUpdate
   */
  onAddOrUpdate(op, id) {
    this.setState({isEdit: true, editId: id});
  }

  // 页面左上角导航"返回"链接
  onCancel() {
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
  }

  render() {
    return (
      <div>
        <div>
          <SearchForm
            onSearch={::this.onFormResearch}
            appList={this.state.appList}
            selectDefault={SELECT_DEFAULT}
          />
          <MainTable
            serverConf={serverConf}
            searchCons={this.state.searchCons}
            onAddOrUpdate={::this.onAddOrUpdate}
            pageSize={10}
          />
        </div>
        {
          this.state.isEdit
          ?
          <Modal
            title={id == null ? "增加书目" : "编辑书目"}
            width={720}
            visible={true}
            maskClosable={false}
            onCancel={::this.onCancel}
            footer={null}
          >
            <Edit
              id={this.state.editId}
              onEditAction={::this.onEditAction}
              serverConf={serverConf}
              appList={this.state.appList}
              selectDefault={SELECT_DEFAULT}
            />
          </Modal>
          :
          null
        }
      </div>
    )
  }
};

ReactDOM.render(<ArticleManagement />, document.getElementById("root"));
