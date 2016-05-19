/*
1.提供生成表格的接口，表格中的数据，表格样式尽量低耦合。
2.可以配置对哪些列支持排序功能，并在表头进行排序按钮的显示。
3.提供点击排序按钮后的响应接口，并提供默认的排序方法，当提供的接口没有具体实现时。
按默认的排序方法进行排序操作，并更新表格中的数据显示。
 */

/* 数据格式演示
var form = {
  "one": {
    "语文": 80,
    "数学": 80,
    "英语": 80,
    "总分": 240
  }
};
*/
var form = {};
var classA = {
	courses: ['语文','数学','英语'],
	students: ['A', 'B', 'C', 'D', 'E'],
}

function Classroom(courses, students) {
	this.courses = courses;
	this.students = students;	//学生不重名
	this.form = {};
};

Classroom.prototype = {
	constructor: Classroom,
	getScoreForm: function() {
		// 每个学生随机生成三个科目成绩
		for(var i = 0; i < this.students.length; i++) {
			var stu = this.students[i],
				temp = {};
			var sum = 0;
			for(var j = 0; j < this.courses.length; j++) {
				var c = this.courses[j];
				temp[c] = Math.floor(Math.random()*40 + 61);
				sum += temp[c];
			}
			temp['总分'] = sum;
			this.form[stu] = temp;
			temp = null;
			sum = 0;
		};
		return this.form;
	}
};

Object.defineProperty(Classroom.prototype, 'constructor', {
	enumerable: false,
	value: Classroom
});

// 表单元素相关属性、方法
var tableHTML = {
	id: 'table-grade',
	upCaretClass: '.icon-caret-up',
	downCaretClass: '.icon-caret-down',
	getTable: function(ele) {
		return document.getElementById(tableHTML.id);
	},
	getThead: function(ele) {
		return document.getElementById(tableHTML.id).tHead;
	},
	getTbody: function(ele) {
		return document.getElementById(tableHTML.id).tBodies.item(0);
	},
	renderThead: function(courses) {
		var headRow = tableHTML.getThead().rows.item(0);
		var temp = '<th>姓名</th>';
		for (var i = 0, lens = courses.length; i < lens; i++) {
		    temp += ('<th>' + courses[i] + '</th>');
		}
		temp = temp + '<th>总分</th>';
		headRow.innerHTML = temp;
	},
	renderTbody: function(courses, students) {
		var tBody = tableHTML.getTbody();
		// 遍历每一个学生
		for (var i = 0, slens = students.length; i < slens; i++) {
		    var student = students[i];
		    var row = tBody.insertRow(i); // 根据学生数插入行，返回插入行的引用，其中row后面还需要
		    var cell = row.insertCell(0);// 返回插入单元格引用
		    cell.innerHTML = student;

		    // 根据学生读取他的成绩单
		    var subjectScores = form[student];
		    // 根据课程从成绩单中获取分数
		    for(j = 0, clens = courses.length; j < clens; j++) {
		    	var score = subjectScores[courses[j]];
		    	var col = row.insertCell(j+1);  // 返回要插入单元格的引用，由于第一个单元格是学生姓名，所以需要从第二个单元格开始插入 j+1
		    	col.innerHTML = score;
		    }
		    row.insertCell(courses.length+1).innerHTML = subjectScores['总分']; // 取得其课程总分
		}
	},
	renderIconCaret: function() {
		var tHead = tableHTML.getThead();
		var row = tHead.rows.item(0); // 取得thead元素 第一行 tr
		var cells = row.cells;	// 取得所有th单元格
		for(var i = 1; i < cells.length; i++){
			cells.item(i).appendChild(insertEleUl());
		}
	},
	addIconListener: function() {
		// querySelectorAll返回的是类对象HTMLCollections
		var caretUp = document.querySelectorAll(tableHTML.upCaretClass);
		var caretDown = document.querySelectorAll(tableHTML.downCaretClass); 

		for(i = 0; i < caretUp.length; i++) {
			EventUtil.addHandler(caretUp[i], 'click', upOrder);			
		}

		for(j = 0; j < caretDown.length; j++) {
			EventUtil.addHandler(caretDown[j], 'click', downOrder);		
		}
	}
};

// 要插入的ul点击按钮元素
function insertEleUl() {
	var ul = document.createElement('ul');

	// 插入 上按钮
	var li_1 = document.createElement('li');
	var i_1 = document.createElement('i');
	i_1.className = 'iconfont icon-caret-up';
	i_1.innerHTML = '&#xe65b;';	//	i_1.appendChild(document.createTextNode('&#xe65b;'));	// 输出的时候，其中'&'会变成转义字符'&amp';
	li_1.appendChild(i_1);
	ul.appendChild(li_1);


	//插入 下按钮
	var li_2 = document.createElement('li');
	var i_2 = document.createElement('i');
	i_2.className = 'iconfont icon-caret-down';
	i_2.innerHTML = '&#xe6be;';
	li_2.appendChild(i_2);
	ul.appendChild(li_2);
	return ul;
};

// 排序up
function upOrder(event) {
	console.log('up');
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var orderCource = target.parentNode.parentNode.parentNode.firstChild.nodeValue; //取得th中 #text 文本值
	var tempArr = [], tempObj = [];
	for(var o in form) {
		var stuScores = form[o];
		tempObj.push(o);
		tempObj.push(stuScores[orderCource]);
		tempArr.push(tempObj);
		tempObj = [];
	}
	tempArr.sort(compareUp); // 由高到底排序
	var orderStu = [];
	for(var i = 0; i < tempArr.length; i++) {
		orderStu.push(tempArr[i][0]);
	}
	console.log(orderStu);
	classA.students = orderStu;
	tableHTML.getTbody().innerHTML = '';
	tableHTML.renderTbody(classA.courses, classA.students);
}
// 排序down
function downOrder(event) {
	console.log('down');
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var orderCource = target.parentNode.parentNode.parentNode.firstChild.nodeValue; //取得th中 #text 文本值
	var tempArr = [], tempObj = [];
	for(var o in form) {
		var stuScores = form[o];
		tempObj.push(o);
		tempObj.push(stuScores[orderCource]);
		tempArr.push(tempObj);
		tempObj = [];
	}
	tempArr.sort(compareDown); // 由高到底排序
	var orderStu = [];
	for(var i = 0; i < tempArr.length; i++) {
		orderStu.push(tempArr[i][0]);
	}
	console.log(orderStu);
	classA.students = orderStu;
	tableHTML.getTbody().innerHTML = '';
	tableHTML.renderTbody(classA.courses, classA.students);
}

// 排序的方法 
function compareUp(a, b) {
	return b[1] - a[1];
}

function compareDown(a, b) {
	return a[1] - b[1];
}

// 生成成绩
function init() {
	var classroom = new Classroom(classA.courses, classA.students);
	// 生成成绩表
	form = classroom.getScoreForm();
	// 生成表头
	tableHTML.renderThead(classA.courses);
	// 生成成绩单
	tableHTML.renderTbody(classA.courses, classA.students);
	// 生成排序点击按钮
	tableHTML.renderIconCaret();
	// 为按钮添加监听事件
	tableHTML.addIconListener();
	console.log(form);
}

init();

function getTh() {
	var tHead = tableHTML.getThead();
	var row = tHead.rows.item(0);
	var cell = row.cells;
	return cell;
}

console.log(getTh());