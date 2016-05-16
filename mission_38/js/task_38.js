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

Object.defineProperty(Classroom.prototype, 'constructor' , {
	enumerable: false,
	value: Classroom
});

// 获取表单元素方法
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
			console.log(cells.item(i));
		}
	}
};

// 生成成绩
function init() {
	var courses = ['语文','数学','英语'], students = ['A', 'B', 'C', 'D', 'E']; // 输入班级的课程，学生名字即可
	var classroom = new Classroom(courses, students);
	// 生成成绩表
	form = classroom.getScoreForm();
	// 生成表头
	tableHTML.renderThead(courses);
	// 生成成绩单
	tableHTML.renderTbody(courses, students);
	// 生成排序点击按钮
	tableHTML.renderIconCaret();
}

init();