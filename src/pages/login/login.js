import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import util from '../../util/util.js'
import "./login.css";
import logo from '../../imgs/login_logo.jpg';

// 实际使用时，从配置信息获取
const SERVER_CONF = {
  SERVICE_BASE: "http://222.29.81.251:9130",
  tenant: "l001736",
  userId: sessionStorage.getItem("userId"),
  currentAdmin: sessionStorage.getItem("username"),
  token: sessionStorage.getItem("token")
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
    let _this = this;
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
      fetch(`${SERVER_CONF.SERVICE_BASE}/bl-users/login`, {
        method: 'POST',
        headers: {
          'X-Okapi-Tenant': SERVER_CONF.tenant,
          'Content-type': "application/json"
        },
        body: JSON.stringify(loginInfo)
      }).then((response) => {
        if (response.status >= 400) {
          alert('登陆失败，请检查用户名及密码!');
        } else {
          response.json().then((data) => {
            let username = data.user.username;
            let userId = data.user.id;
            let permissions = data.permissions.permissions;
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("userId", userId);
            const token = response.headers.get('X-Okapi-Token');
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
    fetch(`${SERVER_CONF.SERVICE_BASE}/authn/credentials?query=userId=${userId}`, {
      method: 'GET',
      headers: {
        'X-Okapi-Tenant': SERVER_CONF.tenant,
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
              <p className="right-text">
                <a href="###">忘记密码</a>
              </p>
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

ReactDOM.render(
  <Login/>, document.getElementById("root"));
