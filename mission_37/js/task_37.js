/**
 * authored by leoor
 * 2016年4月
 */

var Leoor = {};

Leoor.getElement = function(el) {
	return document.getElementById(el) || document.getElementsByTagName(el);
}

var	loginForm = Leoor.getElement('login-container'),
	form = Leoor.getElement('myForm'),
	button = Leoor.getElement('button')[0],	// 取得表单中button对象
	wrap = Leoor.getElement('wrapper'),
	layer = Leoor.getElement('layer');

var isSubmit = {
	state: ''
} 

EventUtil.addHandler(form, 'submit', formHandler);
EventUtil.addHandler(layer, 'click', wrapHandler);
EventUtil.addHandler(window, 'resize', function(event) {
	placedMiddle(layer);
});

function formHandler(event) {
	var event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	// 取得按钮
	var btn = target.elements['submit-button'];

	// 取得用户名
		user = target.elements['user'].value;
	// 禁用它
	btn.disabled = true;
	wrap.removeAttribute('class');
	btn.innerText = '登录ing...';
	// 浮出层居中显示
	placedMiddle(layer);

	var temp = user + ', Enjoy your time here';
	layer.getElementsByTagName('span')[0].innerHTML = temp;

	return EventUtil.preventDefault(event);
}

/*浮出层处理函数，确定提交表单；取消则重新加载页面*/
function wrapHandler(event) {
	var event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	isSubmit.state = target.name;
	switch(isSubmit.state) {
		case 'yes':
			form.submit();
			break;
		case 'no':
			location.reload();
			break;
	}
}


/*浮出层居中显示*/
function placedMiddle(el) {
// 取得页面视口的大小
var pageWidth = document.documentElement.clientWidth,
	pageHeight = document.documentElement.clientHeight;
// 获取元素的大小：注意，这个需要元素是可见的
	elWidth = el.offsetWidth,
	elHeight = el.offsetHeight,
	elLeft = (pageWidth - elWidth)/2,
	elTop = (pageHeight - elHeight)/2;
	el.style.left = elLeft + 'px';
	el.style.top = elTop + 'px';
}

/*单击浮出层登录框外层 取消本次登录 */
EventUtil.addHandler(wrap, 'click', function(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);

	if(target === wrap) {
		isSubmit.state = 'false';
		location.reload();
	}
})

/*拖动浮出层*/
var moveElement = document.getElementsByClassName('layer-header')[0],
	mouse = {
	preOffsetX: 0,
	preOffsetY: 0
};

EventUtil.addHandler(moveElement, 'mousedown', mouseDown);
EventUtil.addHandler(moveElement, 'mouseup', mouseUp);

function mouseDown(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var pageX = event.pageX,
		pageY = event.pageY;

	if(pageX === undefined) {
		pageX = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
	}

	if(pageY === undefined) {
		pageY = event.clientY + (document.body.scrollLeft || document.documentElement.scrollTop); 
	}

	mouse.preOffsetX = pageX - layer.offsetLeft;
	mouse.preOffsetY = pageY - layer.offsetTop;

	EventUtil.addHandler(moveElement, 'mousemove', mouseMove);
}

function mouseMove(event) {
	var pageX = event.pageX,
		pageY = event.pageY;

	if(pageX === undefined) {
		pageX = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
	}

	if(pageY === undefined) {
		pageY = event.clientY + (document.body.scrollLeft || document.documentElement.scrollTop); 
	}

	curLeft = pageX - mouse.preOffsetX;
	curTop = pageY - mouse.preOffsetY;
	layer.style.left = curLeft + 'px';
	layer.style.top = curTop + 'px';	
}	

function mouseUp(event) {
	EventUtil.removeHandler(moveElement, 'mousemove', mouseMove);
}

function init() {
	button.disabled = false;
}

init();

