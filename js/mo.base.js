/******
Updated On 2023/02/08
By Luweimo
******/

//响应式移动端生成导航按钮
onload = function () {
	let body = document.querySelector('.mo-header');
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

//对话框
let dialogs = {
	init: function (opt) {
		this.option = {
			tip: "提示",
			content: "提示内容",
			okbtn: {
				html: "确定",
				fn: function () { }
			},
			cancelbtn: {
				html: "取消",
				fn: function () { }
			}
		}
		if (!this.box) {
			this.create()
		} else {
			this.show()
		}
		this.extend(opt)
		this.bindData()
		this.bindEvevt()
	},
	extend: function (opt) {
		for (let i in opt) {
			this.option[i] = opt[i]
		}
	},
	hide: function () {
		this.box.style.display = "none"
	},
	show: function () {
		this.box.style.display = "block"
	},
	bindEvevt: function () {
		let that = this
		this.okbtn.onclick = function () {
			that.option.okbtn.fn()
			that.hide()
		}
		this.cancelbtn.onclick = function () {
			that.option.cancelbtn.fn()
			that.hide()
		}
	},
	bindData: function () {
		this.header.innerHTML = this.option.tip
		this.content.innerHTML = this.option.content
		this.okbtn.innerHTML = this.option.okbtn.html
		this.cancelbtn.innerHTML = this.option.cancelbtn.html
	},
	create: function () {
		this.box = document.createElement("div")
		this.box.className = "mo-dialogs sm"
		this.top1 = document.createElement("div")
		this.top1.className = "mo-dialogs-box"
		this.box.appendChild(this.top1)
		this.top2 = document.createElement("div")
		this.top2.className = "dialogs-top"
		this.top1.appendChild(this.top2)
		this.header = document.createElement("div")
		this.header.className = "dialogs-tit"
		this.header.innerHTML = "提示"
		this.top2.appendChild(this.header)
		this.content = document.createElement("div")
		this.content.innerHTML = "提示内容"
		this.content.className = "dialogs-cot"
		this.top1.appendChild(this.content)
		this.footer = document.createElement("div")
		this.footer.className = "dialogs-btn"
		this.top1.appendChild(this.footer)
		this.okbtn = document.createElement("button")
		this.okbtn.className = "mo-btns btns-normal min"
		this.okbtn.innerHTML = "ok"
		this.footer.appendChild(this.okbtn)
		this.cancelbtn = document.createElement("button")
		this.cancelbtn.className = "mo-btns btns-black"
		this.cancelbtn.innerHTML = "no"
		this.footer.appendChild(this.cancelbtn)
		document.body.appendChild(this.box)
	}
}
