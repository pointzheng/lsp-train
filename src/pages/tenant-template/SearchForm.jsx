import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Row, Col, Input, Button, Icon, Select, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

/**
 * 表单检索
 */
class AdvancedSearchForm extends React.Component {
  constructor(props) {
    super(props);
  }

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

  handleReset = () => {
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
          {
            this.props.isCenter
            ?
            <Col span={8}>
              <FormItem {...formItemLayout} label="租客名称">
                {getFieldDecorator("tenant", {
                  initialValue: selectDefault
                })(
                <Select placeholder="请选择">
                  <Option value={selectDefault}>请选择</Option>
                  {
                    this.props.tenantList.map(ele => <Option value={ele.id}>{ele.tenant.tenant_name_cn}</Option>)
                  }
                </Select>
                )}
              </FormItem>
            </Col>
            :
            null
          }
          <Col span={8}>
            <FormItem {...formItemLayout} label="资源类型">
              {
                this.props.resTypeList.length > 0
                ?
                getFieldDecorator("resourceType", {
                  initialValue: selectDefault
                })(
                  <Select>
                    <Option value={selectDefault}>请选择</Option>
                    {
                      this.props.resTypeList.map(ele => <Option value={ele.id}>{ele.sc_name}</Option>)
                    }
                  </Select>
                )
                :
                <span style={{color: "red"}}>暂无资源类型，请先配置!</span>
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="文件类型">
              {getFieldDecorator("datafileType", {
                initialValue: selectDefault
              })(
                <Select placeholder="请选择">
                  <Option value={selectDefault}>请选择</Option>
                  <Option value="marc">marc</Option>
                  <Option value="excel">excel</Option>
                  <Option value="text">text</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="启用状态">
              {getFieldDecorator("status", {
                initialValue: selectDefault
              })(
              <Select placeholder="请选择">
                <Option value={selectDefault}>请选择</Option>
                <Option value="VALID">启用</Option>
                <Option value="INVALID">禁用</Option>
              </Select>
              )}
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

const SearchForm = Form.create()(AdvancedSearchForm);
export default SearchForm;
