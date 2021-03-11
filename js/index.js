window.onload = main;
console.log('Обработчик установлен');
function main(){

	console.log('Картинки загружены');
	var body = $('body');
	var mode1 = $('.m1');
	var mode2 = $('.m2');
	var mode3 = $('.m3');
	var circle = $('#circle');
	var sky = $('#sky');
	var hArr = $('#h-arrow');
	var mArr = $('#m-arrow');
	var numbersEl = $('.numbers');
	var rotate = $('#numbers');
	var hScroll = $('#h-scroll input');
	var mScroll = $('#m-scroll input');

	var hDegrees = mDegrees = hmDegrees = 0;
	var hPrev = 0;
	var degAdd = 0;

	var numbersContent = numbersEl.text();
	var numbers = numbersContent.split(':',2);
	numbers[0] = +numbers[0];
	numbers[1] = +numbers[1];
	console.log(numbers);

	var arrCenter = circle.offset();
	arrCenter.left += 200;// для вращения мышкой
	arrCenter.top += 200;
	var skyCenter = sky.offset();
	skyCenter.left += 175;// для вращения
	skyCenter.top += 175;

	var mode = 2;
	mode1.on('click',function(e){
		e.target.style.background = 'Coral';
		mode = 1;
		offButton(mode2.find('button'));
		offButton(mode3.find('button'));
		hArr.on('mousedown', arrMouseDown);
		mArr.on('mousedown', arrMouseDown);
		hScroll.unbind('input',scrollShowNumber);
		mScroll.unbind('input',scrollShowNumber);
		hScroll.unbind('input',scrollRotateArrow);
		mScroll.unbind('input',scrollRotateArrow);
		//сделать скролл недоступным
	});
	mode2.on('click',function(e){
		e.target.style.background = 'Coral';
		mode = 2;
		offButton(mode1.find('button'));
		offButton(mode3.find('button'));
		hArr.on('mousedown', arrMouseDown);
		mArr.on('mousedown', arrMouseDown);
		hScroll.on('input',scrollShowNumber);
		mScroll.on('input',scrollShowNumber);
		hScroll.on('input',scrollRotateArrow);
		mScroll.on('input',scrollRotateArrow);
	});
	mode3.on('click',function(e){
		e.target.style.background = 'Coral';
		mode = 3;
		offButton(mode1.find('button'));
		offButton(mode2.find('button'));
		hArr.unbind('mousedown', arrMouseDown);
		mArr.unbind('mousedown', arrMouseDown);
		hScroll.on('input',scrollShowNumber);
		mScroll.on('input',scrollShowNumber);
		hScroll.on('input',scrollRotateArrow);
		mScroll.on('input',scrollRotateArrow);
	});

	function arrMouseDown(e){
		console.log('mousedown pageX: ' + e.pageX + ' pageY: ' + e.pageY);
		e.preventDefault();// чтоб стрелка не перетаскивалась
		if(e.target.id === 'h-arrow'){
			body.on('mousemove',hArrRotate);
			body.on('mouseup',function(e){
				body.unbind('mousemove',hArrRotate);
				body.unbind('mousedown',arrMouseDown);
			});
		}
		if(e.target.id === 'm-arrow'){
			body.on('mousemove',mArrRotate);
			body.on('mouseup',function(e){
				body.unbind('mousemove',mArrRotate);
				body.unbind('mousedown',arrMouseDown);
			});
		}	
	}

	function hArrRotate(e){
		console.log('arrRotate pageX: ' + e.pageX + ' pageY: ' + e.pageY);
		var deg = calcDeg(e.pageX, e.pageY, arrCenter.left, arrCenter.top);
		hArr.css("transform","rotate(" + deg + "deg)");
		console.log('hPrev: ' + hPrev + ' deg: ' + deg);
		if(hPrev>8 && hPrev<12 && deg>=0 && deg<90){degAdd = 360;}//12-13
		if(hPrev>20 && hPrev<24 && deg>=0 && deg<90){degAdd = 0;}//23-0
		if(hPrev>=12 && hPrev<16 && deg>270 && deg<360){degAdd = 0;}//13-12
		if(hPrev>=0 && hPrev<4 && deg>270 && deg<360){degAdd = 360;}//0-24
		arrShowNumber('h',deg+degAdd);
		arrShowScroll('h',deg+degAdd);
		arrSkyRotate(deg+degAdd);
	}

	function mArrRotate(e){
		console.log('arrRotate pageX: ' + e.pageX + ' pageY: ' + e.pageY);
		var deg = calcDeg(e.pageX, e.pageY, arrCenter.left, arrCenter.top);
		mArr.css("transform","rotate(" + deg + "deg)");
		arrShowNumber('m',deg);
		arrShowScroll('m',deg);
	}

	function calcDeg(x,y,x0,y0){
		var deg; // градусы поворота стрелки, а не как в тригонометрии
		if(x == x0){
			if(y>y0){deg = 180;}
			if(y<=y0){deg = 0;}
		}else{
			deg = Math.atan((y0-y)/(x-x0))*180/Math.PI;
			if(x>x0){deg = 90-deg;}
			if(x<x0){deg = 270-deg;}
		}
		return deg;
	}

	function offButton(target){
		target.css("background","LimeGreen");
	}

	function scrollShowNumber(){
		numbers[0] = ('' + hScroll.val()).padStart(2,'0');
		numbers[1] = ('' + mScroll.val()).padStart(2,'0');
		numbersContent = numbers.join(':');
		console.log(numbersContent);
		numbersEl.text(numbersContent);
	}

	function arrShowNumber(arr,deg){
		if(arr === 'h'){
			var hours = Math.floor(deg/30);
			numbers[0] = ('' + hours).padStart(2,'0');
			hPrev = hours;//запомина старое значение
			console.log('hPrev ' + hPrev);
		}
		if(arr === 'm'){
			var minutes = Math.floor(deg/6);
			numbers[1] = ('' + minutes).padStart(2,'0');
		}
		numbersContent = numbers.join(':');
		numbersEl.text(numbersContent); 
	}

	function arrShowScroll(arr,deg){
		if(arr === 'h'){
			var hours = Math.floor(deg/30);
			hScroll.val(hours);
		}
		if(arr === 'm'){
			var minutes = Math.floor(deg/6);
			mScroll.val(minutes);
		}
		numbersContent = numbers.join(':');
		numbersEl.text(numbersContent);
	}

	function scrollRotateArrow(e){
		console.log('rotateArrow');
		if(e.target.id === 'hInput'){//нужно повернуть часовую стрелку
			hDegrees = e.target.value * 30;
			console.log('Часовая ' + e.target.value + ' на ' + hDegrees + hmDegrees + ' гадусов');
			hArr.css("transform","rotate(" + (hmDegrees + hDegrees) + "deg)");
			arrSkyRotate(hmDegrees + hDegrees);
		};
		if(e.target.id === 'mInput'){//нужно повернуть часовую стрелку
			mDegrees = e.target.value * 6;
			hmDegrees = e.target.value * 0.5;
			console.log('Минутная ' + e.target.value + ' на ' + mDegrees + ' гадусов');
			console.log('Часовая дополнительно на ' + hmDegrees + ' гадусов');
			mArr.css("transform","rotate(" + mDegrees + "deg)");
			hArr.css("transform","rotate(" + (hmDegrees + hDegrees) + "deg)");
			arrSkyRotate(hmDegrees + hDegrees);
		};
	}

	function arrSkyRotate(deg){
		sky.css("transform","rotate(" + (deg/2+180) + "deg)");
	}

}//main



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}