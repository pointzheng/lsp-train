import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import util from '../../util/util.js'
import "./login.css";
import logo from '../../imgs/login_logo.jpg';

// 实际使用时，从配置信息获取
const conf = {
  serverBase: "http://222.29.81.251:9130",
  tenant: "l001736"
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInfor: {
        username: "",
        password: ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.getUUid = this.getUUid.bind(this);
  }

  login() {
    let loginInfo = this.state.loginInfor;
    var flag = true;

    if (!loginInfo.username) {
      alert("用户名不能为空!");
      return;
    }
    if (!loginInfo.password) {
      alert("密码不能为空!");
      return;
    }
    if (flag) {
      fetch(`${conf.serverBase}/bl-users/login`, {
        method: 'POST',
        headers: {
          'X-Okapi-Tenant': conf.tenant,
          'Content-type': "application/json"
        },
        body: JSON.stringify(loginInfo)
      }).then((response) => {
        if (response.status >= 400) {
          alert('登陆失败，请检查用户名及密码!');
        } else {
          response.json().then((data) => {
            const username = data.user.username;
            const userId = data.user.id;
            const permissions = data.permissions.permissions;
            const token = response.headers.get('X-Okapi-Token');

            sessionStorage.setItem("username", username);
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("isLogin", true);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("permissions", permissions);
            this.getUUid(userId, token);
          });
        }
      });
    }
  }

  getUUid(userId, token) {
    fetch(`${conf.serverBase}/authn/credentials?query=userId=${userId}`, {
      method: 'GET',
      headers: {
        'X-Okapi-Tenant': conf.tenant,
        'Content-type': "application/json",
        'x-okapi-token': token
      }
    }).then((response) => {
      if (response.status >= 400) {
        message.error('获取权限列表失败，请重新登录');
      } else {
        response.json().then((data) => {
          let uuid = data.credentials[0].id;
          sessionStorage.setItem("uuid", uuid);

          window.location.href = "../index.html";
        });
      }
    });
  }

  handleChange(e) {
    let _loginInfor = this.state.loginInfor;
    _loginInfor[e.target.name] = e.target.value;
    this.setState({loginInfor: _loginInfor});
  }

  componentDidMount() {
    let isLogin = sessionStorage.getItem("isLogin");
    if (isLogin === "true") {
      window.location.href = "../index.html";
    }
  }

  render() {
    return (
      <div className="wrap">
        <header>
          <h1>
            <img src={logo}/>
          </h1>
        </header>
        <div className="main">
          <div className="main-box">
            <p className="login-title">运营中心</p>
            <div className="input-box">
              <input required="required" name="username" value={this.state.loginInfor.username} onChange={this.handleChange} placeholder="请输入用户名" className="input user-name"/>
              <input name="password" value={this.state.loginInfor.password} onChange={this.handleChange} type="password" placeholder="请输入密码" className="input user-password"/>
              <button type="button" className="btn" onClick={this.login}></button>
            </div>
          </div>
        </div>
        <footer>
          <p>北京开元数图科技有限公司 版权所有</p>
          <p>Copyright 1996-2017 Kaiyuan All rights reserved</p>
        </footer>
      </div>
    );
  }
};

ReactDOM.render(<Login/>, document.getElementById("root"));
