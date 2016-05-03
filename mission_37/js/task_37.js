/**
 * authored by leoor
 * 2016年4月
 */

var	loginForm = document.getElementById('login-container'),
	form = document.getElementById('myForm'),
	button = form.getElementsByTagName('button')[0],	// 取得表单中button对象
	wrap = document.getElementById('wrapper'),
	layer = document.getElementById('layer');

var isSubmit = {
	state: ''
} 

EventUtil.addHandler(form, 'submit', formHandler);
EventUtil.addHandler(layer, 'click', wrapHandler);

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
	var temp = user + ', Enjoy your time here';
	layer.getElementsByTagName('span')[0].innerHTML = temp;
	return EventUtil.preventDefault(event);
}

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

function init() {
	button.disabled = false;
}

init();

// console.log('offsetHeight: '+layer.offsetHeight + '  offsetWidth: ' + layer.offsetWidth);
// console.log('offsetTop: '+layer.offsetTop + '  offsetLeft: ' + layer.offsetLeft);