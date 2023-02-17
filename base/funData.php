<?php
//数据库相关操作


//参数：table data fields where id head
//必填：table fields或者head
//fields 和head必须有一个，且fields优先
//id出现时，where自动失效
//data为选填，为空时自动读取用户上传数据
//数据保存操作
function showsave($para){
	$table=$para['table'];
	$where=$para['where']??'';
	if(empty($para['data'])){
		$data=json_decode(file_get_contents('php://input'),true);
		if(!empty($data['id']) && empty($para['id']))$para['id']=$data['id'];
	}else{
		$data=$para['data'];
	}
	
	
	if(!empty($para['fields'])){
		$fields=explode(',',$para['fields']);
	}
	if(empty($fields) && !empty($para['head'])){
		$fields=array_keys($para['head']);
	}

	if(empty($fields))return FALSE;//没有要保存的字段
	$intfields=explode(',',$para['intfields']??'');//为数字型的字段
	
	$sql=$sql1=$sql2=$sql3='';
	foreach($data as $k=>$v){
		if(in_array($k, $fields)){
			$sql1.=','.$k;
			if(in_array($k, $intfields)){
				$sql2.=','.intval($v);
				$sql3.=','.$k.'='.intval($v);
			}else{
				$sql2.=',\''.dosql_check($v).'\'';
				$sql3.=','.$k.'=\''.dosql_check($v).'\'';
			}	
		}	
	}
	$sql2='insert into '.$table.'('.substr($sql1,1).') values('.substr($sql2, 1).')';
	$sql3='update '.$table.' set '.substr($sql3, 1);
	if(!empty($para['id'])){
		$id=intval($para['id']);
		if($id<=0){
//			echo $sql1;
			return dosql_cmd($sql2,true);
		}else{
//			echo $sql3.' where id='.$id;
			dosql_cmd($sql3.' where id='.$id);
			return $id;
		}
	}else{
		if($where!='')$where=' where '.$where;
		if($where==''){
//			echo $sql2;
			return dosql_cmd($sql2,true);
		}else{
			if(dosql_first_int('select count(*) from '.$table.$where)==1){//刚好一条记录
//				echo $sql3.$where;
				dosql_cmd($sql3.$where);
				return TRUE;
			}else{
//				echo $sql2;
				return dosql_cmd($sql2,true);
			}
		}
	}	
}

 
/**
*showedit:合成表格需要的数据
*User:CMJ
*DateTime:2023/1/7 12:54
* @param string table 数所库中的表名(必填)
* @param array head 字段对应的中文标题，值为空将不会显示(必填)
* @param array type 详见demo
* @param string where sql中的where
* @return null 直接输出json
*/
function showedit($para,$returndata=0){
	$table=$para['table'];
	$head=$para['head'];
	$fields=$para['fields'] ?? '';
	$where=$para['where'] ?? '';
	$type=$para['type'] ?? null;
	if($fields=='')$fields=join(',',array_keys($head));
	
	$data=array();
	$data['head']=$head;
	if($type!=null)$data['type']=$type;
	//$where.=' and deleted=0';
	if($where!='')$where=' where'.substr($where, 4);
	$tmpdata=dosql_data('select '.$fields.' from '.$table.$where.' limit 1');
	if(count($tmpdata)>0)
		$data['data']=$tmpdata[0];
	if($returndata==0)
		msgdata($data);
	else
		return $data;
}

//生成树
function maketree($sdata,$pid=0,$txt='全部'){
	$ddata=array();
	array_push($ddata,['value'=>$pid,'txt'=>$txt]);
	maketreechild($sdata, $pid,$ddata,$txt);
	return $ddata;
}
function maketreechild(&$sdata,$id,&$ddata,$txt){
	foreach($sdata as $d){
		if($d['pid']==$id){
			array_push($ddata,['value'=>$d['value'],'txt'=>$txt.'->'.$d['txt'],'pid'=>$d['pid']]);
			maketreechild($sdata, $d['value'],$ddata,$txt.'->'.$d['txt']);
		}
	}
}

/**
*showtable:合成表格需要的数据
*User:CMJ
*DateTime:2023/1/7 12:54
* @param string table 数所库中的表名(必填)
* @param array head 字段对应的中文标题，值为空将不会显示(必填)
* @param array intfields 为数字的字段
* @param array findkeys 查找的字段
* @param string pickey 标签中的图片
* @return null 直接输出json
*/
function showtable($para,$debug=0){
	$table=$para['table'];
	$head=$para['head'];
	$where=$para['where'] ?? '';
	$fields=$para['fields'] ?? '';
	$pickey=$para['pickey'] ?? '';
	$porder=$para['orderby'] ?? null; //默认排序
	$group=$para['groupby'] ?? null;

	if(!empty($para['intfields']))$intfields=explode(',', $para['intfields']); //数字字段
	if(!empty($para['findkeys']))$findkeys=explode(',', $para['findkeys']);
	
	$arr=getjson();
	if($fields=='')$fields=join(',',array_keys($head));
	
	if(!$arr)$arr=(object)array();
	$data=array();
	$data['head']=$head;
	$data['pickey']=$pickey;
	if(!empty($findkeys)){
		$data['findkeys']=$findkeys;
		if(!empty($arr->find))$data['find']=$arr->find;
	}
	
	$fkeys=get('findkeys','');
	if(!empty($fkeys)){
		$data['find']=[];
		$fvals=get('findvalues','');
		$fks=explode(',', $fkeys);
		$fvs=explode(',', $fvals);
		for($i=0;$i<count($fks);$i++){
			if(!empty($fks[$i]) && !empty($fvs[$i])){
				array_push($data['find'],(object)array('key'=>$fks[$i],'value'=>$fvs[$i]));
			}
		}
	}
	
	$data['orderby']=$arr->orderby ?? get('orderby','');
	$data['ordertype']=$arr->ordertype ?? get('ordertype','');
	$data['pgsize']=intval($arr->pgsize ?? get('pgsize',10));
	$data['currpg']=intval($arr->currpg ?? get('currpg',1));
	
	if(!empty($data['find'])){
		$cl=array(count($data['find']));//已经处理过了
		for($i=0;$i<count($data['find']);$i++)$cl[$i]=0;
		for($i=0;$i<count($data['find']);$i++){
			$k=$data['find'][$i]->key;
			$v=$data['find'][$i]->value;
			if(!empty($k) && !empty($v) && in_array($k, $findkeys) && $cl[$i]==0){
				$vs=array();
				array_push($vs,$v);
				for($j=$i+1;$j<count($data['find']);$j++){
					if($data['find'][$j]->key==$k && !empty($data['find'][$j]->value && $cl[$j]==0)){
						array_push($vs,$v=$data['find'][$j]->value);
						$cl[$j]=1;
						//$data['find'][$j]->value='';
					}
				}
				if(!empty($intfields) && in_array($k, $intfields)){
					if(count($vs)>1){
						for($x=0;$x<count($vs);$x++)$vs[$x]=$k.'='.intval($vs[$x]);
						$where=' and ('.join(' or ',$vs).')'.$where;
					}else{
						$where=' and '.$k.'='.intval($v).$where;
					}
				}else{
					if(count($vs)>1){
						for($x=0;$x<count($vs);$x++)$vs[$x]=$k.' like \'%'.dosql_check($vs[$x]).'%\'';
						$where=' and ('.join(' or ',$vs).')'.$where;						
					}else{
						$where=' and '.$k.' like \'%'.dosql_check($v).'%\''.$where;
					}
				}
			}
		}
	}
	
//	if(!empty($findkeys)){
//		if($data['findkey']!='' && $data['findvalue']!='' && in_array($data['findkey'], $findkeys)){
//			if(!empty($intfields) && in_array($data['findkey'], $intfields)){//数字
//				$where=' and '.$data['findkey'].'='.intval($data['findvalue']).$where;
//			}else{
//				$where=' and '.$data['findkey'].' like \'%'.dosql_check($data['findvalue']).'%\''.$where;
//			}
//		}
//	}
	//$where.=' and deleted=0';
	if($where!='')$where=' where'.substr($where, 4);
	if($debug==1){
		die('select count(*) from '.$table.$where);
	}
	$data['allts']=dosql_first_int('select count(*) from '.$table.$where);
	$data['allpg']=ceil($data['allts']/$data['pgsize']);
	
	$sql='select '.$fields.' from '.$table.$where;
	
	if($data['orderby']!='' && array_key_exists($data['orderby'], $data['head'])){
		$sql.=' order by '.$data['orderby'];
		if($data['ordertype']=='desc')$sql.=' desc';
	}else{
		if(!empty($porder)){
			$sql=$sql.' order by '.$porder;
		}
	}
	
	if(!empty($group))$sql.=' group by '.$group;
	
	if($data['currpg']==-1){
		return outtoxls($sql, $head,$intfields);
	}else{
		if($data['currpg']<1)$data['currpg']=1;
	}
	$sql.=' limit '.($data['currpg']-1)*$data['pgsize'].','.$data['pgsize'];
	if($debug==2){
		die($sql);
	}
	$data['data']=dosql_data($sql);
	
	msgdata($data);
}

function outtoxls($sql,$head,$intfields){
	$sheet='导出数据';
	$filename='导出数据.xlsx';
	$header=array();
	if(!empty($intfields)){
		$intf=array();
		for($i=0;$i<count($intfields);$i++){
			if(strpos($intfields[$i], '.')>0){
				array_push($intf,substr($intfields[$i], strpos($intfields[$i], '.')+1));
			}else{
				array_push($intf,$intfields[$i]);
			}
		}
	}
	foreach($head as $k=>$v){
		$kn=$v;
		if($kn=='')$kn=$k;
		if(!empty($intf) && in_array($k, $intf)){
			$header[$kn]='integer';
		}else{
			$header[$kn]='string';
		}
	}
	include_once("xlsxclass.php");
	header('Content-disposition: attachment; filename="'.XLSXWriter::sanitize_filename($filename).'"');
	header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
	header('Content-Transfer-Encoding: binary');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	$writer = new XLSXWriter();
	$writer->setAuthor('rcjy'); 
	$writer->writeSheetHeader($sheet,$header);
	$result=dosql_result($sql);
	while($row=$result->fetch_row())
		$writer->writeSheetRow($sheet, $row);
	$writer->writeToStdOut();
	//$writer->writeToFile('example.xlsx');
	//echo $writer->writeToString();
	exit(0);
}
//s数据同步
function syncdatafrombase($tables, $pagesize = 100, $returndata = 0, $debug = 0,){//从基础库同步数据

    $page = get('page', 0);
    $tid = get('tid', 0);//第几个表

    if ($tid >= count($tables)) error_return('同步完成！');
    $table = $tables[$tid];

    $fs = explode(',', $table['src']);
    $fd = explode(',', $table['dsc']);

    if ($debug == 1) {
        echo baseData(['cmd' => $table['cmd'], 'page' => $page, 'pagesize' => $pagesize], 'txt');
    }

    $jobj = baseData(['cmd' => $table['cmd'], 'page' => $page, 'pagesize' => $pagesize]);
    if ($jobj->code != 200) error_return($jobj->msg);
    $ts = count($jobj->data);//得到多少条
    foreach ($jobj->data as $dv) {
        $d = get_object_vars($dv);
        $_id = intval($d['id']);

        $v1 = array();
        $v2 = array();
        for ($i = 0; $i < count($fs); $i++) {
            array_push($v1, '\'' . dosql_check($d[$fs[$i]]) . '\'');
            array_push($v2, $fd[$i] . '=\'' . dosql_check($d[$fs[$i]]) . '\'');
        }
        if (dosql_first_int('select count(*) from ' . $table['table'] . ' where id=' . $_id) > 0) {
            $sqlstr = 'update ' . $table['table'] . ' set ' . implode(',', $v2) . ' where id=' . $_id;
        } else {
            $sqlstr = 'insert into ' . $table['table'] . '(' . $table['dsc'] . ') values(' . implode(',', $v1) . ')';
        }
        if ($debug == 2) echo $sqlstr . PHP_EOL;
        if ($debug == 0) dosql_cmd($sqlstr);
    }
    if ($debug != 0) exit();

    if ($ts < $pagesize) {
        $tid++;
        $total = ($page - 1) * $pagesize + $ts;
        $page = 0;
    } else {
        $total = $page * $pagesize;
        $page++;
    }


    $data = ['page' => $page, 'tid' => $tid, 'ts' => $ts, 'table' => $table['table'], 'allts' => $jobj->allts, 'pagesize' => $jobj->pagesize, 'tablecount' => count($tables), 'total' => $total];

    if ($returndata == 0)
        msgdata($data);
    else
        return $data;
}
?>