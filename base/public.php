<?php
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
date_default_timezone_set("PRC");


//$sqlip = '127.0.0.1:3306'; //链接
//$sqluser = 'dooruser'; //数据库账号
//$sqlpass = 'Pdves8@8YufPz'; //数据吗密码
//$sqldb = 'door'; //数据库名称

//$sqlip='172.22.11.161:3305'; //链接
//$sqluser='webuser'; //数据库账号
//$sqlpass='PK@ef,Gd3P4'; //数据吗密码
//$sqldb='webdb'; //数据库名称

$sqlip='localhost:3306'; //链接
$sqluser='root'; //数据库账号
$sqlpass='123456'; //数据吗密码
$sqldb='sddb'; //数据库名称


function ipaddr(){         //获取登陆IP地址
	return dosql_check(empty($_SERVER['HTTP_X_FORWARDED_FOR'])?$_SERVER['REMOTE_ADDR']:$_SERVER['HTTP_X_FORWARDED_FOR']);
}

function get($key,$defaultvalue=''){
	if($defaultvalue==='')
		return empty($_GET[$key])?'':$_GET[$key];
	else
		return intval(empty($_GET[$key])?$defaultvalue:$_GET[$key]);
}

function msgtxt($msg,$result="ok"){
	$code=500;
	if($result=='ok' || $result==200)$code=200;
	die('{"result":"'.$result.'","code":"'.$code.'","msg":'.json_encode($msg).'}');
}

function msgdata($data,$msg='ok',$result="ok"){
	$code=500;
	if($result=='ok' || $result==200)$code=200;
	die('{"result":"'.$result.'","code":"'.$code.'","msg":"'.$msg.'","data":'.json_encode($data).'}');
}

function msgsql($sql){
	$result=dosql_result($sql);
	$data=array();
	while($r=$result->fetch_assoc())array_push($data,$r);
	msgdata($data);
}

function dosql_data($sql){
	$result=dosql_result($sql);
	$data=array();
	while($r=$result->fetch_assoc())array_push($data,$r);
	return $data;
}

function dosql_check($str){//检查SQL字符串
	$str=str_replace('\\', '\\\\', $str);
	$str=str_replace('\'', '\\\'', $str);
	return $str;
}
function dosql_check2($str){
	$str=dosql_check($str);
	$str=str_replace('%', '\\%', $str);
	$str=str_replace('_', '\\_', $str);
	return $str;
}

function dosql_result($sqlstr){
	global $sqlip,$sqluser,$sqlpass,$sqldb;
	$db=new mysqli($sqlip,$sqluser,$sqlpass,$sqldb);
	$db->query("SET NAMES utf8");
	if(mysqli_connect_error()){die('Could not connect to database.');}
	return $db->query($sqlstr);
}
function dosql_first($sqlstr){
	global $sqlip,$sqluser,$sqlpass,$sqldb;
	$db=new mysqli($sqlip,$sqluser,$sqlpass,$sqldb);
	$db->query("SET NAMES utf8");
	if(mysqli_connect_error()){die('Could not connect to database.');}
	$res=$db->query($sqlstr);
	if($row=$res->fetch_row())
		return $row[0];
	else
		return '';
}

function dosql_first_int($sqlstr){
	$t=dosql_first($sqlstr);
	if($t=='')return 0;
	else return intval($t);
}

function dosql_cmd($sqlstr,$returnid=false){
	global $sqlip,$sqluser,$sqlpass,$sqldb;
	$db=new mysqli($sqlip,$sqluser,$sqlpass,$sqldb);
	$db->query("SET NAMES utf8");
	if(mysqli_connect_error()){die('Could not connect to database.');}
	$num=$db->query($sqlstr);
	if($returnid)$num=mysqli_insert_id($db);
	return $num;
}
function makerndstr($gs){
	$strs="QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm";
	$name=substr(str_shuffle($strs),mt_rand(0,strlen($strs)-$gs),$gs);
    return $name;
}

function getjson(){
	return json_decode(file_get_contents('php://input'));
}
function sendjson($url,$data,$rtype='obj'){
	$sendtxt=json_encode($data);
	$rtxt = file_get_contents($url, 0, stream_context_create(array(
    'http' => array(
        'timeout' => 30,
        'method' => 'POST',
        'header' => "Content-Type: application/json;charset=utf-8\r\n"."Content-Length: ".strlen($sendtxt)."\r\n",
        'content' => $sendtxt
	))));
	if($rtype=='obj'){
		$jobj=json_decode($rtxt);
		return $jobj;
	}else{
		return $rtxt;
	}
}


//调用方法baseData(['cmd'=>'getdw']);
function baseData($para,$rtype='obj'){//基础数据接口
	$para["timestamp"]=time();
	$para['appid']='wjap';
	$para["challenge"]=MD5('ksOweirJDEKLjsafWjbcd'.$para['timestamp'].'-bycmj');
	return sendjson('http://base.e.rcqjy.com/public/api.php', $para,$rtype);
}

/**
 * @param string $method
 * @Notes:请求方式验证
 * @User:xiangzi
 * @DateTime:2022/10/10
 */
function checkMethod($method = 'POST')
{
    if ($_SERVER['REQUEST_METHOD'] != $method) {
        error_return('非法请求', 'error');
    }
}

/**
 *Notes:请求失败调用
 *User:JXH
 *DateTime:2022/10/8 16:35
 * @param string $msg
 * @param string $result
 * @param int $code
 */
function error_return($msg = '请求失败！', $result = 'error', $code = 500)
{
    die('{"code":"' . $code . '","msg":"' . $msg . '","result":"' . $result . '"}');
}

/**
 *Notes:请求成功调用
 *User:JXH
 *DateTime:2022/10/8 16:36
 * @param $data
 * @param string $msg
 * @param int $code
 * @param bool $resend 是否重新发送
 */
function success_return($data, $msg = '请求成功！', $code = 200, $resend = false)
{
    if (!is_array($data)) {
        $data = [
            'return_id' => $data,
        ];
    }
    die('{"code":"' . $code . '","msg":"' . $msg . '","data":' . json_encode($data) . '}');
}


/**
 *Notes:判断数据表是否存在
 *User:JXH
 *DateTime:2022/10/12 11:47
 * @param $table
 */
function is_table_cmd($table)
{
    $data_table = '\'' . dosql_check($table) . '\'';
    $sqlstr = 'show tables like ' . $data_table;
    $re = dosql_result($sqlstr);
    $res = $re->fetch_assoc();
    if (empty($res)) {
        error_return($table . '数据表不存在！');
    }
}
?>