<?php
/**
 * 公共管理
 */
include "public.php";
include "funData.php";
include "../api/Common.php";
session_start();

$com = new Common();
$com->isLogin();

$act = get('act');
$act = str_ireplace('(', '', str_ireplace('\'', '', str_replace(' ', '', $act)));
if (function_exists('do_' . $act)) {
    $act = 'do_' . $act;
    $act();
} else {
    error_return($act . '方法不存在！', 'error');
}

/**
 *Notes:获取菜单栏
 *User:JXH
 *DateTime:2023/2/7 12:33
 */
function do_getAdminMenuInfo()
{
    checkMethod('GET');
    $pid = get('pid', 0);
    $data = dosql_data('select id,parent_id,name,param,icon,web_url from menu where deleted=0 and parent_id =' . $pid);
    success_return($data, '获取成功！');
}

/**
 *Notes:获取网站基础信息
 *User:JXH
 *DateTime:2023/2/7 12:40
 */
function do_getWebsiteBaseInfo()
{
    checkMethod('GET');
    $data = dosql_data('select website_name,website_admin,admin_email,site_icp,site_gwa,site_analytics from config where deleted=0 and id = 1');
    success_return($data, '获取成功！');
}


/**
 *Notes:获取单位全部数据
 *User:JXH
 *DateTime:2023/2/7 18:11
 */
function do_getAllUnitData()
{
    checkMethod();
    $sql = 'select id,parent_id pid,unit_name txt from unit_info  where deleted= 0';
    $data = dosql_data($sql);
    $re['pid'] = $_SESSION['unit_id'];
    $re['data'] = $data;
    success_return($re, '获取成功！');
}


?>