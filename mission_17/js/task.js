/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

var EventUtil = {
  addHandler: function(element, type, handler) {
    if(element.addEventListener) {
      element.addEventListener(type, handler, false);
    }else if(element.attachEvent) {
      element.attachEvent("on"+type, handler);
    }else {
      element["on" + type] = handler;
    }
  },

  getEvent: function(event) {
    return event ? event : window.event;
  },
  getTarget: function(event) {
    return event.target || event.srcElement;
  }
}

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();      // 取得四位数的年份
    var m = dat.getMonth() + 1;     // 取得日期中的月份，其中0表示一月
    m = m < 10 ? '0' + m : m;       // 如果月份是小于10，个位数前面补“0”
    var d = dat.getDate();          // 返回日期月份中的天数（1到31）
    d = d < 10 ? '0' + d : d;       // 如果天数小于10，个位数前面补“0”
    return y + '-' + m + '-' + d;   // 返回字符串日期
}
/**
 * [randomBuildData 随机数据]
 * @param  {integer} seed  
 * @return {object} 
 * Math.random()返回大于等于0小于1的一个随机数。   
 */
function randomBuildData(seed) {
    var returnData = {};        // 创建一个存储日期的对象
    var dat = new Date("2016-01-01");   // 设置日期
    var datStr = '';                // 创建一个字符串类型 datStr
    for (var i = 1; i < 92; i++) {  // 循环91次  一月31天 2月29天  三月31天
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);   // 小数值舍入为正数的方法Math.ceil():执行向上舍入，即它总是向上舍入为最接近的整数;
        dat.setDate(dat.getDate() + 1);   // 日期月份中的天数+1
    }
    return returnData;
}

// aqiSourceData对象中每个key都是一个returnData对象，保存有91天的数值。
var date1 = new Date();
var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
var date2 = new Date();
console.log(date2-date1);
console.log(aqiSourceData);

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
  // 确定是否选项发生了变化 
  console.log('touch me');
  console.log(event);
  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = document.getElementsByName('gra-time');
  for(var i = 0, len = radio.length; i < len; i++) {
    EventUtil.addHandler(radio[i], 'click', graTimeChange);
  }

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();