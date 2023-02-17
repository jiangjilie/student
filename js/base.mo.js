/******
更新于2023/02/07
******/

//响应式移动端生成导航按钮

onload = function () {
	let body = document.querySelector('body');
	let nav = document.createElement('a');
	//创建导航按钮
	nav.className = 'mo-mob-nav-a';
	let user = document.createElement('a');
	//创建用户信息按钮
	user.className = 'mo-mob-user-a';
	let close = document.createElement('a');
	//创建关闭按钮
	close.className = 'mo-mob-close-a';
	body.appendChild(nav);
	body.appendChild(user);

	let userbox = document.getElementsByClassName('mo-userinfo')[0];
	let navbox = document.getElementsByClassName('nav')[0];
	let leftbox = document.getElementsByClassName('mo-left')[0];
	//按钮点击
	nav.onclick = function () {
		menuLeftHidden=1;
		navbox.style.left = '0';
		leftbox.style.left = '35%';
		body.appendChild(close);
		body.removeChild(nav);
		body.removeChild(user);
	}
	user.onclick = function () {
		userbox.style.right = '0';
		body.appendChild(close);
		body.removeChild(nav);
		body.removeChild(user);
	}
	//关闭按钮
	close.onclick = function () {
		menuLeftHidden=0;
		navbox.style.left = '-35%';
		leftbox.style.left = '-100%'
		userbox.style.right = '-100%'
		body.removeChild(close);
		body.appendChild(nav);
		body.appendChild(user);
	}
}


//message消息提示
function messages(type, position, txt) {
	//type指提示类型-----  normal 常规 , success 成功 , warn 警告 , error 错误
	//position指提示框显示位置---  cen 居中 , top 居上
	//txt指文字内容
	let body = document.querySelector('body');
	let mes = document.createElement('div');
	mes.className = 'mo-message';
	mes.innerHTML = `<div class="message-box">${txt}</div>`;
	if (position == 'cen') {
		switch (type) {
			case 'normal':
				mes.className = 'mo-message cen';
				break;
			case 'success':
				mes.className = 'mo-message success cen';
				break;
			case 'warn':
				mes.className = 'mo-message warn cen';
				break;
			case 'error':
				mes.className = 'mo-message error cen';
				break;
		}
	}
	else if (position == 'top') {
		switch (type) {
			case 'normal':
				mes.className = 'mo-message';
				break;
			case 'success':
				mes.className = 'mo-message success';
				break;
			case 'warn':
				mes.className = 'mo-message warn';
				break;
			case 'error':
				mes.className = 'mo-message error';
				break;
		}
	}
	body.appendChild(mes);
	//提示框3秒后自动消失
	setTimeout(() => {
		body.removeChild(mes);
	}, 3000)
}


// function dialogs(title, txt, btns) {
// 	let body = document.querySelector('body');
// 	let dia = document.createElement('div');
// 	dia.className = 'mo-dialogs sm';
// 	dia.innerHTML = `<div class="mo-dialogs-box">
// 						<div class="dialogs-top">
// 							<div class="dialogs-tit">${title}</div>
// 							<div class="dialogs-close" onclick="hideDia()"></div>
// 						</div>
// 						<div class="dialogs-cot">
// 							<p>${txt}</p>
// 						</div>
// 						<div class="dialogs-btn">
// 							<button class="mo-btns btns-normal min" id="confirm">确认</button>
// 							<button class="mo-btns btns-black" onclick="hideDia()">取消</button>
// 						</div>
// 					</div>`;

// 	body.appendChild(dia);
// }