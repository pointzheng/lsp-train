import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,      // 是否导航到编辑页面
      id: null,
      searchCons: {}
    }
  }

  

  render() {
    return (
      <div>欢迎您培训示例系统</div>
    )
  }
};

ReactDOM.render(<Welcome />, document.getElementById("root"));
