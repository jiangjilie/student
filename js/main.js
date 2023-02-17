//菜单调用函数

function getmyinfo(){            //获取顶部菜单
    ajax('../api/main.php?act=getmyinfo',null,function(jobj){
        $('nav').innerHTML='';
        let data = jobj.data;
        for(let k in data){
            let n=domnew($('nav'),'a',null,data[k].name);
            n.setAttribute('class','cd');
            n.setAttribute('href','javascript:;');
            n.setAttribute('id',data[k].id);
        }
        let yj=document.getElementsByClassName('cd');         //顶部菜单切换样式
        for(let i=0;i<yj.length;i++){
            yj[i].onmouseover=function(){
                this.classList.add('active');
            }
            yj[i].onclick=function(){
                this.classList.add('active');
                //点击显示侧边菜单
                // alert(this.id);
                let pid = this.id;
                ajax('../api/main.php?act=getmymenu&pid='+pid,null,function(data) {
                    // console.log(data.data);
                    $('treeclass').innerHTML='';
                    let datam = data.data;
                    for(let k in datam) {
                        let n = domnew($('treeclass'), 'div', null);    //domnew函数构造页面元素（div、a等）
                        n.setAttribute('class', 'mo-menu-li');
                        n.setAttribute('id', datam[k].id);
                    }
                    for(let k in datam){
                        let m=domnew($(datam[k].id),'a',null,datam[k].name);
                        m.setAttribute('class','ab');
                        m.setAttribute('href',datam[k].url);
                        // m.setAttribute('id',datam[k].id);
                    }
                    let yb=document.getElementsByClassName('ab');         //侧边菜单切换样式
                    for(let i=0;i<yj.length;i++) {
                        yb[i].onmouseover=function(){
                            this.classList.add('active');
                        }
                        yb[i].onclick = function () {					//侧边点击触发
                            this.classList.add('active');

                        }
                        yb[i].onmouseout=function(){
                            this.classList.remove('active');
                        }

                    }
                })

            }
            yj[i].onmouseout=function(){
                this.classList.remove('active');
            }
        }
    });
}