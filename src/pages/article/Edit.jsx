import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Select, Row, Col, Button} from 'antd';
import util from '../../util/util.js';
import $ from 'jquery';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};
const controlStyle = {width: "85%"};

class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editInfo: {}
    };
  }

  /**
   * 点击"提交"或"取消后的操作"
   * @param  {[type]} op [description]
   * @return {[type]}    [description]
   */
  onOp(op) {
    if (op === "ok" || op === "cancel") {
      this.props.onEditAction(op);
    }
  }

  doSave(event) {
    event.preventDefault();

    const thisCtx = this;
    this.props.form.validateFields((err, values) => {
      const article_title = values.article_title;
      const article_content = values.article_content;
      const article_desc = values.article_desc;

      if ($.trim(article_title) === "") {
        alert("标题不能为空!");
        return;
      }
      if ($.trim(article_content) === "") {
        alert("内容不能为空!");
        return;
      }

      const interfaze = this.props.id === null ? `saveArticle` : `updateArticle`;
      const url = `${this.props.interfaceBase}/${interfaze}`;
      const entity = {
        article_title,
        article_content,
        article_desc
      };
      if (thisCtx.props.id !== null) {
        entity.id = thisCtx.props.id;
      }
      const reqMethod = (thisCtx.props.id === null ? "POST" : "PUT");
      fetch(url, {
        method: reqMethod,
        headers: {
          // "x-okapi-tenant": this.props.serverConf.tenant,
          // "X-Okapi-Token": this.props.serverConf.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(entity)
      }).then((response) => {
        util.handleResponse(response, reqMethod, () => {thisCtx.onOp("ok")})
      })
    });
  }

  componentDidMount() {
    var editInfo = {};
    const id = this.props.id;
    const thisCtx = this;

    if (id === null) {
      editInfo = {
        article_title: "",
        article_content: "",
        article_disc: ""
      };
      this.setState({editInfo});
    } else {
      const queryUrl = `${this.props.interfaceBase}/getArticleById/${id}`;

      fetch(queryUrl, {
        method: "GET",
        headers: {
          // "x-okapi-tenant": loginInfo.tenant,
          // "X-Okapi-Token": loginInfo.token,
          "Content-Type": "application/json"
        }
      }).then((response) => {
        response.json().then(editInfo => {
          console.log("编辑信息：\n", JSON.stringify(editInfo));

          thisCtx.setState({editInfo});
        })
      })
    }

  }

  render() {
    const editInfo = this.state.editInfo;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{maxWidth: "720px", margin: "10px auto 0"}}>
        <Form onSubmit={::this.doSave}>
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            <div>
              {getFieldDecorator("article_title", {
                initialValue: editInfo.article_title
              })(
                <Input style={controlStyle} />
              )}
              <span className="star">*</span>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="内容"
          >
            <div>
              {getFieldDecorator("article_content", {
                initialValue: editInfo.article_content
              })(
                <Input style={controlStyle} />
              )}
              <span className="star">*</span>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            <div>
              {getFieldDecorator("article_desc", {
                initialValue: editInfo.article_desc
              })(
                <Input style={controlStyle} />
              )}
            </div>
          </FormItem>
          <Row style={{margin: "20px 0", textAlign: "center"}}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button type="primary" style={{margin: "0 15px"}} onClick={this.onOp.bind(this, "cancel")}>关闭</Button>
          </Row>
        </Form>
      </div>
    )
  }
}

export default (Form.create()(EditForm));
