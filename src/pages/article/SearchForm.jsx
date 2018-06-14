import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Row, Col, Input, Button, Icon, Select, Modal } from 'antd';
import $ from 'jquery';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

/**
 * 表单检索
 */
class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let cons = Object.assign({}, values);

      for (let p in cons) {
        if ($.trim(cons[p]) === "") {
          delete cons[p];
        }
      }

      this.props.onSearch(cons);
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const formStyle = {
      padding: "24px",
      background: "#fbfbfb",
      border: "1px solid #d9d9d9",
      borderRadius: "6px"
    };
    const {getFieldDecorator} = this.props.form;
    const selectDefault = this.props.selectDefault;

    return (
      <Form
        style={formStyle}
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="标题">
              {
                getFieldDecorator("article_title", {
                  initialValue: ""
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button style={{marginRight: "15px"}} onClick={this.handleReset}>重置</Button>
            <Button type="primary" htmlType="submit">查询</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default (Form.create()(SearchForm));
