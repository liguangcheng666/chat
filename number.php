<?php
// 连接数据库、设置字符集
include 'config.php';
//编写查询数量sql语句
$sql = "select count(id) from visitor where to_days(time) = to_days(now());";
// 执行sql语句并取得记录集*
$result = mysqli_query($link,$sql);
// 获取值
$number = mysqli_fetch_assoc($result);
// 将一维数组的值转换为一个字符串
$number = implode($number);
echo $number;
// 释放记录集
mysqli_free_result($result);
// 关闭连接
mysqli_close($link);
?>