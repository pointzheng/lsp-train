import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Radio } from 'antd';
import MappingTable from './MappingTable.jsx';
import util from '../../util/util.js';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
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
const TENANT_GET_PREFIX = encodeURIComponent('[["tenant.tenant_status", "3", "=", "AND"]]');

/**
 * 当前无用，待废弃
 * @type {Object}
 */
class Star extends React.Component {
  render() {
    const starStyle = {
      color: "red",
      display: "inline-block",
      position: "relative",
      width: "0",
      left: "-8px"
    };

    return (
      <span style={starStyle}>*</span>
    )
  }
}
/**
 * @author zhengyy
 * 组件功能：实现模板数据的添加和更新。较为复杂，为便于后续的维护，详见接口设计：
 * http://gitlab.calis.edu.cn/Business/Sys-Ops-and-Mgmt/wikis/tenant-mapping-tempate-design
 *
 * 注释历史：
 * author       date             note
 * zhengyy      2017-12-14 pm    第1次添加注释
 * zhengyy      2017-12-22 pm    重构
 * zhengyy      2018-01-25前后   加入"资源类型数据表"支持，重构等
 *
 */
class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tenantList: this.props.tenantList,     // 租客列表和资源类型列表，存储在父组件（因为SearchForm组件也需要该信息)
      resTypeList: this.props.resTypeList,   // 资源类型列表
      resTypeDataTableList: [],              // 资源类型数据列表
      dmsTmplList: [],                       // DMS映射模板列表

      // 界面信息分成了editInfo和mappingList，界面展示时，两部分数据独立分开。保存时，将mappingList合并到editInfo中。
      editInfo: {},
      selectTenant : this.props.tenant,
      mappingList: []
    };
  }

  onOp(op) {
    if (op === "ok" || op === "cancel") {
      // TODO:ok：调用接口，保存后返回首页
      this.props.onEditAction(op);
    } else if (op === "preview") { // 暂时未开发"预览功能"，分支保留

    }
  }

  /**
   * 存储数据
   */
  doSave(e) {
    let thisCtx = this;
    const reqMethod = thisCtx.props.id ? "PUT" : "POST";
    let url = `${this.props.serverConf.SERVICE_BASE}/mappingmodelpub`;
    const mappingList = this.state.mappingList; // 当前的字段映射表组件MappingTable中的数据

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let resourceTypeNameForDisplay = "", entity, list;

      values.resourceTypeDataTable = this.state.editInfo.resourceTypeDataTable; // 由于UI中资源类型数据表下拉为受控组件，因此此处values中没有该值。需要补上。
      if (!this.checkItem(values)) {
        return;
      }
      // 映射字段表必填字段校验
      for(let i = 0, l = mappingList.length; i < l; i++) {
        const ml = mappingList[i];
        const value = ml.current; // 第3列（"常量值"列）的值：下拉列表select和输入框input，最终的值均放入了current属性。

        if (
          ml.need
          && (typeof value === "undefined" || value.length === 0 || value == this.props.selectDefault) // 第3列（"常量值"列）是否为空
          && (typeof ml.fileField === "undefined" || ml.fileField.length === 0) // 第2列（"文件字段名称"列）是否为空
        ) {
          alert(`${ml.normalField}不能为空!`);
          return;
        }
      }

      // 将映射字段表中的数据，转为后台需要的数据结构
      list = mappingList.map(ele => {
        return {
          key: ele.key,
          isConst: ele.isConst,
          value: ele.isConst ? ele.current : ele.fileField,

          // 3个额外属性，后台需要
          fieldCode: ele.fieldCode,
          dispValue: ele.dispValue,
          fieldName: ele.fieldName
        }
      });

      try {
        resourceTypeNameForDisplay = thisCtx.props.resTypeMap[values.resourceType].sc_name;
      } catch (ex) {
        console.warn("查找对应的资源名称出错!");
      }
      entity = Object.assign({}, values, {
        metaMappings: list,
        resourceTypeNameForDisplay
      });
      console.log(`提交实体：${JSON.stringify(entity)}`);

      if (this.props.id) {
        url += `/${this.props.id}`; // 编辑操作，对应的接口需要ID参数
      }
      fetch(url, {
        method: reqMethod,
        headers: {
          "x-okapi-tenant": this.props.serverConf.tenant,
          "X-Okapi-Token": this.props.serverConf.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(entity)
      }).then((response) => {
        util.handleResponse(response, reqMethod, () => {thisCtx.onOp("ok")})
      })
    })
  }

  // 映射表之外的表单字段校验
  checkItem(info) {
    const selectDefault = this.props.selectDefault;

    if (this.props.isCenter && info.tenant === selectDefault) {
      alert("请选取租客!");
      return false;
    }
    if (info.modelName.length === 0) {
      alert("请填写模板名称!");
      return false;
    }
    if (info.resourceType === selectDefault) {
      alert("请选取资源类型!");
      return false;
    }
    if (info.resourceTypeDataTable === selectDefault) {
      alert("请选取资源类型数据表!");
      return false;
    }
    if (info.datafileType === selectDefault) {
      alert("请选取文件类型!");
      return false;
    }
    if (info.dmsId === selectDefault) {
      alert("请选取DMS映射模板!");
      return false;
    }

    return true;
  }

  /**
   * 仅用在组件初始化时：加载界面数据
   */
  initUI() {
    const {id, selectDefault, tenant} = this.props;
    let thisCtx = this, editInfo;

    // 初始化state中的editInfo，仅为页面UI初始时使用。
    if (id) {
      fetch(`${this.props.serverConf.SERVICE_BASE}/mappingmodelpub/${id}?tenantIdBL=${tenant}`, {
        method: "GET",
        headers: {
          "x-okapi-tenant": this.props.serverConf.tenant,
          "X-Okapi-Token": this.props.serverConf.token,
          "Content-Type": "application/json"
        }
      }).then((response) => {
        response.json().then(editInfo => {
          console.log("获取的模板编辑信息：\n", JSON.stringify(editInfo));
          thisCtx.setState({editInfo}, () => {
            thisCtx.initEditMappingTable();                                                         // 初始化字段表
            thisCtx.changeResTypeDataTable(editInfo.resourceType, editInfo.resourceTypeDataTable);  // 根据资源类型,初始化资源类型数据表
          });
        })
      })
    } else {
      editInfo = {
        tenant: selectDefault,
        datafileType: selectDefault,
        resourceType: selectDefault,
        resourceTypeDataTable: selectDefault,
        dmsId: selectDefault,
        status: "VALID",
        modelName: "",         // 模板名称
        fileTypeInfo: ""       // 文件类型(xml，excel，marc)对应的提示信息
      };
      this.setState({editInfo});
    }
  }

    handleChange = (value) => {
        let thisCtx = this;
        thisCtx.setState({selectTenant:value}, () => {
            thisCtx.initEditMappingTable();                                                         // 初始化字段表
            // thisCtx.changeResTypeDataTable(editInfo.resourceType, editInfo.resourceTypeDataTable);  // 根据资源类型,初始化资源类型数据表
        });
    }

  /**
   * 编辑情况下，初始化字段映射表
   */
  initEditMappingTable() {
    let mappingList,
        metaMappings = this.state.editInfo.metaMappings,
        thisCtx = this;

    // 将存储的数据结构(里面包含key、isConst、value、normalField、fieldCode、dispValue共6个属性)
    // STEP 1:转换成UI所需的数据结构（key、isConst、fileField、current、fieldName、fieldCode、dispValue）
    if (!metaMappings || metaMappings.length === 0) {
      return;
    }
    mappingList = metaMappings.map(ele => {
      return Object.assign(ele, {
        key: ele.key,
        isConst: ele.isConst,
        fileField: ele.isConst ? "" : ele.value, // 与current互斥

        // 此时还不知道第3列的类型（input还是select），暂时笼统赋值为NONE
        // （如果是input，则页面会显示NONE，不正确！MappingTable组件中进行了修正，代码：ele.current === selectDefault ? "" :  ele.current）。
        current: ele.isConst ? ele.value : this.props.selectDefault,

        // 冗余属性，照搬过来
        fieldName: ele.fieldName,
        fieldCode: ele.fieldCode,
        dispValue: ele.dispValue
      });
    });

    // 获取的映射字段列表，继续补充UI所需的数据结构（有前提：接口获取的字段个数，与存取接口获取的字段个数相等。如果不等，可能有错误。TODO）。
    // STEP 2: 组装添加need、normalField、constType、constTypeValue属性
    const resourceType = this.state.editInfo.resourceType;
    const resourceTypeDataTable = this.state.editInfo.resourceTypeDataTable;
    const url = `${this.props.serverConf.SERVICE_BASE}/fieldsfordisplay?scType=${resourceType}&dataTableId=${resourceTypeDataTable}&tenantIdBL=${this.state.selectTenant}`;
    fetch(url, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": this.props.serverConf.tenant,
        "X-Okapi-Token": this.props.serverConf.token
      }
    }).then(response => {
      if (response.status !== 200) {
        console.log('获取字段映射失败，状态码：' + response.status);
        return;
      }
      response.json().then(jsonObj => {
        const list = jsonObj.sourceTypeFieldForDisplays; // 根据资源类型、资源类型数据表获取的所有字段
        if (!Array.isArray(list)) {
          console.error("资源类型数据有误!");
          return;
        }
        // 对比，扩充数据结构
        list.forEach((ele, idx) => {
          mappingList[idx] = Object.assign({}, mappingList[idx], {
            need: ele.need,
            normalField: ele.normalField,
            constType: ele.constType,
            constTypeValue: ele.constTypeValue
          })
        });
        thisCtx.setState({mappingList});
      });
    })
  }

  /**
   * 根据资源类型，更改资源类型数据表(在state内)
   * @param  {[type]} resTypeId 资源类型ID
   */
  changeResTypeDataTable(resTypeId, resTypeTableId) {
    const thisCtx = this;
    const queryValue = encodeURIComponent(`resourceType=${resTypeId}`);
    const resTypeDataTableUrl = `${this.props.serverConf.SERVICE_BASE}/datatable?query=${queryValue}`;

    // 根据资源类型，获取资源类型数据表，进行下拉展现
    fetch(resTypeDataTableUrl, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": this.props.serverConf.tenant,
        "X-Okapi-Token": this.props.serverConf.token
      }
    }).then(response => {
      if (response.status !== 200) {
        console.log('获取资源类型表失败，状态码：' + response.status);
        return;
      }
      response.json().then(json => {
        const resTypeDataTableList = json.datatables;
        const editInfo = this.state.editInfo;

        editInfo.resourceTypeDataTable = this.props.selectDefault;
        if (resTypeTableId) {
          editInfo.resourceTypeDataTable = resTypeTableId;
        }
        thisCtx.setState({resTypeDataTableList, editInfo});
      });
    })
  }

  /**
   * 资源类型更换回调：重新获取映射字段信息，渲染界面中的映射列表
   */
  onChangeResType(resId) {
    let editInfo = this.state.editInfo;

    editInfo.resourceType = resId;
    this.setState({editInfo}, () => {
      this.changeResTypeDataTable(resId);
    });
  }

  /**
   * 更换资源类型数据表后，接口调用，更改字段映射列表
   */
  onChangeDataTable(value) {
    const thisCtx = this;
    const resId = this.state.editInfo.resourceType;
    const fieldUrl = `${this.props.serverConf.SERVICE_BASE}/fieldsfordisplay?scType=${resId}&dataTableId=${value}&tenantIdBL=${this.state.selectTenant}`;
    fetch(fieldUrl, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": this.props.serverConf.tenant,
        "X-Okapi-Token": this.props.serverConf.token
      }
    }).then(response => {
      if (response.status !== 200) {
        console.log('获取字段映射失败，状态码：' + response.status);
        return;
      }
      response.json().then(jsonObj => {
        console.log(`ID为${resId}的所有字段映射：\n`, JSON.stringify(jsonObj));

        const list = jsonObj.sourceTypeFieldForDisplays;
        if (!Array.isArray(list)) {
          console.error("资源类型数据有误!");
          return;
        }
        // 将接口数据组装为UI所需的数据结构
        let mappingList = list.map((ele, idx) => {
          // 继承接口数据结构，补充用于UI显示的额外属性
          return Object.assign({
            key: ele.scFieldId,
            isConst: false,
            current: (ele.constType === "input" ? "" : this.props.selectDefault),

            // 冗余属性，用于往后端传递
            fieldName: "",
            dispValue: ele.normalField
          }, ele);
        });
        let editInfo = this.state.editInfo;
        editInfo.resourceTypeDataTable = value;
        thisCtx.setState({mappingList, editInfo});
      });
    })
  }

  /**
   * 更换文件类型
   */
  onChangeFileType(value) {
    let editInfo = this.state.editInfo;

    editInfo.datafileType = value;
    this.setState({editInfo});
  }

  /**
   * 字段映射表更改后的回调
   * 事实上：该回调不会用到，因为传入组件MappingTable的属性mappingList，已经是对象类型（指针引用类型）。
   * 因此，MappingTable组件内的变化，已经影响（或者说修改）了当前this.state.editInfo.mappingList
   * 该回调作为debug使用
   */
  onMappingTableAction(mappingList) {
    // 二者应该相同
    console.log("new edit info：\n", JSON.stringify(mappingList),
      "\n当前的editInfo.mapppingList：\n", JSON.stringify(this.state.editInfo.mappingList));
  }

  /**
   * 组件加载完毕，填充租客、资源类型、dms映射模板下拉列表
   */
  componentDidMount() {
    let thisCtx = this;

    // 初始化：DMS映射模板列表
    fetch(`${this.props.serverConf.SERVICE_BASE}/dmsmapping?userId=${this.props.serverConf.userId}&status=0`, {
      method: "GET",
      headers: {
        "X-Okapi-Tenant": this.props.serverConf.tenant
      }
    }).then(response => {
      if (response.status !== 200) {
        console.error('获取dms模板列表失败，状态码：' + response.status);
        return;
      }
      response.json().then(jsonObj => {
        // console.log("JSON[所有DMS模板]：\n", JSON.stringify(jsonObj.mappingResult));
        let dmsTmplList = jsonObj.mappingResult;

        thisCtx.setState({dmsTmplList});
      });
    });

    this.initUI();
  }

  render() {
    let editInfo = this.state.editInfo;
    let tipsLabel = "";
    const { getFieldDecorator } = this.props.form;
    const datafileType = editInfo.datafileType;
    const selectDefault = this.props.selectDefault;

    if (datafileType === "excel") {
        tipsLabel = "从第几行开始";
    } else if (datafileType === "xml") {
        tipsLabel = "记录根路径";
    } else if (datafileType === "marc") {
        tipsLabel = "字符集";
    }

    return (
      <div style={{maxWidth: "720px", margin: "10px auto 0"}}>
        <Form onSubmit={::this.doSave}>
          {
            this.props.isCenter
            ?
            <FormItem
              {...formItemLayout}
              label="选择租客"
            >
              <div>
                <span className="star">*</span>
                {
                  this.state.tenantList.length > 0
                  ?
                  getFieldDecorator("tenant", {
                    initialValue: editInfo.tenant
                  })(
                    <Select style={controlStyle} onChange={this.handleChange}>
                      <Option value={selectDefault}>请选择</Option>
                      {
                        this.state.tenantList.map(ele => <Option value={ele.id}>{ele.tenant.tenant_name_cn}</Option>)
                      }
                    </Select>
                  )
                  :
                  <span style={{color: "red"}}>暂无资源类型，请先配置!</span>
                }
              </div>
            </FormItem>
            :
            null
          }
          <FormItem
            {...formItemLayout}
            label="映射模板名称"
          >
            <div>
              <span className="star">*</span>
              {getFieldDecorator("modelName", {
                initialValue: editInfo.modelName
              })(
                <Input style={controlStyle} />
              )}
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="资源类型"
          >
            <div>
              <span className="star">*</span>
              {
                this.state.resTypeList.length > 0
                ?
                getFieldDecorator("resourceType", {
                  initialValue: editInfo.resourceType
                })(
                  <Select onChange={::this.onChangeResType} style={controlStyle}>
                    <Option value={selectDefault}>请选择</Option>
                    {
                      this.state.resTypeList.map(ele => <Option value={ele.id}>{ele.sc_name}</Option>)
                    }
                  </Select>
                )
                :
                <span style={{color: "red"}}>暂无资源类型，请先配置!</span>
              }
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="资源类型数据表"
          >
            {/*
              此处下拉特殊，作为受控组件：没有使用getFieldDecorator。ant的该包装实在太难用，满足不了需求！
              表单提交时，手动处理该下拉的值。详见doSave方法。
            */}
            <div>
              <span className="star">*</span>
              {
                this.state.resTypeDataTableList.length > 0
                ?
                <Select onChange={::this.onChangeDataTable} value={editInfo.resourceTypeDataTable} style={controlStyle}>
                  <Option value={selectDefault}>请选择</Option>
                  {
                    this.state.resTypeDataTableList.map(ele => <Option value={ele.id}>{ele.tableNameForDisplay}</Option>)
                  }
                </Select>
                :
                <span style={{color: "red"}}>无数据!</span>
              }
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="数据文件类型"
          >
            <div>
              <span className="star">*</span>
              {
                getFieldDecorator("datafileType", {
                  initialValue: editInfo.datafileType
                })(
                  <Select onChange={::this.onChangeFileType} style={controlStyle}>
                    <Option value={selectDefault}>请选择</Option>
                    <Option value="marc">marc</Option>
                    <Option value="excel">excel</Option>
                    <Option value="xml">xml</Option>
                  </Select>
                )
              }
            </div>
          </FormItem>
          {
            tipsLabel.length !== 0
            ?
            <FormItem
             {...formItemLayout}
             label={tipsLabel}
            >
              <div>
                <span className="star" style={{visibility: "hidden"}}>*</span>
                {
                 getFieldDecorator("fileTypeInfo", {
                   initialValue: editInfo.fileTypeInfo
                 })(
                   <Input style={controlStyle} />
                 )
                }
              </div>
           </FormItem>
            :
            null
          }
          <FormItem
            {...formItemLayout}
            label="选择DMS映射模板"
          >
            <div>
              <span className="star">*</span>
              {
                this.state.dmsTmplList.length > 0
                ?
                getFieldDecorator("dmsId", {
                  initialValue: editInfo.dmsId
                })(
                  <Select style={controlStyle}>
                    <Option value={selectDefault}>请选择</Option>
                    {
                      this.state.dmsTmplList.map(ele => <Option value={ele.mappingId}>{ele.temaplateName}</Option>)
                    }
                  </Select>
                )
                :
                <span style={{color: "red"}}>暂无DMS映射模板，请先配置!</span>
              }
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="启用状态"
          >
            <div>
              <span className="star" style={{visibility: "hidden"}}>*</span>
              {
                getFieldDecorator("status", {
                  initialValue: editInfo.status
                })(
                  <RadioGroup>
                    <Radio value={"VALID"}>启用</Radio>
                    <Radio value={"INVALID"}>禁用</Radio>
                  </RadioGroup>
                )
              }
            </div>
          </FormItem>
          {/* 根据需求，暂时不实现上传功能
          <FormItem
            {...formItemLayout}
            label="本地数据文件模板"
          >
            <Input />
          </FormItem>
          */}
          <FormItem
            {...formItemLayout}
            label="请设置字段映射表"
          >
            <div>
              <span className="star">*</span>
              <MappingTable style={controlStyle}
                mappingList={this.state.mappingList}
                onUserAction={::this.onMappingTableAction}
                selectDefault={selectDefault}
              />
            </div>
          </FormItem>
          <Row style={{marginTop: "20px", textAlign: "center"}}>
            <Button type="primary" style={{display: "none"}} onClick={this.onOp.bind(this, "preview")}>预览</Button>
            <Button type="primary" style={{margin: "0 15px"}} onClick={this.onOp.bind(this, "cancel")}>取消</Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </Row>
        </Form>
      </div>
    )
  }
}

const TemplateEdit = Form.create()(EditForm);
export default TemplateEdit;
