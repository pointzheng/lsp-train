import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class Welcome extends Component {
  render() {
    return (
      <div>欢迎您培训示例系统</div>
    )
  }
};

ReactDOM.render(<Welcome />, document.getElementById("root"));
