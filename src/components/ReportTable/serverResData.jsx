// 测试数据
export default {

  "tableHeader": [{
    "title": "读者机构",
    "dataIndex": "fullname",
    "children": []
  }, {
    "title": "已借",
    "dataIndex": "count(duedate)",
    "children": []
  }, {
    "title": "总计(已借)",
    "dataIndex": "count(duedate)stat",
    "children": []
  }],

  "tableData": [{
    "count(duedate)stat": "491.0",
    "count(duedate)": "491",
    "fullname": "师范学院"
  }, {
    "count(duedate)stat": "13.0",
    "count(duedate)": "13",
    "fullname": "教务部"
  }],

  "colStat": {
    "count(duedate)": "9961", //如果属性不全，也可以，不影响显示
    "count(duedate)stat": "0",
    "fullname": "0"
  }
}
