import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {message} from "antd";
import "./login-openapi.css";
import logo from '../../imgs/login_logo.jpg';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInfor: {
        username: "",
        password: "",
        secureCode: ""
      },
      loginHtml: "http://222.29.81.136:8082/loginp",
      params: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.getURI = this.getURI.bind(this);
    this.validate_form = this.validate_form.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({}, this.getURI);
  }

  componentDidMount() {
    this.setState({}, this.getURI);
  }

  GetQueryString(name)
  {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  }

  getURI() {
    var url = location.search;
    if (url.indexOf("?") != -1) {
      var params = url.substr(1);
      this.setState({params: params});
      return params;
    }
  }

  check(param) {
    for (var key in param) {
      if (param[key] == null) {
        message.error(key + " :不能为空");
        return false;
      } else {
        return true;
      }
    }
  }

  login() {
    let _loginInfor = this.state.loginInfor;
    let _this = this;
    let redirect_uri = _this.GetQueryString("redirect_uri");
    let lp_uri = _this.GetQueryString("lp_uri");
    let tenant_id = _this.GetQueryString("tenant_id");
    let client_id = _this.GetQueryString("client_id");
    let lp_sign = _this.GetQueryString("lp_sign");
    let sign = _this.GetQueryString("sign");
    let paramArray = new Array();
    let _flag = true;
    paramArray.push({"tenant_id": tenant_id});
    paramArray.push({"client_id": client_id});
    paramArray.push({"lp_uri": lp_uri});
    paramArray.push({"redirect_uri": redirect_uri});
    paramArray.push({"sign": sign});
    paramArray.push({"lp_sign": lp_sign});
    paramArray.forEach(param => {
      _flag = _this.check(param);
      if (!_flag) {
        return false;
      }
    });

    if (_flag) {
      for (var j in _loginInfor) {
        if (!_loginInfor[j]) {
          //_this.getURI();lp_uri
          _flag = false;
          message.error('用户名或密码或验证码不能为空');
          return false;
        }
      }
    }

    if (_flag) {
      fetch(`http://192.168.2.51:9092/loginp?` + _this.getURI(), {
        method: 'POST',
        headers: {
          'X-Okapi-Tenant': tenant_id,
          'Content-type': "application/json"
        },
        body: JSON.stringify(_loginInfor)
      }).then((response) => { //window.location.href=data.lp_uri;
        if (response.status == 200) {
          response.json().then((data) => {
            let headers = response.headers;
            headers.forEach((k, e) => {
              console.log(k + ':' + e);
            });
            window.location.href = response.headers.get('location');
            //let token = response.headers.get('X-Okapi-Token');
            //Okapi重写了Response,重写后的Response只支持FOLIO认为的有效header,不包含expire
            //let expire = response.headers.get("expire");
            //let username = data.username;
            //let userid = data.userid;
            //let expire = data.expire;
            //lp_uri = lp_uri+"?tenant_id="+tenant_id+"&client_id="+client_id
            //+"&username="+username+"&userid="+userid+"&X-Okapi-Token="+token
            //+"&expire="+expire+"&sign="+sign+"&lp_sign="+lp_sign+"&redirect_uri="+redirect_uri;
            //window.location.href=lp_uri;
            //window.
            return true;
          });
        } else if (response.status == 400 || response.status == 500) {
          response.json().then((data) => {
            let msg_code = data.msg_code;
            let msg_txtCN = data.msg_txtCN;
            let msg_txtEN = data.msg_txtEN;
            message.error(msg_code + ':' + msg_txtCN + ' ' + msg_txtEN);
            return false;
          });
        } else if (response.status == 403) {
          let text = response.text();
          message.error(text);
          return false;
        } else {
          message.error('出现其他问题,请联系管理员');
          return false;
        }
      }).catch(error => message.error(error));
    }

  }

  handleChange(e) {
    let _loginInfor = this.state.loginInfor;
    _loginInfor[e.target.name] = e.target.value;
    this.setState({loginInfor: _loginInfor});
  }

  validate_form(thisForm) {
    thisForm.preventDefault();

    let _loginInfor = this.state.loginInfor;
    let _this = this;
    let redirect_uri = _this.GetQueryString("redirect_uri");
    let lp_uri = _this.GetQueryString("lp_uri");
    let tenant_id = _this.GetQueryString("tenant_id");
    let client_id = _this.GetQueryString("client_id");
    let lp_sign = _this.GetQueryString("lp_sign");
    let sign = _this.GetQueryString("sign");
    let paramArray = new Array();
    let _flag = true;
    paramArray.push({"tenant_id": tenant_id});
    paramArray.push({"client_id": client_id});
    paramArray.push({"lp_uri": lp_uri});
    paramArray.push({"redirect_uri": redirect_uri});
    paramArray.push({"sign": sign});
    paramArray.push({"lp_sign": lp_sign});
    paramArray.forEach(param => {
      _flag = _this.check(param);
      if (!_flag) {
        return false;
      }
    });

    if (_flag) {
      for (var j in _loginInfor) {
        if (!_loginInfor[j]) {
          //_this.getURI();lp_uri
          _flag = false;
          message.error('用户名或密码或验证码不能为空');
          return false;
        }
      }
    }

    if (_flag) {
      thisForm.target.submit();
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
            <p className="login-title">认证登录</p>
            <div className="input-box">
              <form action={this.state.loginHtml.concat("?").concat(this.state.params)} onSubmit={this.validate_form.bind(this)} method="POST">
                <input name="username" value={this.state.loginInfor.username} onChange={this.handleChange.bind(this)} placeholder="请输入用户名" className="input user-name"/>
                <input name="password" value={this.state.loginInfor.password} onChange={this.handleChange.bind(this)} type="password" placeholder="请输入密码" className="input user-password"/>
                <input name="secureCode" value={this.state.loginInfor.secureCode} onChange={this.handleChange.bind(this)} placeholder="请输入验证码" className="input user-check"/>
                <button type="submit" className="btn"></button>
              </form>
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

// export default Login;

ReactDOM.render(<Login/>, document.getElementById("root"));
