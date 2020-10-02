<?php
// 连接数据库、设置字符集
include 'config.php';
$maxID = $_GET['maxID'];
$before = $_GET['before'];
//每次都请求新的聊天内容（不需要旧的信息）
//本次请求的记录结果id需要大于上次“已经获得记录的最大id”
// 创建预处理语句
$stmt=mysqli_stmt_init($GLOBALS['link']);
//编写预处理查询sql语句
if ($before == "true") {
    $sql = "select id,username,msg,color,biaoqing,image,add_time from (select id,username,msg,color,biaoqing,image,add_time from message where id < ? order by id desc limit 100) a order by id";
}else{
    $sql = "select id,username,msg,color,biaoqing,image,add_time from message limit ?,100";
}

if (mysqli_stmt_prepare($stmt,$sql))
{   
    // 绑定参数
    mysqli_stmt_bind_param($stmt,"i",$maxID);
    // 执行查询
    mysqli_stmt_execute($stmt);
    // 从准备好的语句获取结果集
    $query = mysqli_stmt_get_result($stmt);
    // 获取值
    $info = array();
    while ($result = mysqli_fetch_assoc($query)) {
        $info[] = $result;
    }
    if (!$info) $info = 0; 
    //通过json格式提供数据给客户端
    echo json_encode($info,JSON_UNESCAPED_UNICODE);
    // 关闭预处理语句
    mysqli_stmt_close($stmt);
}
//关闭连接
mysqli_close($GLOBALS['link']);
?>