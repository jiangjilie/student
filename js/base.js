//write by gscmj@qq.com 转载必须保留此行
function $(id){return document.getElementById(id);}
function domnew(pobj,dtag,dclass,dtxt,domid){
		var obj=document.createElement(dtag);
		if(dtxt!=null)obj.innerHTML=dtxt;
		if(dclass!=null)obj.setAttribute("class",dclass);
		if(domid!=null)obj.setAttribute("id",domid);
		pobj.appendChild(obj);
		return obj;
}


function getUrlValue(key,defaultvalue){//从url中取参数
	if(defaultvalue==null)defaultvalue="";
    var str=window.location.search;
    str = str.substring(1, str.length);
    var arr = str.split("&");
    var find=0;
    //var obj = new Object();
    for (var i = 0; i < arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        var tmp_key=decodeURIComponent(tmp_arr[0]);
        //obj[tmp_key] = decodeURIComponent(tmp_arr[1]);
        if(tmp_key==key)return decodeURIComponent(tmp_arr[1]);
    }
    //if(find==1)return obj[key];
    return defaultvalue;
}

function ajax(url,postdata,ajaxfun,outtype){//outtype:json or text blob      ajax封装
	if(outtype==null)outtype='json';
	var myajax = new XMLHttpRequest();
	myajax.open(postdata==null?'GET':'POST',url,true);
	if(outtype=='blob')myajax.responseType='blob';
	myajax.addEventListener('load', function() {
		if(outtype=='blob'){
			return myajax.response;
		}
		var rtxt=myajax.responseText;
		if(outtype=='json'){
			var jobj=JSON.parse(rtxt);
			ajaxfun(jobj);
		}else{
			ajaxfun(rtxt);
		}
	});
	if(postdata==null)
		myajax.send();
	else
		myajax.send(postdata);
}

function showtable_old(bddiv,jobj,pgfun,rowfun,showcheck,classkey){//显示表格 bd是容器
	//此模块已经弃用，请使用 tableClass代替
	bddiv.innerHTML='';
	var tbdiv=domnew(bddiv,"div");
	var tb=domnew(tbdiv,"table");
	var thead=domnew(tb,"thead");
	var tr=domnew(thead,"tr");
	if(showcheck==true){
		let ckbox=domnew(domnew(tr,"td"),"input");
		ckbox.setAttribute('type','checkbox');
		ckbox.onclick=function(){
			var cks=document.getElementsByName('ckbox');
			for(let i=0;i<cks.length;i++)cks[i].checked=this.checked;
		};
	}
	
	for(var i=0;i<jobj.head.length;i++){
		domnew(tr,"td",null,jobj.head[i]);
	}
	var tbody=domnew(tb,"tbody");
	for(var i=0;i<jobj.data.length;i++){
		tr=domnew(tbody,"tr");
		if(showcheck==true){
			let cktd=domnew(tr,"td");
			let ckbox=domnew(cktd,"input");
			ckbox.setAttribute('type','checkbox');
			ckbox.setAttribute('name','ckbox');
			ckbox.onclick=function(e){
				e.cancelBubble=true;
			};
		}
		for(var j=0;j<jobj.head.length;j++){
			domnew(tr,"td",null,jobj.data[i][j]);
		}
		tr.setAttribute('data-id',jobj.data[i][0]);//ID
		if(rowfun!=null)tr.onclick=function(){
			rowfun(this.getAttribute('data-id'));
		};
		if(classkey!=null)tr.setAttribute('class','row'+jobj.data[i][classkey]);
	}
	var page=jobj.page;
	var pgdiv=domnew(bddiv,'div','pgdiv');
	var allpg=Math.ceil(jobj.allts/jobj.pagesize);
	domnew(pgdiv,'span',null,jobj.pagesize+'条/页,共'+jobj.allts+'条'+allpg+'页,当前第'+page+"页 ");
	var pgfirst=domnew(pgdiv,'span','pgbtn','首页');
	var pgpre=domnew(pgdiv,'span','pgbtn','上一页');
	var pgnext=domnew(pgdiv,'span','pgbtn','下一页');
	var pgend=domnew(pgdiv,'span','pgbtn','尾页');
	var pgxls=domnew(pgdiv,'span','pgbtn','导出xls');
	if(pgfun!=null){
		pgfirst.onclick=function(){pgfun(1);};
		pgpre.onclick=function(){pgfun(page-1);};
		pgnext.onclick=function(){pgfun(page+1);};
		pgend.onclick=function(){pgfun(allpg);};
		pgxls.onclick=function(){pgfun(-1);};//生成电子表格
	}
}


//作用：将data与dom双向绑定
//parentbox:必填，数据将绑定在其子dom中
//data:必填，待绑定数据
//changefun:选填，数据改变后的回调函数，带两个参数(key,value)
//其它返回数据：
//   B.data：用户修改后的数据（也是入口数据）
//   B.doms： 绑定成功后的所有dom集合
function bindClass(parentbox,data,changefun){
	var B=this;
	if(parentbox.parentbox!=null){
		B.data=parentbox.data;
		B.parentbox=parentbox.parentbox;
		B.changefun=parentbox.changefun;
	}else{
		B.data=data;
		B.parentbox=parentbox;
		B.changefun=changefun;
	}
	//B.i=0;
	
	B.doms={};

	B.setvalue=function(obj,val){
		switch(obj.tagName){
			case 'INPUT':
				obj.value=val;
				obj.onchange=function(){
					let k_v=this.getAttribute('data-cmj').split(':');
					if(k_v[0]=='v'){
						obj.basedata[k_v[1]]=this.value;
						if(B.changefun)B.changefun(k_v[1],this.value);
					}
				};
				break;
			case 'IMG':
			case 'VIDEO':
			case 'AUDIO':
				obj.src=val;
				break;
			default:
				obj.innerHTML=val;
				break;
		}	
	};

	B.BingTags=function(objs,sdata){
		if(objs==null)return;
		for(let i=0;i<objs.length;i++){
			let currobj=objs[i];
			if(currobj.getAttribute && currobj.getAttribute('data-cmj')){
				let k_v=currobj.getAttribute('data-cmj').split(':');
				if(k_v[0]=='v' && sdata[k_v[1]]!=null)B.setvalue(currobj,sdata[k_v[1]]);
			}
		}
	}
	B.BingObj=function(pobj,sdata,doms){
		let currobj=pobj;
		if(currobj.getAttribute && currobj.getAttribute('data-cmj')){
			let k_v=currobj.getAttribute('data-cmj').split(':');			
			if(k_v[0]=='v' && sdata[k_v[1]]!=null){
				currobj.basedata=sdata;
				doms[k_v[1]]=currobj;
				B.setvalue(currobj,sdata[k_v[1]]);return;
			}
			if(k_v[0]=='l'){//循环
				doms[k_v[1]]=[];
				let tobj=currobj.children[0];
				doms[k_v[1]]['base']=tobj;
				pobj.removeChild(tobj);
				if(sdata[k_v[1]]!=null && sdata[k_v[1]].length>0){
					for(let j=0;j<sdata[k_v[1]].length;j++){
						tobj=doms[k_v[1]]['base'].cloneNode(true);pobj.appendChild(tobj);
						doms[k_v[1]].push({});
						B.BingObj(tobj,sdata[k_v[1]][j],doms[k_v[1]][j]);
					}
				}
				return;
			}			
		}
		for(let i=0;i<pobj.children.length;i++){B.BingObj(pobj.children[i],sdata,doms);}
	}

	if(B.parentbox==null){//全文查找
		B.tags=['DIV','SPAN','INPUT','IMG','VIDEO','AUDIO'];
		for(let i=0;i<B.tags.length;i++)B.BingTags(document.getElementsByTagName(B.tags[i]),B.data);
	}else{
		B.BingObj(B.parentbox,B.data,B.doms);
	}
	return B;
}


//btnfun 中间行按钮事件  headfun 首行按钮事件  pagefun 翻页事件
function tableClass(parentbox,data,extdata,btnfun,headfun,pagefun,showtype,finishfun){
	var T=this;

	if(parentbox.parentbox!=null){
		T.parentbox=parentbox.parentbox;
		T.data=parentbox.data;
		T.ext=parentbox.extdata;
		T.btnfun=parentbox.btnfun;//行内按钮回调
		T.headfun=parentbox.headfun;
		T.pagefun=parentbox.pagefun;
		T.showtype=parentbox.showtype;
		T.finishfun=parentbox.finishfun;//完成后的回调函数(obj)
	}else{
		T.parentbox=parentbox;
		T.data=data;
		T.ext=extdata;
		T.btnfun=btnfun;//行内按钮回调
		T.headfun=headfun;
		T.pagefun=pagefun;
		T.showtype=showtype;
		T.finishfun=finishfun;
	}
	
	if(T.showtype==null){
		T.showtype=0;//列表
		if(document.body.clientWidth<500)T.showtype=1; //小于500为手机,以方块形式显示
	}
	
	if(T.ext==null)T.ext={};
	if(T.ext.cls==null)T.ext.cls={};
	
	
	let defaultcls={//默认样式
	table:'mo-tab',//表格
	
	labeldiv:'mo-tables-label', //标签
	labelline:'mo-label-line',//普通行
	labelcmd:'mo-label-cmd',//标签中的命令行
	labeltitle:'mo-label-title',//标签中的标题
	labelvalue:'mo-label-value',//标签中的值
	labelimg:'mo-label-img',//标签中的图片div
	
	inputbox:'mo-forms-text',//输入框
	pagebox:'mo-pages',//分页行
	pagebtn:'mo-btns sm',//分页按钮
	pageinfo:'mo-pageinfo',//总页数信息
	pageinput:'mo-pageinput',//输入页码
	headbtn:'mo-btns btns-normal',//顶部按钮(也是默认按钮)
	
	findbtn:'mo-btns btns-normal',
	linebtn:'mo-btns btns-normal-line sm'
	}
	for(let keyc in defaultcls){
		if(!T.ext.cls[keyc])T.ext.cls[keyc]=defaultcls[keyc];
	}

	
	T.parentbox.innerHTML='';
	T.headdiv=domnew(T.parentbox,'div');//首行按钮
	T.headdiv.style.textAlign='left';
	
	let fdiv=domnew(T.headdiv,'div');
	fdiv.setAttribute('style','display: inline-block;float: left; margin: 5px;');
	
	let fdiv1=domnew(fdiv,'div');
	let fdiv2=domnew(fdiv,'div');
	fdiv1.style='display:inline-block;';
	fdiv2.style='display:inline-block;white-space:nowrap;';
	
	T.addsearch=function(pobj,key,value){
		if(value==null)value='';
		if(key==null)key='';
		let sobj=domnew(pobj,'div');
		sobj.style.display='inline-block';
		sobj.style.margin='3px';
		let skbox=domnew(sobj,'select',T.ext.cls.inputbox);
		for(let i=0;i<T.data.findkeys.length;i++){
			let ftxt=T.data.findkeys[i];
			if(ftxt.indexOf('.')>0)ftxt=ftxt.substr(ftxt.indexOf('.')+1);
			var o=domnew(skbox,'option',null,T.data.head[ftxt]);
			o.value=T.data.findkeys[i];
			if(key=='')key=o.value;
			if(o.value==key)o.selected=true;
		}
		let ikbox=domnew(sobj,'input',T.ext.cls.inputbox);//输入查找关键字
		ikbox.setAttribute('type','search');
		ikbox.value=value;
		ikbox.style.width='100px';
	}

	if(T.data.findkeys!=null){
		if(T.data.find==null)T.data.find=[];
		if(T.data.find.length<=0){
			T.addsearch(fdiv1);
		}else{
			for(let i=0;i<T.data.find.length;i++){
				T.addsearch(fdiv1,T.data.find[i].key,T.data.find[i].value);
			}
		}
		let addbtn=domnew(fdiv2,'button',T.ext.cls.findbtn,'+');
		addbtn.style.margin='3px';
		addbtn.onclick=function(){T.addsearch(this.parentNode.parentNode.childNodes[0]);};
		
		let fbtn=domnew(fdiv2,'button',T.ext.cls.findbtn,'查找');
		fbtn.style.margin='3px';
		fbtn.onclick=function(){
			T.data.find=[];
			let s=this.parentNode.parentNode.childNodes[0];
			for(let i=0;i<s.childNodes.length;i++){
				let k=s.childNodes[i].childNodes[0].value;
				let v=s.childNodes[i].childNodes[1].value;
				if(k==null)k='';if(v==null)v='';
				if(v!='' && k!=''){
					T.data.find.push({key:k,value:v});
				}
			}
			//T.data.findkey=this.parentNode.parentNode.childNodes[0].childNodes[0].value;
			//T.data.findvalue=this.parentNode.parentNode.childNodes[0].childNodes[1].value;
			if(T.pagefun!=null)T.pagefun(this,1);
		};
		if(T.showtype==1)fdiv.style.display='block';
	}
	
	let stypebtn=domnew(fdiv2,'button',T.ext.cls.findbtn);
	stypebtn.style.margin='3px';
	if(T.showtype==1)stypebtn.innerHTML='表格';else stypebtn.innerHTML='标签';
	stypebtn.onclick=function(){
		if(T.showtype==1){
			T.show(0);
			this.innerText='标签';
		}else{
			T.show(1);
			this.innerText='表格';
		}
	};
	
	if(T.ext.headbtns!=null){
		let bdiv=domnew(T.headdiv,'div');
		bdiv.setAttribute('style','display: inline-block;float: right; margin: 5px;');

		for(let i=0;i<T.ext.headbtns.length;i++){
			let headcls=T.ext.headbtns[i].cls;
			if(headcls==null)headcls=T.ext.cls.headbtn;//没有提供单独的样式，使用默认的
			let btn=domnew(bdiv,'button',headcls,T.ext.headbtns[i].txt);
			btn.setAttribute('data-index',i);
			btn.style.marginRight='5px';
			if(T.headfun!=null)btn.onclick=function(){
				let ids=[];
				if(T.showtype==1){//标签式
					for(let j=0;j<T.bodydiv.childNodes.length;j++){
						if(T.bodydiv.childNodes[j].lastElementChild.childNodes[0].childNodes[0].checked==true){
							ids.push(T.bodydiv.childNodes[j].getAttribute('data-id'));
						}
					}
				}else{//表格式
					for(let j=0;j<T.body.childNodes.length;j++){
						if(T.body.childNodes[j].childNodes[0].childNodes[0].checked==true){
							ids.push(T.body.childNodes[j].getAttribute('data-id'));
						}
					}
				}
				T.headfun(this,this.getAttribute('data-index'),ids);
			};
		}
		if(T.showtype==1)bdiv.style.display='block';
	}
	
	T.bodydiv=domnew(T.parentbox,'div');
	T.bodydiv.style.clear='both';
	T.bodydiv.style.width='100%';
	T.footobj={};
	T.footobj.btns=[];
	
	if(T.data.currpg!=null){
		T.footdiv=domnew(T.parentbox,'div',T.ext.cls.pagebox);
		let bs=['首页','上一页','下一页','尾页','导出'];
		let ps=[1,T.data.currpg-1,T.data.currpg+1,T.data.allpg,-1];
		for(let i=0;i<bs.length;i++){
			let b=domnew(T.footdiv,'span',T.ext.cls.pagebtn,bs[i]);
			T.footobj.btns.push(b);
			b.style.marginRight='5px';
			//b.setAttribute('data-pg',ps[i]);
			if(T.pagefun!=null)b.onclick=function(){T.pagefun(this,this.getAttribute('data-pg'));};
		}
		
		T.footobj.info=domnew(T.footdiv,'span',T.ext.cls.pageinfo);
		T.footobj.info.style.whiteSpace="nowrap";
		T.footobj.info.innerHTML='共';
		T.footobj.alltsobj=domnew(T.footobj.info,'span',null,T.data.allts);
		T.footobj.info.insertAdjacentHTML('beforeend','条，');
		T.footobj.allpgobj=domnew(T.footobj.info,'span',null,T.data.allpg);
		T.footobj.info.insertAdjacentHTML('beforeend','页 ，当前第 ');
		let dqbox=domnew(T.footobj.info,'input',T.ext.cls.pageinput);
		T.footobj.pginput=dqbox;
		dqbox.value=T.data.currpg;
		dqbox.style.width='60px';
		dqbox.onkeypress=function(e){
			if(e.keyCode==13){
				T.pagefun(this,this.value);
			}
		};
		T.footobj.info.insertAdjacentHTML('beforeend','页。');
	}
	
	T.showpages=function(){//显示分页
		//T.footobj.info.innerHTML='共'+T.data.allts+'条，'+T.data.allpg+'页 ，当前第 ';
		T.footobj.alltsobj.innerText=T.data.allts;
		T.footobj.allpgobj.innerText=T.data.allpg;
		let ps=[1,T.data.currpg-1,T.data.currpg+1,T.data.allpg,-1];
		for(let i=0;i<ps.length;i++){
			T.footobj.btns[i].setAttribute('data-pg',ps[i]);
		}
		T.footobj.pginput.value=T.data.currpg;
	};
	
	T.showhead=function(){
		let cbox=domnew(domnew(T.head,'th'),'input');
		cbox.type='checkbox';
		for(let key in T.data.head){
			if(T.data.head[key]=='')continue; //无效head
			let h=domnew(T.head,'th',null,T.data.head[key]);
			h.setAttribute('data-key',key);
			h.onclick=function(){
				if(T.data.orderby==this.getAttribute('data-key')){
					if(T.data.ordertype=='desc'){
						T.data.ordertype='asc';
					}else{
						T.data.ordertype='desc';
					}
				}else{
					T.data.orderby=this.getAttribute('data-key');
				}
				if(T.pagefun!=null)T.pagefun(this,T.data.currpg);
			}
		}
		if(T.ext.linebtns!=null)domnew(T.head,'th',null,'操作');
		cbox.onchange=function(){
			let ck=this.checked;
			for(let i=0;i<T.body.childNodes.length;i++)T.body.childNodes[i].childNodes[0].childNodes[0].checked=ck;
		};
	};
	
	T.showbody=function(){
		for(let i=0;i<T.data.data.length;i++){
			let tr=domnew(T.body,'tr');
			let row={dom:tr,cells:[]};
			T.rows.push(row);
			let cbox=domnew(domnew(tr,'td'),'input');
			cbox.type='checkbox';
			for(let key in T.data.head){
				if(T.data.head[key]=='')continue; //无效head
				let td=domnew(tr,'td',null,T.data.data[i][key]);
				row.cells[key]={dom:td};
			}
			tr.setAttribute('data-id',T.data.data[i].id);
			
			if(T.ext.linebtns!=null){
			let btntd=domnew(tr,'td');
			row.cells['opt']={dom:btntd,btns:[]};
			for(let x=0;x<T.ext.linebtns.length;x++){
				let linecls=T.ext.linebtns[x].cls;
				if(linecls==null)linecls=T.ext.cls.linebtn;//没有提供按钮样式
				let btn=domnew(btntd,'span',linecls,T.ext.linebtns[x].txt);
				row.cells['opt'].btns.push(btn);
				btn.setAttribute('data-id',T.data.data[i].id);
				btn.setAttribute('data-index',x);
				btn.style.marginRight='4px';
				if(T.btnfun!=null){
					btn.onclick=function(){T.btnfun(this,this.getAttribute('data-index'),this.getAttribute('data-id'));};
				}
			}		
			}			
		}
	};

	T.showlable=function(){//以标签方式显示
		T.bodydiv.innerHTML='';
		for(let i=0;i<T.data.data.length;i++){
			let box=domnew(T.bodydiv,'div',T.ext.cls.labeldiv);
			box.style.display='inline-block';
			box.style.border='1px #ccc solid';
			box.setAttribute('data-id',T.data.data[i].id);
			let row={dom:box,cells:[]};
			T.rows.push(row);
			if(T.data.pickey!=null){
				let picurl=T.data.data[i][T.data.pickey];
				if(picurl==null)picurl='';
				if(picurl=='')picurl="http://base.s.rcqjy.com/img/defaultPic.png";
				domnew(box,'img',T.ext.cls.labelimg).src=picurl;
			}
			for(let key in T.data.head){
				if(T.data.head[key]=='')continue; //无效head
				let line=domnew(box,'div',T.ext.cls.labelline);
				domnew(line,'span',T.ext.cls.labeltitle,T.data.head[key]+":");
				let td=domnew(line,'span',T.ext.cls.labelvalue,T.data.data[i][key]);
				row.cells[key]={dom:td};
			}
			
			if(T.ext.linebtns!=null){//标签中的隐藏按钮
			let btnl=domnew(box,'div',T.ext.cls.labelcmd);
			btnl.style.display='none';
			let xzdiv=domnew(btnl,'div');
			xzdiv.style.textAlign='left';
			let xz=domnew(xzdiv,'input');
			xz.type='checkbox';
			xz.onchange=function(){
				if(this.checked==true){
					this.parentNode.parentNode.parentNode.style.backgroundColor='rgb(6,142,255,.1)';
				}else{
					this.parentNode.parentNode.parentNode.style.backgroundColor='#f9f9f9';
				}
			};
			domnew(xzdiv,'span',null,'选择');
			let btns=domnew(btnl,'div');
			btns.style.textAlign='right';
			row.cells['opt']={dom:btns,btns:[]};
			for(let x=0;x<T.ext.linebtns.length;x++){
				let linecls=T.ext.linebtns[x].cls;
				if(linecls==null)linecls=T.ext.cls.pagebtn;//没有提供按钮样式
				let btn=domnew(btns,'span',linecls,T.ext.linebtns[x].txt);
				row.cells['opt'].btns.push(btn);
				btn.style.marginRight='5px';
				btn.setAttribute('data-id',T.data.data[i].id);
				btn.setAttribute('data-index',x);
				if(T.btnfun!=null){
					btn.onclick=function(){
						T.btnfun(this,this.getAttribute('data-index'),this.getAttribute('data-id'));
					};
				}
			}
			box.onclick=function(){
				let dvalue=this.lastElementChild.style.display;
				for(let i=0;i<T.bodydiv.childNodes.length;i++){
					T.bodydiv.childNodes[i].lastElementChild.style.display='none';
				}
				if(dvalue=='none')
					this.lastElementChild.style.display='';
				else
					this.lastElementChild.style.display='none';
			};
			}
		}
	}

	T.showtable=function(){
		T.bodydiv.innerHTML='';
		T.table=document.createElement('table');
		T.table.style.width='100%';
		T.table.setAttribute('class',T.ext.cls.table);
		T.head=domnew(domnew(T.table,'thead'),'tr');
		T.body=domnew(T.table,'tbody');
		T.showhead();
		T.showbody();
		T.bodydiv.appendChild(T.table);
	}
	
	T.makeurl=function(burl,pg){//返回模块的URL
		let url=burl;
		if(pg==null)pg=T.data.currpg;
		if(url.indexOf('?')>=0)url+='&'; else url+='?';
		url=url+'currpg='+pg;
		url=url+'&orderby='+T.data.orderby;
		url=url+'&ordertype='+T.data.ordertype;
		if(T.data.find){
			let keys=[];
			let vals=[];
			for(let i=0;i<T.data.find.length;i++){
				keys.push(T.data.find[i].key);
				vals.push(T.data.find[i].value);
			}
			if(keys.length>0){
				url=url+'&findkeys='+keys.join(',');
				url=url+'&findvalues='+encodeURIComponent(vals.join(','));
			}
		}
		return url;
	}
	
	T.show=function(showtype){
		T.rows=[];//{cells[],cls,dom}
		T.showtype=showtype;
		if(showtype==1){
			T.showlable();
		}else{
			T.showtable();
		}
		if(T.data.currpg!=null)T.showpages();
		if(T.finishfun)T.finishfun(T);
	};
	T.show(T.showtype);
	return T;
}


function editClass(parentbox,data,extdata,buttons,btnfun,changefun,title){
	var E=this;
	if(parentbox.parentbox!=null){
		E.parentbox=parentbox.parentbox;
		E.data=parentbox.data;
		E.extdata=parentbox.extdata;
		E.buttons=parentbox.buttons;
		E.changefun=parentbox.changefun;
		E.btnfun=parentbox.btnfun;
		E.title=parentbox.title;//标题
	}else{
		E.parentbox=parentbox;
		E.data=data;
		E.extdata=extdata;
		E.buttons=buttons;
		E.changefun=changefun;
		E.btnfun=btnfun;
		E.title=title;
	}
	
	if(E.data.type==null)E.data.type={};
	if(E.data.data==null)E.data.data={};
	if(E.extdata==null)E.extdata={cls:{}};
	if(E.buttons==null)E.buttons=[{txt:'保存'}];
	
	let defaultcls={
		selectbox:'mo-select-box',
		head:'mo-edit-head',
		headtitle:'mo-edit-head-title',
		headclose:'mo-edit-head-close',
		bodymain:'mo-edit-box',
		body:'mo-edit-body', //row2两列
		btn:'mo-btns btns-normal',
		btncancle:'mo-btns btns-black',
		labelbox:'mo-forms-li',
		labelbody:'mo-edit-label-body',
		labelhead:'mo-forms-label',		
		labelfoot:'mo-edit-label-foot',
		labelinput:'mo-forms-text full',
		labeltextarea:'mo-forms-textarea full row3',
		labelimg:'mo-edit-img',
		labelfulltxt:'mo-edit-fulltxt',
		labelcheckbox:'mo-edit-check-box',
		labelcheck:'mo-edit-check'
	}
	
		if(!E.extdata.cls.selectbox)E.extdata.cls.selectbox=defaultcls.selectbox;
		if(!E.extdata.cls.body)E.extdata.cls.body=defaultcls.body;
		if(!E.extdata.cls.btn)E.extdata.cls.btn=defaultcls.btn;
		if(!E.extdata.cls.labelbox)E.extdata.cls.labelbox=defaultcls.labelbox;
		if(!E.extdata.cls.labelbody)E.extdata.cls.labelbody=defaultcls.labelbody;
		if(!E.extdata.cls.labelhead)E.extdata.cls.labelhead=defaultcls.labelhead;
		if(!E.extdata.cls.labelfoot)E.extdata.cls.labelfoot=defaultcls.labelfoot;
		if(!E.extdata.cls.labelinput)E.extdata.cls.labelinput=defaultcls.labelinput;
		if(!E.extdata.cls.labeltextarea)E.extdata.cls.labeltextarea=defaultcls.labeltextarea;
		if(!E.extdata.cls.labelimg)E.extdata.cls.labelimg=defaultcls.labelimg;
		if(!E.extdata.cls.labelfulltxt)E.extdata.cls.labelfulltxt=defaultcls.labelfulltxt;
		if(!E.extdata.cls.labelcheckbox)E.extdata.cls.labelcheckbox=defaultcls.labelcheckbox;
		if(!E.extdata.cls.labelcheck)E.extdata.cls.labelcheck=defaultcls.labelcheck;
		if(!E.extdata.cls.bodymain)E.extdata.cls.bodymain=defaultcls.bodymain;

		if(!E.extdata.cls.headtitle){
			E.extdata.cls.head=defaultcls.head;
			E.extdata.cls.headtitle=defaultcls.headtitle;
			E.extdata.cls.headclose=defaultcls.headclose;
			E.extdata.cls.btncancle=defaultcls.btncancle;
		}else{
			E.extdata.cls.labelcancle=E.extdata.cls.btn;
		}
	
	E.edit={};
	
	function extSelect(pobj,value,sdata){
		var S=this;
		S.data=sdata;
		S.value=value;
		S.index=0;
		S.box=domnew(pobj,'div');
		S.inputbox=domnew(domnew(S.box,'div'),'input',E.extdata.cls.labelinput);
		S.selectbox=domnew(S.box,'div',E.extdata.cls.selectbox);
		S.box.style.position='relative';	
		S.selectbox.style.position="absolute";
		S.selectbox.style.display='none';
		S.selectbox.style.zIndex='999';
		S.onchange=null;
		S.setvalue=function(v){
			S.value=v;
			if(S.onchange!=null)S.onchange();
		}
		S.showvalueoftext=function(v){
			for(let i=0;i<S.data.length;i++){
				if(S.data[i].value==v)S.inputbox.value=S.data[i].txt;
			}
		}
		S.inputbox.onclick=function(){
			if(S.selectbox.style.display=='none'){
				S.selectbox.style.display='';
				S.selectallshow();
			}else
				S.selectbox.style.display='none';
		};
		S.inputbox.onkeyup=function(){
			S.selectbox.style.display='';
			let v=S.inputbox.value;
			if(v==''){S.selectallshow();return;}
			for(let i=0;i<S.selectbox.childNodes.length;i++){
				let o=S.selectbox.childNodes[i];
				if(o.innerText.indexOf(v)>=0){
					o.style.display='';
					if(o.innerText==v)S.setvalue(o.getAttribute('data-value'));
				}else{
					o.style.display='none';
				}
			}
		};
		
		S.selectallshow=function(){//显示全部选项
			for(let i=0;i<S.selectbox.childNodes.length;i++){
				S.selectbox.childNodes[i].style.display='';
			}
		};
		S.selectbox.onmouseleave=function(e){
			this.style.display='none'; //let s = e.fromElement || e.relatedTarget; let reg = this.compareDocumentPosition(s);
			S.showvalueoftext(S.value);
		};
		S.show=function(){
			S.selectbox.innerHTML='';
			for(let i=0;i<S.data.length;i++){
				let o=domnew(S.selectbox,'div',null,S.data[i].txt);
				o.setAttribute('data-value',S.data[i].value);
				o.setAttribute('data-index',i);
				if(S.data[i].value==S.value){
					S.index=i;
					S.inputbox.value=S.data[i].txt;
				}
				o.onclick=function(){
					S.value=this.getAttribute('data-value');
					S.inputbox.value=this.innerText;
					S.selectbox.style.display='none';
					S.setvalue(this.getAttribute('data-value'));
				}
			}
		}
		S.show();
		return S;
	}
	
	E.datachange=function(obj,key,value){//数据
		if(E.data.type[key].checkurl){
			ajax(E.data.type[key].checkurl,JSON.stringify({key:key,value:value}),function(jobj){
				if(jobj.code!=200){
					alert(jobj.msg);obj.style.color='red';
				}else{
					obj.style.color=null;
				}
					
			});
		}
		if(E.changefun!=null)E.changefun(obj,key,value);
	}
	E.show=function(){
		E.parentbox.innerHTML='';
		//console.log(E.extdata.cls);
		E.body0=domnew(E.parentbox,'div',E.extdata.cls.bodymain);
		
		//if(E.extdata.cls.head){
			E.titlebox=domnew(E.body0,'div',E.extdata.cls.head);
			domnew(E.titlebox,'div',E.extdata.cls.headtitle,E.title);
			domnew(E.titlebox,'div',E.extdata.cls.headclose).onclick=function(){E.remove();};
		//}
		
		E.body=domnew(E.body0,'div',E.extdata.cls.body);
		E.body0.setAttribute('style','position:fixed;top:0;left:0;width:100%;height:100%;z-index:1055;overflow-x: hidden;background-color:rgba(0,0,0,0.5);')
		E.body.setAttribute('style','background-color:#fff;');
		
		
		
		
		
		for(let key in E.data.head){
			if(E.data.head[key]=='')continue; //无效head
			if(E.data.type[key]==null)E.data.type[key]={};
			if(E.data.type[key].tag==null)E.data.type[key].tag='input';
			if(E.data.type[key].tag=='input' && E.data.type[key].type==null)E.data.type[key].type='text';
			if(E.data.type[key].required==null)E.data.type[key].required=true;
			E.edit[key]={};
			
			let lab=domnew(E.body,'div',E.extdata.cls.labelbox);
			let redstar='';
			if(E.data.type[key].required==true)redstar=' <span style="color:red;">*</span>';
			let labhead=domnew(lab,'div',E.extdata.cls.labelhead,E.data.head[key]+redstar+" :");
			let labbody=domnew(lab,'div',E.extdata.cls.labelbody);
			
			
			if(E.data.type[key].tag=='input' && E.data.type[key].type=='checkbox'){
				E.edit[key].dom=domnew(labbody,'div');
				E.reWriteCheckBox(key);
				continue;
			}
			
			if(E.data.type[key].tag=='fulltxt'){//富文本
				if(E.data.data[key]==null)E.data.data[key]='';
				let fulltxt=null;
				try{
					fulltxt=new fulltxtClass(labbody,E.data.data[key],key,function(htxt){
						E.data.data[fulltxt.key]=htxt;
						E.datachange(fulltxt.body.dom,fulltxt.key,htxt);
						if(fulltxt.files.length>0){//有文件上传
							if(!E.data.data.extupfiles)E.data.data.extupfiles={};
							if(!E.data.data.extupfiles[fulltxt.key])E.data.data.extupfiles[fulltxt.key]=[];
							for(let i=0;i<fulltxt.files.length;i++){
								let f=fulltxt.files[i];
								E.data.data.extupfiles[fulltxt.key].push(f);
							}
						}
					},E.data.type[key].upurl);
				}catch(e){}
				if(fulltxt==null){
					let labinput=domnew(labbody,'div');
					E.edit[key].dom=labinput;
					labinput.setAttribute('data-key',key);
					labinput.contentEditable=true;
					labinput.setAttribute('class',E.extdata.cls.labelfulltxt);
					labinput.innerHTML=E.data.data[key];
					labinput.onblur=function(){
						let key=this.getAttribute('data-key');
						if(E.data.data[key]!=this.innerHTML){
							E.data.data[key]=this.innerHTML;
							E.datachange(this,key,this.innerHTML);
						}
					};
				}
				continue;
			}
			
			if(E.data.type[key].tag=='select' && E.data.type[key].search){
				if(E.data.data[key]==null && E.data.type[key].select.length>0){
					E.data.data[key]=E.data.type[key].select[0].value;
				}
				let labinput=new extSelect(labbody,E.data.data[key],E.data.type[key].select);
				E.edit[key].dom=labinput.box;
				labinput.onchange=function(){
					E.data.data[key]=this.value;
					E.datachange(this,key,this.value);
				}
				continue;
			}
			
			if(E.data.type[key].tag=='files'){//批量上传文件
				E.edit[key].dom=domnew(labbody,'div');
				E.edit[key].file=[];
				let labfilesbtn=domnew(E.edit[key].dom,'button',E.extdata.cls.btn,'添加文件');
				let labfileslistold=domnew(E.edit[key].dom,'div');//原有的文件
				let labfileslist=domnew(E.edit[key].dom,'div');
				labfilesbtn.setAttribute('data-key',key);
				
				if(E.data.data[key]==null)E.data.data[key]=[];
				for(let i=0;i<E.data.data[key].length;i++){
					let ft=domnew(E.edit[key].dom.childNodes[1],'div');
						ft.setAttribute('data-key',key);
						let a=domnew(ft,'a',null,E.data.data[key][i].oldname);
						a.href=E.data.data[key][i].url;
						a.setAttribute('target','_blank');
						domnew(ft,'span',null,'【删除】').onclick=function(){
							let key=this.parentNode.getAttribute('data-key');
							let i=0;
							for(i=0;i<this.parentNode.parentNode.childNodes.length;i++){
								if(this.parentNode.parentNode.childNodes[i]==this.parentNode)break;
							}
							E.data.data[key].splice(i,1);
							this.parentNode.parentNode.removeChild(this.parentNode);
						};
				}
				
				labfilesbtn.onclick=function(){
					let key=this.getAttribute('data-key');
					let fbox=document.createElement('input');
					fbox.type='file';
					fbox.setAttribute('data-key',key);
					fbox.setAttribute('multiple','multiple');
					fbox.onchange=function(){
						let key=this.getAttribute('data-key');
						for(let i=0;i<this.files.length;i++){	
							E.edit[key].file.push(this.files[i]);
							let ft=domnew(E.edit[key].dom.childNodes[2],'div');
							ft.setAttribute('data-key',key);
							let a=domnew(ft,'a',null,this.files[i].name);
							a.href=URL.createObjectURL(this.files[i]);
							a.setAttribute('target','_blank');
							domnew(ft,'span',null,'【删除】').onclick=function(){
								let key=this.parentNode.getAttribute('data-key');
								let i=0;
								for(i=0;i<this.parentNode.parentNode.childNodes.length;i++){
									if(this.parentNode.parentNode.childNodes[i]==this.parentNode)break;
								}
								E.edit[key].file.splice(i,1);
								this.parentNode.parentNode.removeChild(this.parentNode);
							};
						}
						console.log(E);
					};
					fbox.click();
				}
				
				continue;
			}
			
			//前置处理完毕
			
			let labinput=domnew(labbody,E.data.type[key].tag);
			
			
			E.edit[key].dom=labinput;
			labinput.setAttribute('data-key',key);
			
			if(E.data.type[key].tag=='input'){
				if(E.data.type[key].type!=null)labinput.type=E.data.type[key].type;
				if(['text','password','datetime','datetime-local'].indexOf(E.data.type[key].type)>=0){
					if(E.data.data[key]==null)E.data.data[key]='';
					if(E.data.type[key].placeholder!=null)labinput.setAttribute("placeholder",E.data.type[key].placeholder);
					if(E.data.type[key].type=='datetime-local'){
						labinput.value=E.data.data[key].replace(' ','T');
					}else{
						labinput.value=E.data.data[key];
					}
					labinput.setAttribute('class',E.extdata.cls.labelinput);
					labinput.onchange=function(){
						let key=this.getAttribute('data-key');
						let v=this.value;
						if(this.type=='datetime-local')v=v.replace('T',' ');
						E.data.data[key]=v;
						E.datachange(this,key,v);
					};
				}
			}

			if(E.data.type[key].tag=='textarea'){
				if(E.data.data[key]==null)E.data.data[key]='';
				if(E.data.type[key].rows==null)E.data.type[key].rows=3;
				if(E.data.type[key].placeholder!=null)labinput.setAttribute("placeholder",E.data.type[key].placeholder);
				labinput.setAttribute('rows',E.data.type[key].rows);
				labinput.value=E.data.data[key];
				labinput.setAttribute('class',E.extdata.cls.labeltextarea);
				labinput.onchange=function(){
					let key=this.getAttribute('data-key');
					E.data.data[key]=this.value;
					E.datachange(this,key,this.value);
				};
				
			}

			if(E.data.type[key].tag=='select'){
				if(!E.data.type[key].select)E.data.type[key].select=[];
				if(E.data.data[key]==null && E.data.type[key].select.length>0){
					E.data.data[key]=E.data.type[key].select[0].value;
				}
				labinput.setAttribute('class',E.extdata.cls.labelinput);
				if(E.data.data[key]==null && E.data.type[key].select.length>0){
					E.data.data[key]=E.data.type[key].select[0].value;
				}				
				
				for(let i=0;i<E.data.type[key].select.length;i++){
					let o=domnew(labinput,'option',null,E.data.type[key].select[i].txt);
					o.value=E.data.type[key].select[i].value;
					if(o.value==E.data.data[key])o.selected=true;
				}
				labinput.onchange=function(){
					let key=this.getAttribute('data-key');
					E.data.data[key]=this.value;
					E.datachange(this,key,this.value);
				};
			}
			if(E.data.type[key].tag=='img'){
				if(E.data.data[key]==null)E.data.data[key]='';
				labinput.setAttribute('class',E.extdata.cls.labelimg);
				let picurl=E.data.data[key];
				if(picurl=='' || picurl==null)picurl='http://base.s.rcqjy.com/img/defaultPic.png';
				labinput.src=picurl;
				labinput.style.maxWidth='95%';
				labinput.onclick=function(){
					let key=this.getAttribute('data-key');
					let fbox=document.createElement('input');
					fbox.type='file';
					fbox.setAttribute('data-key',key);
					fbox.onchange=function(){
						if(this.files.length>0){
							let key=this.getAttribute('data-key');
							E.edit[key].file=[this.files[0]];
							E.edit[key].dom.src=URL.createObjectURL(this.files[0]);
						}
					};
					fbox.click();
				};
			}
		}
		let labsave=domnew(E.body,'div',E.extdata.cls.labelfoot);
		//labsave.style.textAlign='right';
		for(let i=0;i<E.buttons.length;i++){
			let btn=domnew(labsave,'button',E.extdata.cls.btn,E.buttons[i].txt);
			btn.setAttribute('data-index',i);
			btn.style.marginRight='5px';
			btn.onclick=function(){E.btnfun(this,this.getAttribute('data-index'));};
		}
		let btncancle=domnew(labsave,'button',E.extdata.cls.btncancle,'取消');
		btncancle.onclick=function(){E.remove();};
		domnew(E.body,'div').style.clear='both';
	};
	E.remove=function(){
		E.parentbox.innerHTML='';
		delete E;
	}
	E.reWriteCheckBox=function(key){
		E.edit[key].dom.innerHTML='';
		E.edit[key].doms=[];
		let cv=[];
		if(E.data.data[key]!=null)cv=E.data.data[key].split(',');
		for(let i=0;i<E.data.type[key].select.length;i++){
			let ckbox=domnew(E.edit[key].dom,'span',E.extdata.cls.labelcheckbox);
			let ck=domnew(ckbox,'input',E.extdata.cls.labelcheck);
			ckbox.style.marginLeft='7px';
			ckbox.style.whiteSpace="nowrap";
			ck.type="checkbox";
			ck.style.marginRight='3px';
			ck.value=E.data.type[key].select[i].value;
			ckbox.insertAdjacentHTML('beforeend',E.data.type[key].select[i].txt);
			ck.setAttribute('data-key',key);
			for(let j=0;j<cv.length;j++){
				if(cv[j]==ck.value)ck.checked=true;
			}
			E.edit[key].doms.push(ck);
			ck.onclick=function(){
				let key=this.getAttribute('data-key');
				let cv=[];
				for(let k=0;k<E.edit[key].doms.length;k++){
					if(E.edit[key].doms[k].checked==true)cv.push(E.edit[key].doms[k].value);
				}
				E.data.data[key]=cv.join(',');
				E.datachange(this,key,E.data.data[key]);
			};
		}
	}
	
	
	
	E.uploadfile=function(upurl,files,f,start,tname,upok){
		if(files.length<=0)return [];
		if(f==0 && start==0)E.fileoktmp=[];//临时上传成功文件
		let file=files[f];
		let psize=1024*1024;
		if(psize>file.size-start)psize=file.size-start;
		if(psize<=0){upok(null);return;}
		
		let blob = file.slice(start, start+psize);
		let xhr = new XMLHttpRequest();
		xhr.addEventListener('load', function() {
			let rtxt=xhr.responseText;
			let jobj=JSON.parse(rtxt);
			if(jobj.result=='ok'){			
				tname=jobj.tname;
				if(jobj.filestate==0)
					E.uploadfile(upurl,files,f,start+psize,tname,upok);
				else{
					E.fileoktmp.push(jobj.data);
					f++;
					if(f<files.length){	
						E.uploadfile(upurl,files,f,0,'',upok);
					}else{
						upok(E.fileoktmp);
					}
					return;
				}
			}else{
				alert(jobj.msg);
			}
		});
	    xhr.open("POST", upurl+"&oldname="+encodeURIComponent(file.name)+"&start="+start+"&fsize="+file.size+"&tname="+tname);
	    xhr.send(blob);
	};
	
	E.extdomAdd=function(key,tagName,className,itxt){//为输入框添加额外的dom key tagName必选
		let tmpobj=E.edit[key].dom.parentNode;
		return domnew(tmpobj,tagName,className,itxt);
	};
	
	E.inputok=function(finshfun){//finshfun 输入完成后的回调函数
		let errtxt='';
		for(let key in E.edit){
			if(E.data.type[key].required==true){
				if(E.edit[key].file==null){
					if(E.data.data[key]===null || E.data.data[key]===''){
						errtxt=errtxt+E.data.head[key]+'是必填数据，不允许为空！\r\n';
					}
				}
			}
		}
		if(errtxt!=''){alert(errtxt);return;}
		
		for(let key in E.edit){
			if(E.edit[key].file!=null && E.edit[key].file.length>0 && E.data.type[key].upurl!=null){
				E.uploadfile(E.data.type[key].upurl,E.edit[key].file,0,0,'',function(data){
					if(data.length<=0)return;
					if(E.data.type[key].tag=='img')
						E.data.data[key]=data[0].url;
					else{
						for(let d=0;d<data.length;d++)E.data.data[key].push(data[d]);
					}
					//console.log(E.data.data[key],data);
					E.edit[key].file=null;
					E.inputok(finshfun);
				});
				return;
				/*
				let filesok=[];
				console.log(E.edit[key].file);
				for(let i=0;i<E.edit[key].file.length;i++){
				E.uploadfile(E.data.type[key].upurl,E.edit[key].file[i],0,'',function(file,jobj){
					if(file==null){alert('上传文件'+E.edit[key].file.name+'失败！');return;}
					filesok.push(jobj.data.filename);
				});
				}
				console.log(filesok);
				
				E.data.data[key]=filesok.join(',');
				console.log(E.data.data[key]);
				E.edit[key].file=null;
				E.inputok(finshfun);
				return;//有文件上传
				*/
			}

		}
		finshfun(E.data.data);
	};
	
	E.show();
	return E;
}



//树状列表
//labfun 选中后的回调
function treeClass(parentbox,data,extdata,geturl,labfun){//geturl为预留数据请求地址
	let T=this;
	if(parentbox.parentbox!=null){
		T.parentbox=parentbox.parentbox;
		T.data=parentbox.data;
		T.extdata=parentbox.extdata;
		geturl=parentbox.geturl;
		T.labfun=parentbox.labfun;
	}else{
		T.parentbox=parentbox;
		T.data=data;
		T.extdata=extdata;
		T.labfun=labfun;
	}
	
	T.parentbox.innerHTML='';
	if(T.extdata==null)T.extdata={};
	if(T.extdata.cls==null)T.extdata.cls={};
	
	let defaultcls={
		treeul:null,
		treediv:'mo-tree',
		content:null,
		
		arrowmore:'more', //设置了此项以后，设置以下项目失效
		arrow:'nor',
		arrowshow:'more show',
		findinput:'mo-forms-text'
	}
	
	if(!T.extdata.cls.treediv)T.extdata.cls.treediv=defaultcls.treediv;
	if(!T.extdata.cls.arrow)T.extdata.cls.arrow=defaultcls.arrow;
	if(!T.extdata.cls.arrowmore){
		T.extdata.cls.findinput=defaultcls.findinput;
		T.extdata.cls.arrowshow=defaultcls.arrowshow;
		T.extdata.cls.arrow=defaultcls.arrow;
		T.extdata.cls.arrowmore=defaultcls.arrowmore;
	}
	
	
	T.findbox=domnew(T.parentbox,'div');
	T.body=domnew(domnew(T.parentbox,'div',T.extdata.cls.treediv),'ul',T.extdata.cls.treeul);
	
	
	T.dofind=function(key){
		T.body.innerHTML='';
		if(key==''){
			T.show(T.data.pid,T.body);
		}else{
			for(let i=0;i<T.data.data.length;i++){
				if(T.data.data[i].txt.indexOf(key)>=0){
					let havechild=0;
					li=domnew(T.body,'li',T.extdata.cls.treeli);
					li.setAttribute('data-id',T.data.data[i].id);
					
					if(T.extdata.cls.arrowshow){
						sjx=domnew(li,'span',T.extdata.cls.arrow);
					}else{
						sjx=domnew(li,'span',T.extdata.cls.arrow,'▷');
					}
					
					let t=domnew(li,'span',T.extdata.cls.content,T.data.data[i].txt);
					t.onclick=function(){
						T.labfun(this,this.parentNode.getAttribute('data-id'),this.innerText);
					}
					for(j=0;j<T.data.data.length;j++){
						if(T.data.data[j].pid==T.data.data[i].id)havechild=1;
					}
					if(havechild==1){
						if(T.extdata.cls.arrowshow){
							sjx.setAttribute('class',T.extdata.cls.arrowmore);
						}else{
							sjx.innerText='▶';
						}
						sjx.onclick=function(){T.showchild(this);};
					}					
				}
			}
		}
	}
	T.show=function(pid,obj){//obj必须为ul
		let havechild=0;
		let li=null,sjx=null;
		for(let i=0;i<T.data.data.length;i++){
			if(T.data.data[i].id==pid){
				li=domnew(obj,'li',T.extdata.cls.treeli);
				li.setAttribute('data-id',T.data.data[i].id);
				if(T.extdata.cls.arrowshow){
					sjx=domnew(li,'span',T.extdata.cls.arrow);
				}else{
					sjx=domnew(li,'span',T.extdata.cls.arrow,'▷');
				}
				let t=domnew(li,'span',T.extdata.cls.content,T.data.data[i].txt);
				t.onclick=function(){
						T.labfun(this,this.parentNode.getAttribute('data-id'),this.innerText);
				}
			}
			if(T.data.data[i].pid==pid)havechild=1;
		}
		if(li==null)return;
		
		if(havechild==1){
			if(T.extdata.cls.arrowshow){
				sjx.setAttribute('class',T.extdata.cls.arrowmore);
			}else{
				sjx.innerText='▶';
			}
			sjx.onclick=function(){T.showchild(this);};
		}
	}
	T.showchild=function(obj){
		if(obj.innerText=='▶' || (T.extdata.cls.arrowshow && obj.getAttribute('class')==T.extdata.cls.arrowmore)){
				if(T.extdata.cls.arrowshow){
					obj.setAttribute('class',T.extdata.cls.arrowshow);
				}else{
					obj.innerText='▼';
				}
				let ul=domnew(obj.parentNode,'ul',T.extdata.cls.treeul);
				for(let i=0;i<T.data.data.length;i++){
					if(T.data.data[i].pid==obj.parentNode.getAttribute('data-id')){		
						T.show(T.data.data[i].id,ul);
					}
				}					
		}else{
			if(T.extdata.cls.arrowshow){
				obj.setAttribute('class',T.extdata.cls.arrowmore);
			}else{
				obj.innerText='▶';
			}
			obj.parentNode.removeChild(obj.parentNode.childNodes[2]);
		}		
	}
	T.findbox.style.paddingLeft='10%';
	let findinput=domnew(T.findbox,'input',T.extdata.cls.findinput);
	findinput.style.width="80%";
	findinput.placeholder='请输入关键字查找';
	findinput.onkeyup=function(){
		if(this.value!='')T.dofind(this.value);else T.show(T.data.pid,T.body);
	};
	
	if(T.data.pid<=0){
		for(let i=0;i<T.data.data.length;i++){
			if(T.data.data[i].pid==0){
				//console.log(T.data.data[i].id);
				T.show(T.data.data[i].id,T.body);
			}
		}
	}else{
		T.show(T.data.pid,T.body);
	}
}
