<?php
// 连接数据库、设置字符集
include 'config.php';if (!isset($_COOKIE['sender']) && empty($_COOKIE['sender'])) {
	$IP = $_SERVER["REMOTE_ADDR"];//获取IP并保存到变量IP中
	$url = 'http://ip-api.com/json/'.$IP.'?lang=zh-CN';
	$str = file_get_contents($url);
	$ipinfo=(array)json_decode($str);
	$address = $ipinfo['city'];
	$sender = $address."&nbsp;".$IP;
	setcookie('sender',$sender,time()+30*24*60*60);
	exit();
}else{
	$sender = $_COOKIE['sender'];
}
if(isset($_COOKIE['userName']) && !empty($_COOKIE['userName'])){
	$userName = $_COOKIE['userName'];
}else{
	$userName = null;
}
// 创建预处理语句
$stmt=mysqli_stmt_init($link);
$ymd = date("Y-m-d");
//编写预处理查询sql语句
$sql = "select id from visitor where time > ? and username = ?";
if (mysqli_stmt_prepare($stmt,$sql))
{
    // 绑定参数
    mysqli_stmt_bind_param($stmt,"ss",$ymd,$userName);
    // 执行查询
    mysqli_stmt_execute($stmt);
    // 从准备好的语句获取结果集
    $query = mysqli_stmt_get_result($stmt);
    // 获取值
    $result = mysqli_fetch_assoc($query);
	if (!$result && !empty($userName) && !empty($sender)) {
		//编写预处理插入sql语句
		$sql = "insert into visitor values (null,?,?,now())";
		//预处理SQL模板
		$stmt = mysqli_prepare($link, $sql);
		// 参数绑定，并为已经绑定的变量赋值
		mysqli_stmt_bind_param($stmt, 'ss', $userName, $sender);
		// 执行预处理
		$result = mysqli_stmt_execute($stmt);
		if ($result) {
			echo "记录成功";
		}else{
			echo "记录失败";
		}
	}else{
		echo "已经记录";
	}
    // 关闭预处理语句
    mysqli_stmt_close($stmt);
}else{
	echo "预处理查询sql语句错误";
}
//关闭连接
mysqli_close($link);
?>