# 前端开发流程

* [0 关于本文档](#0-关于本文档)
* [1 开发环境](#1-开发环境)
    * [1.1 软件环境](#11-软件环境)
    * [1.2 开发工具](#12-开发工具)
    * [1.3 项目结构](#13-项目结构)
* [2 登录功能](#2-登录功能)
    * [1.1 软件环境](#11-软件环境)
    * [1.2 开发工具](#12-开发工具)
    * [1.3 项目结构](#13-项目结构)

## 0 关于本文档

本文档主要说明：CALIS新一代图书馆系统中，前端开发的一般流程。主要通过登陆、一个数据表增删改查的开发过程，来说明前端开发的主要流程。

重点在于开发流程、开发思路，与之相匹配前端技术（React，ES6，Node.js等等）不做介绍。

## 1 开发环境

### 1.1 软件环境

* 操作系统环境：Windows10

* Node.js：包括Node.js和NPM。其中Node.js版本不低于8.0，对应的NPM不低于5.0版本

### 1.2 开发工具

建议使用前端开发工具，这里使用[Atom](https://atom.io/)，其他可选的开发工具包括：WebStorm、Hbuilder等。

### 1.3 项目结构

D盘根目录下创建文件夹"lsp-train"，将附件文件放入该文件夹，如下图所示。

![1-project-structure](/uploads/488f7dda0e3872870ad9a7c6a732ab47/1-project-structure.png)

该路径"lsp-train"即为项目根路径，为便于后续的叙述，统一记为"${PROJECT_ROOT}"。

之后，${PROJECT_ROOT}下，运行"npm install"命令。

```html
D:\lsp-train>npm install
```

**注意：** 培训环境下，该步骤已经运行，不需再重复，直接略过即可。

运行如下命令启动系统

```html
npm start
```

本地打开浏览器，敲入地址"http://localhost:7000"，即可看到系统的初始登录页面。

![2-login-page](/uploads/6da490390c614ee0a0c915d12015405e/2-login-page.png)

## 2 登陆功能

这里以运营中心端的登录功能为场景，通过代码结构，说明利用React进行开发的一般流程。

### 2.1 组件设计

登录过程比较简单，页面中仅有一个登录窗口，输入用户名、密码后进行登录。设计时设计为单个组件login.js即可，里面依赖的css单独分离为文件login.css。
在${PROJECT_ROOT}/pages文件夹下，建立文件夹login。之后在"login"文件夹下建立文件：login.js，login.css。

![3-login-tree](/uploads/fe9476e2298fce34366a7b1cf16c9adb/3-login-tree.png)

### 2.2 组件开发

login.css是样式文件，略去说明。主要针对login.js进行开发。

#### 2.2.1 组件定义

login.js，文件内容顶部，加入引用（或者依赖）的模块，如下：

```html
import React, { Component, PropTypes } from 'react';  // React相关的依赖，必须引入
import ReactDOM from 'react-dom';
import util from '../../util/util.js' // 业务工具函数，包括下面的css和图片，视情况引入
import "./login.css";
import logo from '../../imgs/login_logo.jpg';
```

**注意**：ES6的语法，通过import进行引入，包括CSS文件。本例中，CSS文件定义了该页面对应的样式，无需关注。

之后定义React的标准组件，通过里面的各个方法进行实现登录流程，如下。

```html
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
  }

  login() {
    // 登陆业务处理
  }

  handleChange(e) {
   // 登陆相关文本框输入处理
  }

  componentDidMount() {
    // 组件加载完毕后的业务处理
  }

  render() {
    // 组件输出内容
  }
};
```

其中，核心的登录业务，实现如下。

```html
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

          // 根据获取的用户信息，做相应的业务处理
        });
      }
    });
  }
}
```

以上的接口访问了远程服务器"http://222.29.81.251:9130/bl-users/login"接口，响应如下：

```html
{
  "user" : {
    "username" : "administrator",
    "id" : "bfc70265-fcbc-4bdc-bdf9-39cadc78db32",
    "active" : true,
    "proxyFor" : [ ],
    "createdDate" : "2018-03-27T04:34:25.874+0000",
    "updatedDate" : "2018-03-27T04:34:25.874+0000"
  },
  "permissions" : {
    "id" : "70be1503-1c9e-42c8-99d9-c57208c7517e",
    "userId" : "bfc70265-fcbc-4bdc-bdf9-39cadc78db32",
    "permissions" : [ "users.all", "perms.all", "login.all", "mantenant.all", "sysman.all", "appman.all", "apporder.all", "menuman.all", "mappingmodelpub.admin.all", "mantenant.item.query", "mantenant.item.get", "okapi.all" ]
  }
}
```

注意如下几点：

* 获取Okapi服务的后端接口调用，通过[fetch]()调用实现，调用过程为异步方式。根据调用规范，header里面加入了租客信息（X-Okapi-Tenant参数）。

* 响应返回后，一般JSON数据结构，如下图，需要进行相应的处理，如代码中通过"response.json().then"所示。

#### 2.2.2 组件输出

组件返回的内容，通过render方法实现，具体实现代码如下。

```html
    render() {
        return (
            <div className="wrap"
              <header>
                <h1>
                  <img src={logo} />
                </h1>
              </header>
              <div className="main"
                <div className="main-box"
                  <p className="login-title"运营中心</p>
                  <div className="input-box"
                    <input required="required" name="username" value={this.state.loginInfor.username} onChange={this.handleChange} placeholder="请输入用户名" className="input user-name"  />
                    <input name="password" value={this.state.loginInfor.password} onChange={this.handleChange} type="password" placeholder="请输入密码" className="input user-password"  />           
                    <button type="button" className="btn" onClick={this.login}></button>
                  </div>
                </div>
              </div>
              <footer>
                <p>北京开元数图科技有限公司 版权所有</p>
                <p>Copyright 1996-2018 Kaiyuan All rights reserved</p>
              </footer>
            </div>
        );
    }
```

写法上，注意：

* 与传统html区别包含：类名的书写是"className"、事件的书写"onClick", "onChange"等

* 如果返回的是较长的JSX，建议return时加入"()"，便于阅读。

### 2.3 页面效果

整个组件的内容，详见附件中的login.js和login.css。

在以上的浏览器中，输入用户名和密码，进行正常登录，登录后的页面如下图所示。

![4-welcome-page](/uploads/66f68b5a85bcdac11540e1e02368b5e2/4-welcome-page.png)

## 3 信息管理

本小节通过一个典型的数据管理流程（数据表的增删改查），来说明通过React进行开发的步骤，拷贝代码的同时，请注意里面的开发思路。

### 3.1 组件设计

本系统登录后，进入"大数据分析=>数据采集管理=>租客映射模板管理"，查看界面如下图所示。

![5-mapping-tempalte-page](/uploads/7aeac082a7b0de72879f43970ab96cb1/5-mapping-tempalte-page.png)

根据界面UI，可以确定包括几个组件：搜索组件，列表显示组件（表格），编辑（包括新增和编辑）组件。具体的组件关系，如下。

![6-components-relation](/uploads/98c31a78fa3b3afe7cb4d0bf96d6f37d/6-components-relation.png)

其中：

* 入口文件，存放所有子组件：搜索、列表显示、编辑等。

* 搜索组件中，通过将各个检索条件（页面中的文本框、下拉框的内容）输出到主组件。

* 列表显示组件，用于数据的显示，数据的获取是根据主组件中的检索条件进行远程Okapi服务调用，将结构进行显示。里面的数据变化，如分页，属于内部状态变化，同样会调用Okapi进行数据显示。

* 编辑组件，与搜索、列表显示组件并行存在，用于对单条列表数据进行添加、更新操作。

### 3.2 组件开发

#### 3.2.1 入口文件

入口文件包含了以上提及的3个子组件，代码关系通过render方法体现如下：

```html
render() {
  return (
    <div>
      {
        this.state.isEdit
        ?
        <div>
          <nav><a onClick={::this.returnList} className="navTips">返回 | 新增租客映射模板</a></nav>
          <TemplateEdit
            id={this.state.editId}
            tenant={this.state.currentTenant}
            onEditAction={::this.onEditAction}
            isCenter={isCenter}
            serverConf={SERVER_CONF}
            tenantList={this.state.tenantList}
            resTypeList={this.state.resTypeList}
            resTypeMap={this.state.resTypeMap}
            selectDefault={SELECT_DEFAULT}
          />
        </div>
        :
        <div>
          <SearchForm
            onSearch={::this.onFormResearch}
            isCenter={isCenter}
            tenantList={this.state.tenantList}
            resTypeList={this.state.resTypeList}
            selectDefault={SELECT_DEFAULT}
          />
          <MainTable
            isCenter={isCenter}
            serverConf={SERVER_CONF}
            searchCons={this.state.searchCons}
            onAddOrUpdate={::this.onAddOrUpdate}
            pageSize={10}
          />
        </div>
      }
    </div>
  );
}
```

根据是否编辑状态，确定显示的组件：编辑组件，或者搜索、列表显示组件。

#### 3.2.2 搜索组件

搜索组件的功能，主要是完成检索，将检索条件输出到主组件，之后主组件将检索条件转到列表显示组件。

核心功能在于点击"查询"按钮后，将检索条件拼接为json，并输出到主组件。如下。

```html
handleSearch = (e) => {
  e.preventDefault();
  this.props.form.validateFields((err, values) => {
    let cons = Object.assign({}, values);
    const selectArr = ["tenant", "datafileType", "resourceType", "status"];

    selectArr.forEach(one => {
      if (cons[one] === this.props.selectDefault) {
        delete cons[one];
      }
    });
    this.props.onSearch(cons);
  });
}
```

#### 3.2.3 列表组件

列表显示组件中，主要根据检索条件（父组件传入的状态）、当前页码（属于本组件内部状态）进行数据列表显示。同时，里面的数据进行变化（如删除操作）后，进行列表显示。

该组件中，核心状态数据是传入的检索条件，在检索条件的基础上进行显示（即使进行了添加、删除等操作，变化的是页码，总是在检索条件的基础上进行显示）。核心的html代码如下。

```html
render() {
  return (
    <div className="tableWrapper"
      <div className="button-box"
        <Button type="primary" className="op-button" onClick={this.onAddOrUpdate.bind(this, "add", null)}>新建</Button>
      </div>
      <Table
        columns={this.state.columns}
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
```

#### 3.2.4 编辑组件

编辑组件，作用是对于列表中的数据进行编辑（包括更新、添加操作），其显示与搜索、列表显示互斥，不同时出现。

从数据结构来看，该组件里面的数据，对应着后端数据实体（或者说，供前端显示的数据实体），通过界面操作修改该实体，修改完毕后，通过"保存"按钮将数据提交后端Okapi接口，进行更改。

从代码角度来说，本页面核心是数据实体，对于增加操作，实体里面的数据为空或默认，对于编辑情况，是从后端获取。无论那种情况，数据结构固定后，放入状态机（本例中名称为editInfo），进行页面显示。

由于页面联动较多，这里不做过多代码介绍，只从思路说明。略。

### 2.4 附件

具体的业务功能开发，详见附件tenant-template.js、SearchForm.jsx、MainTable.jsx、MappingTable.jsx。
