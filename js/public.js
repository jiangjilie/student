let urls = '/';
// ajax封装
function $ajax(url, method, postdata, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, `${urls}${url}`, true);
    if (postdata == null) {
        postdata = {}
        postdata = JSON.stringify(postdata)
        xhr.send()
    } else {
        postdata = JSON.stringify(postdata)
        xhr.send(postdata);
    }
    xhr.onreadystatechange = () => {
        if (xhr.status == 200 && xhr.readyState == 4) {
            var data = JSON.parse(xhr.responseText);
            callback(data)
        }
    }
}
// 获取dom
function $(name) {
    return document.querySelector(name)
}
// 顶部菜单栏
function shownav(data, model) {
    let nav = $('.nav')
    nav.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        let a = document.createElement('a')
        a.innerHTML = data[i].name
        a.setAttribute('data_id', data[i].id)
        if (data[i].name == '系统设置') {
            a.classList.add('active')
            $('.side_tit').innerHTML = data[i].name
            sidemenu(data[i].id)
        }
        a.onclick = function () { switchtop(this) }
        nav.append(a)
    }
}
// 侧边菜单栏
// function sidemenu(pid) {
//     $ajax(`api/common.php?act=getAdminMenuInfo&pid=${pid}`, 'get', null, function (jobj) {
//         let mo_menu = $('.mo-menu')
//         let list = mo_menu.querySelectorAll('.mo-menu-li')
//         for (let i = 0; i < list.length; i++) {
//             list[i].remove()
//         }
//         if (jobj.code == 200 && jobj.data.length > 0) {
//             for (let i = 0; i < jobj.data.length; i++) {
//                 let mo_menu_li = document.createElement('div')
//                 mo_menu_li.classList.add('mo-menu-li')
//                 let largea = document.createElement('a')
//                 largea.innerHTML = jobj.data[i].name
//                 largea.setAttribute('data_id', jobj.data[i].id)
//                 largea.onclick = function () { switchside(this.getAttribute('data_id'), this) }
//                 if (i == 0) {
//                     largea.classList.add('active')
//                     sideid = jobj.data[i].id
//                     switchside(jobj.data[i].id, largea)
//                 }
//                 // if (jobj.code[i].children.length > 0) {
//                 //     let mo_menu_li_sub = document.createElement('div')
//                 //     jobj.code[i].children.forEach(item=>{
//                 //         let a = document.createElement('a')
//                 //         a.innerHTML = item.name
//                 //         a.setAttribute('data_id', item.id)
//                 //         mo_menu_li_sub.appendChild(a)
//                 //     })
//                 //     mo_menu_li.appendChild(mo_menu_li_sub)
//                 // }
//                 mo_menu_li.appendChild(largea)
//                 mo_menu.appendChild(mo_menu_li)
//             }
//         }
//     });
// }
// 获取顶部菜单栏
function getopmenu(model) {
    $ajax('../base/common.php?act=getAdminMenuInfo', 'get', null, function (jobj) {
        if (jobj.code == 200) {
            shownav(jobj.data)
        }
    });
}
// 顶部菜单栏切换
function switchtop(lable) {
    let url = sideurl(lable.getAttribute('data_id'))
    location.href = url
    // let nav = $('.nav')
    // let arr = nav.querySelectorAll('a')
    // for (let i = 0; i < arr.length; i++) {
    //     arr[i].classList.remove('active')
    // }
    // lable.classList.add('active')
    // $('.side_tit').innerHTML = lable.innerHTML
    // console.log('lable');
    // console.log(lable.getAttribute('data_id'));
    // sidemenu(lable.getAttribute('data_id'))

}
// 给侧边栏添加地址
function sideurl(information) {
    let url;
    switch (information) {
        case '2':
            url = '/view/html/associtionlist.html'; break;
        case '3':
            url = '/view/html/activitelist.html'; break;
        case '5':
            url = '/view/html/column.html'; break;
        case '6':
            url = '/view/html/column.html'; break;
        case '7':
            url = '/view/html/menu.html'; break;
        case '8':
            url = '/view/html/role.html'; break;
        case '9':
            url = '/view/html/column.html'; break;
        case '10':
            url = '/view/html/journal.html'; break;
        case '11':
            url = '/view/html/associtionlist.html'; break;
        case '12':
            url = '/view/html/associationapply.html'; break;
        case '13':
            url = '/view/html/getintoassociation.html'; break;
        case '14':
            url = '/view/html/activitelist.html'; break;
    }
    return url
}
// 侧边栏切换
// function switchside(id, lable) {
//     let mo_menu = $('.mo-menu')
//     let arr = mo_menu.querySelectorAll('a')
//     for (let i = 0; i < arr.length; i++) {
//         arr[i].classList.remove('active')
//     }
//     lable.classList.add('active')
//     sideid = lable.getAttribute('data_id')
//     let obj = { id }

//     $ajax('api/column.php?act=getColumnlist', 'post', obj, function (jobj) {
//         getlist(jobj)
//     })
// }