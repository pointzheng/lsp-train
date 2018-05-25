import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Checkbox, Select, Row, Col, Input, Table } from 'antd';
import $ from 'jquery';

const Option = Select.Option;

export default class MappingTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.mappingList
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.mappingList
    });
  }

  /**
   * 如下几个onChange事件，将本组件内的model数据（list类型）进行更改
   * （相当于原始的数据<根据文件类型和资源类型接口获取的数据>进行了改变，也即是：this.props.mappingList对应的对象进行了更改）。
   */
  onCheckboxChange(e) {
    const isChecked = e.target.checked;
    const idx = e.target.value;
    let list = this.state.list;

    console.log("current checked value:", idx);
    list[idx].isConst = (isChecked === true);
    this.setState({list}, this.onUserAction);
  }

  onChangeFileField(e) {
    const value = e.target.value;
    const idx = e.target.id.split("-")[1];
    let list = this.state.list;

    list[idx].fileField = value;
    this.setState({list}, this.onUserAction);
  }

  onChangeConstInput(e) {
    const value = e.target.value;
    const idx = e.target.id.split("-")[1];
    let list = this.state.list;

    list[idx].current = value; // 与本列中的下拉列表类型一样，通过current存储当前值
    this.setState({list}, this.onUserAction);
  }

  /**
   * 本函数说明：
   * (1) option对应的value里面，加入了前缀"${index}-"，用于记录该select组件所在行的序号。
   * (2) 获取实际值时，需要通过split操作，对以上的分隔符前缀做处理，复原数据
   */
  onChangeConstSelect(value) {
    let list = this.state.list,
        current,
        idx;

    if (value === this.props.selectDefault) {
      current = value;
    } else {
      const arr = value.split("-");
      idx = arr[0];
      current = arr[1];

      // 查找下拉名称，放于fieldName属性，往后端传递
      console.log("查找下拉名称。下拉数据源：", list[idx].constTypeValue, "，当前的value：", value);
      try {
        const listSrc = list[idx].constTypeValue;
        if (listSrc && listSrc.length > 0) {
          const searchResult = listSrc.filter(one => one.value == current);
          if (searchResult.length > 0) {
            console.log("该下拉对应Option value：", searchResult[0].name);
            list[idx].fieldName = searchResult[0].name;
          } else {
            console.warn("该下拉对应的Option对应的Label不存在");
          }
        }
      } catch (ex) {
        console.warn("加入后端属性fieldName失败!")
      }
    }
    list[idx].current = current;

    this.setState({list}, this.onUserAction);
  }

  onUserAction() {
    this.props.onUserAction(this.state.list);
  }

  /**
   * 从数组中查找某个值的索引
   */
  findIdx(value, list) {
    try {
      return list.findIndex(one => one.value == value); // 如果找不到，返回-1
    } catch (ex) {
      return 9999;
    }
  }

  render() {
    const thisCtx = this;
    const selectDefault = this.props.selectDefault;

    const dataSource = this.state.list.map((ele, idx) => {
      let targetIdx, thisSelectDefault;

      if (ele.constType === "select") {
        targetIdx = thisCtx.findIdx(ele.current, ele.constTypeValue);
        if (targetIdx === 9999) {
          console.warn("查找索引失败，取0:");
          targetIdx = -1;
        }
        thisSelectDefault = typeof ele.current !== "undefined"  && targetIdx !== -1 ? `${targetIdx}-${ele.current}` : selectDefault;
      }
      // "常量值"列
      const constInfo =
        <div style={{display: "inline-block", width: "120px"}}>
          {
            ele.constType === "input"
              ?
              (
                ele.isConst ?
                <Input defaultValue={ele.current === selectDefault ? "" :  ele.current} id={`constInput-${idx}`} onChange={::this.onChangeConstInput} />
                :
                <Input defaultValue={ele.current === selectDefault ? "" :  ele.current} id={`constInput-${idx}`} onChange={::this.onChangeConstInput} disabled={true} />
              )
              :
              (
                ele.isConst
                ?
                <Select defaultValue={thisSelectDefault} onChange={::this.onChangeConstSelect}>
                  <Option value={selectDefault}>请选择</Option>
                  {/*Option的value值，都加入了前缀"${index}-"，便于更改Model数据*/}
                  {
                    ele.constTypeValue && ele.constTypeValue.map
                    ?
                    ele.constTypeValue.map((ctEle, ctIdx) => <Option value={ctIdx + "-" + ctEle.value}>{ctEle.name}</Option>)
                    :
                    null
                  }
                </Select>
                :
                <Select defaultValue={thisSelectDefault} onChange={::this.onChangeConstSelect} disabled>
                  <Option value={selectDefault}>请选择</Option>
                  {
                    ele.constTypeValue && ele.constTypeValue.map
                    ?
                    ele.constTypeValue.map((ctEle, ctIdx) => <Option value={ctIdx + "-" + ctEle.value}>{ctEle.name}</Option>)
                    :
                    null
                  }
                </Select>
              )
            }
          </div>

      return {
        key: ele.key,
        normalField: <span>{ele.normalField}{ele.need ? <span style={{color: "red"}}>*</span> : null}</span>,
        fileField: ele.isConst ?
          <Input id={`fileField-${idx}`} onChange={::this.onChangeFileField} defaultValue={ele.fileField} disabled={true} />
          :
          <Input id={`fileField-${idx}`} onChange={::this.onChangeFileField} defaultValue={ele.fileField} />,
        constValue:
        <Row>
          {
            ele.isConst
            ? <Checkbox onChange={::this.onCheckboxChange} value={idx} checked={true}>{constInfo}</Checkbox>
            : <Checkbox onChange={::this.onCheckboxChange} value={idx} checked={false}>{constInfo}</Checkbox>
          }
        </Row>
      };
    });
    const columns = [{
      title: '标准字段名称',
      dataIndex: 'normalField',
      key: 'normalField',
      width: "170"
    }, {
      title: '文件字段名称',
      dataIndex: 'fileField',
      key: 'fileField',
        width: "170"
    }, {
      title: '常量值',
      dataIndex: 'constValue',
      key: 'constValue'
    }];

    return (
      <div>
        {
          dataSource.length === 0
          ?
          <div style={{color: "red"}}>无映射模板信息</div>
          :
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
          />
        }
      </div>
    );
  }
}
