import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Select, Row, Col, Button} from 'antd';
import util from '../../util/util.js';

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
      appList: [],
      editInfo: {}
    };
  }

  onOp(op) {
    if (op === "ok" || op === "cancel") {
      this.props.onEditAction(op);
    } else if (op === "preview") { // 暂时未开发"预览功能"，分支保留

    }
  }

  doSave(event) {
    event.preventDefault();
  }

  handleChange(value) {
    const thisCtx = this;

  }

  componentDidMount() {
    var editInfo = {};

    if (this.props.id === null) {
      editInfo = {
        app: this.props.selectDefault,
        roleName: "",
        roleDesc: ""
      };
    } else {
      editInfo = {

      };
    }
    this.setState({editInfo})
  }

  render() {
    const editInfo = this.state.editInfo;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{maxWidth: "720px", margin: "10px auto 0"}}>
        <Form onSubmit={::this.doSave}>
          <FormItem
            {...formItemLayout}
            label="请选择"
          >
            <div>
              {
                this.state.appList.length > 0
                ?
                getFieldDecorator("tenant", {
                  initialValue: editInfo.app
                })(
                  <Select style={controlStyle} onChange={this.handleChange}>
                    <Option value={this.props.selectDefault}>请选择</Option>
                    {
                      this.state.appList.map(
                        (ele, index) => <Option key={index} value={ele.id}>{ele.tenant.tenant_name_cn}</Option>
                      )
                    }
                  </Select>
                )
                :
                <span style={{color: "red"}}>暂无APP，请先配置!</span>
              }
              <span className="star">*</span>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="书目标题"
          >
            <div>
              {getFieldDecorator("article_title", {
                initialValue: editInfo.modelName
              })(
                <Input style={controlStyle} />
              )}
              <span className="star">*</span>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="书目内容"
          >
            <div>
              {getFieldDecorator("article_content", {
                initialValue: editInfo.modelName
              })(
                <Input style={controlStyle} />
              )}
              <span className="star">*</span>
            </div>
          </FormItem>
          <Row style={{marginTop: "20px", textAlign: "center"}}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button type="primary" style={{margin: "0 15px"}} onClick={this.onOp.bind(this, "cancel")}>关闭</Button>
          </Row>
        </Form>
      </div>
    )
  }
}

export default (Form.create()(EditForm));
