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
var chart = document.getElementsByClassName('aqi-chart-wrap').item(0);

function renderChart() {
  var tempHtml = '',
      city = pageState.nowSelectCity,
      time = pageState.nowGraTime;
  if(city != -1 && time) {
      console.log('time: '+time);
      tempHtml = handleDate(time, city);
      chart.innerHTML = tempHtml;
  }
}

function handleDate(time, city) {
  var cityDate = aqiSourceData[city],
      count = 0,
      tempHtml = '';
  switch(time) {
    case 'day':
      console.log('-----day-----');
      for(var data in cityDate) {
        count++;
        tempHtml += '<div class="aqi-bar" style="height:'+cityDate[data]+'px; width:10px; background-color: #000;" title="'+data+'，空气污染指数：'+cityDate[data]+'"></div>';
      }
      count = 0;
      break;
    case 'week':
      console.log('-----week-----');
      var weekData = chartData[city].week,
          tempHtml = '';
      for(var i = 0, lens = weekData.length; i < lens; i++) {
        tempHtml += '<div class="aqi-bar" style="height:'+weekData[i]+'px; width:50px; background-color: #000;" title="第 '+(i+1)+' 周，周平均空气污染指数：'+weekData[i]+'"></div>';
      }
      break;
    case 'month':
      var monthData = chartData[city].month,
          tempHtml = '';
      for(var i = 0, lens = monthData.length; i < lens; i++) {
        tempHtml += '<div class="aqi-bar" style="height:'+monthData[i]+'px; width:100px; background-color: #000;" title="第 '+(i+1)+' 月，月平均空气污染指数：'+monthData[i]+'"></div>';
      }
      break;
  }
  return tempHtml;
}


/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
  // 确定是否选项发生了变化 
  event = EventUtil.getEvent(event);
  var target = EventUtil.getTarget(event);
  var type = target.value;
  // 设置对应数据
  if(type == pageState['nowGraTime']) {
    return;
  }else {
    switch(type) {
    case 'day':
      pageState['nowGraTime'] = 'day';
      break;
    case 'week':
      pageState['nowGraTime'] = 'week';
      break;
    case 'month':
      pageState['nowGraTime'] = 'month';
      break;
    }
    renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(event) {
  // 确定是否选项发生了变化 
  event = EventUtil.getEvent(event);
  var target = EventUtil.getTarget(event);
  var city = target.value;
  if(city == pageState['nowSelectCity']) {
    return;
  }else {
    // 设置对应数据
    pageState['nowSelectCity'] = city;
    // 调用图表渲染函数
    renderChart(); 
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = document.getElementsByName('gra-time');
  radio[0].checked = 'checked';
  for(var i = 0, len = radio.length; i < len; i++) {
    EventUtil.addHandler(radio[i], 'click', graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById('city-select');
  var temp = '<option value="-1">--请选择城市--</option>';
  for(var city in aqiSourceData) {
    temp += '<option value="'+city+'">'+city+'</option>';
  }
  citySelect.innerHTML = temp;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  EventUtil.addHandler(citySelect, 'click', citySelectChange);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据aqiSourceData处理成图表需要的数据格式
  for(var city in aqiSourceData) {
    var eachCityAqi = aqiSourceData[city],
        obj = {},
        week = new Array(), month = new Array(),
        sum = 0, count = 0, countLoop = 0;
    // week
    for(var date in eachCityAqi) {
      var dat = new Date(date),
          day = dat.getDay();
      // 以周日为判断标准，周一到周日为一个自然周，不足的按剩余的计算
      countLoop++;  // 记录循环次数
      if( day !== 0) { 
        // 1 2 3 4 5 6
        sum += eachCityAqi[date];
        count++;
      }else {
        // 0
        sum += eachCityAqi[date];
        count++;
        var d = Math.ceil(sum/count);
        week.push(d);
        count = 0;
        sum = 0;
      }
      // 保证最后一周的数据push进去
      if (countLoop === 91) {
        if (count !== 0) {
          var d = Math.ceil(sum/count);
          week.push(d);
          count = 0;
          sum = 0;
        }
      }
    }

    // month   
    var dateArray = Object.keys(eachCityAqi),
        monSum = 0, monCount = 0;
    for(var i = 0, lens = dateArray.length; i < lens; i++) {
      var mon = dateArray[i].slice(5, 7),
          dateArrayEle = dateArray[i];
      switch(mon) {
        case '01':
          monSum += eachCityAqi[dateArrayEle];
          monCount++;
          if(monCount == 31) {
            var m = Math.ceil(monSum/30);
            month.push(m);
            monSum = 0, monCount = 0; 
          }
          break;    
        case '02':
          monSum += eachCityAqi[dateArrayEle];
          monCount++;
          if(monCount == 29) {
            var m = Math.ceil(monSum/29); 
            month.push(m);
            monSum = 0, monCount = 0; 
          }
          break;    
        case '03':
          monSum += eachCityAqi[dateArrayEle];
          monCount++;
          if(monCount == 31) {
            var m = Math.ceil(monSum/31); 
            month.push(m);
            monSum = 0, monCount = 0; 
          }
          break;    
      }
    }
    obj.week =  week;
    obj.month = month;
    // 处理好的数据存到 chartData 中
    chartData[city] = obj;
    console.log(chartData);
    obj = null;
    week = null;
    month = null;
  }
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


