<?php
// 连接数据库、设置字符集
include 'config.php';

$ymd = date("Y-m-d");

// 创建预处理语句
$stmt=mysqli_stmt_init($link);

//编写预处理查询数量sql语句
$sql = "select count(id) from visitor where time > ?";

	if (mysqli_stmt_prepare($stmt,$sql))
	{
	    
	    // 绑定参数
	    mysqli_stmt_bind_param($stmt,"s",$ymd);
	    
	    // 执行查询
	    mysqli_stmt_execute($stmt);
	    
	    // 从准备好的语句获取结果集
	    $query = mysqli_stmt_get_result($stmt);
	    
	    // 获取值
		$number = mysqli_fetch_assoc($query);

		//将一维数组的值转换为一个字符串
		$number = implode($number);
		
		echo $number;

		// 关闭预处理语句
	    mysqli_stmt_close($stmt);
	}
//关闭连接
mysqli_close($link);

?>