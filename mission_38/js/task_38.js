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
			for(var j = 0; j < this.courses.length; j++) {
				var c = this.courses[j];
				temp[c] = Math.floor(Math.random()*40 + 61);
			}
			this.form[stu] = temp;
			temp = null;
		};
		return this.form;
	}
};

Object.defineProperty(Classroom.prototype, 'constructor' , {
	enumerable: false,
	value: Classroom
});

var tableHTML = {
	id: 'table-grade',
	getTable: function(ele) {
		return document.getElementById(tableHTML.id);
	},
	getThead: function(ele) {
		return document.getElementById(tableHTML.id).tHead;
	},
	getTbody: function(ele) {
		return document.getElementById(tableHTML.id).tBodies.item(0);
	}	
};

var tHead = tableHTML.getThead();
var headRow = tHead.rows.item(0);
console.log(headRow);
var temp = '<ul><li><i class="iconfont icon-caret-up">&#xe65b;</i></li><li><i class="iconfont icon-caret-down">&#xe6be;</i></li></ul>';
headRow.innerHTML = '<th>姓名</th><th>语文'+temp+'</th><th>数学'+temp+'</th><th>英语'+temp+'</th><th>总分'+temp+'</th>';
// 生成成绩
function init() {
	var courses = ['语文','数学','英语'],students = ['A', 'B', 'C', 'D', 'E'];
	var classroom = new Classroom(courses, students);
	form = classroom.getScoreForm();
	console.log(form);
}

init();