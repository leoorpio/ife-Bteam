// var obj = [] 
// 通过时间委托

(function() {
	var obj = [],
		btn = document.getElementById('handleBtn');

	btn.addEventListener('click', function(event) {
		var order = event.target.dataset.order;
		var num = document.getElementsByTagName('input');
		if(num == NaN) {
			
		}
		switch(order) {
			case 'leftin': 
				function handle() {
					

				};
				break;
			case 'rightin': break;
			case 'leftout': break;
			case 'rightout': break;
		}
	});

	function temp(order) {

	}

}())