// var arr = [] 
// 输入的内容是一个数字：排除是英文，中文等的情况 var pattern = /^[0-9]\d*/
// 使用事件委托

(function() {
	var arr = [],
		inputBtn = document.getElementById('inputBtn'),
		deleteBtn = document.getElementById('deleteBtn'),
		inputShow = document.getElementById('inputShow'),
		pattern = /^-?\d+$|^-?\d+(\.[0-9]+)?$/,	/*匹配的时候以数字开头，以数字结尾*/
		tips = document.getElementById('tips');

	inputBtn.addEventListener('click', function(event) {
		var order = event.target.dataset.order,
			inputString = document.getElementsByTagName('input').item(0).value,
			tempInputString = inputString.replace(/\s*/, '');

		if(tempInputString.match(pattern) == null) {
			tips.innerHTML = '请输入正确的数字';
		}else {
			tips.innerHTML = '';
			var order = event.target.dataset.order;
			handleFun(tempInputString, order);
			parseArr(arr);
		}

	}, false);

	deleteBtn.addEventListener('click', function(event) {
		var order = event.target.dataset.order;
		handleFun(null, order);
		parseArr(arr);
	}, false);

	inputShow.addEventListener('click', function(event) {
		var item = event.target.dataset.li,
		offset = parseInt(item);
		if(offset) {
			arr.splice(offset, 1);
			parseArr(arr);
		}

	}, false);

	function handleFun(input, order) {
		switch(order) {
			case 'leftin':  /*左侧入，是从数字的头部插入，是unshift*/
				arr.unshift(input);
				break;
			case 'rightin':  /*右侧入，是从数组的尾部插入，用push*/
				arr.push(input);
				break;
			case 'leftout':  /*左侧出，是从数组头部删除，用shift*/
				var leftout = arr.shift();
				alert('左侧出，移除元素 ' + leftout);
				break;
			case 'rightout':  /*右侧出，是从数组尾部删除，用pop*/
				var rightout = arr.pop();
				alert('右侧出，移除元素 ' + rightout);
				break;
		}
	}

	function parseArr(arr) {
		var tempHTML = '<ul>'
		for(var i = 0, lens = arr.length; i < lens; i++) {
			tempHTML += '<li data-li="'+i+'">' + arr[i] + '</li>';
		}
		tempHTML += '</ul>';
		inputShow.innerHTML = tempHTML;
	}
}())