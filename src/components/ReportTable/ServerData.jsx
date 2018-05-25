// 测试数据
const tableData = [];
for (let i = 0; i < 100; i++) {
  tableData.push({
    key: i,
    src: "测试数据源" + (i + 1),
    date: "2017-09-11",
    android1: "sanxign1",
    ios1: "pingguo1",
    android2: "sanxign2",
    ios2: "pingguo2",
    node11: "11",
    node12: "12",
    node21: "11",
    node22: "12",
    node31: "21",
    node32: "22",
    node41: "21",
    node42: "22",
    statNewOrder: "300",
    statCancelOrder: "555"
  });
}
const colStat = {
  key: 999,
  src: "测试数据源" + (999 - 1),
  date: "统计信息",
  android1: "103",
  ios1: "200",
  android2: "300",
  ios2: "400",
  node11: "500",
  node12: "600",
  node21: "700",
  node22: "800",
  node31: "880",
  node32: "890",
  node41: "860",
  node42: "1200",
  statNewOrder: "990",
  statCancelOrder: "777"
};
const tableHeader = [{
  title: '日期',
  dataIndex: 'date'
}, {
  title: '用户注册来源',
  dataIndex: 'src'
}, {
  title: '新增订单量',
  children: [{
    title: 'Android',
    dataIndex: 'android1',
    children: [{
      title: '上海',
      dataIndex: 'node11'
    }, {
      title: '长沙',
      dataIndex: 'node12'
    }]
  }, {
    title: 'IOS',
    dataIndex: 'ios1',
    children: [{
      title: '上海',
      dataIndex: 'node21'
    }, {
      title: '长沙',
      dataIndex: 'node22'
    }]
  }]
}, {
  title: '取消订单量',
  children: [{
    title: 'Android',
    dataIndex: 'android2',
    children: [{
      title: '上海',
      dataIndex: 'node31'
    }, {
      title: '长沙',
      dataIndex: 'node32'
    }]
  }, {
    title: 'IOS',
    dataIndex: 'ios2',
    children: [{
      title: '上海',
      dataIndex: 'node41'
    }, {
      title: '长沙',
      dataIndex: 'node42'
    }]
  }]
}, {
  title: '统计（新增订单量）',
  dataIndex: 'statNewOrder'
}, {
  title: '统计（取消订单量）',
  dataIndex: 'statCancelOrder'
}];


export default {tableData, tableHeader, colStat};
