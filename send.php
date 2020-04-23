<?php
// 连接数据库、设置字符集
include 'config.php';
$IP = $_SERVER["REMOTE_ADDR"];//获取IP并保存到变量IP中
// 创建预处理语句
$stmt=mysqli_stmt_init($link);
$datetime = date("Y-m-d H:i:s",time()-2); //获取时间
//编写预处理查询sql语句
$sql = "select id from message where ip = ? and add_time > ?";
if (mysqli_stmt_prepare($stmt,$sql))
{ 
    // 绑定参数
    mysqli_stmt_bind_param($stmt,"ss",$IP,$datetime);
    // 执行查询
    mysqli_stmt_execute($stmt); 
    // 从准备好的语句获取结果集
    $query = mysqli_stmt_get_result($stmt);
    // 获取值
    $result = mysqli_fetch_assoc($query);
	if (!$result) {			
		if (isset($_COOKIE['userName']) && !empty($_COOKIE['userName'])) {
				$msg = $_POST['msg'];
				// 所有字符都转成HTML格式
				$msg = htmlentities($msg,ENT_QUOTES);
				//将$msg变量中的换行字符"chr(13)"替换为html的换行符"<br>"
				$msg=str_replace(chr(13),'<br>',$msg);
				//将$msg变量中的空格字符"chr(32)"替换为html的换行符"&nbsp;"
				$msg=str_replace(chr(32),'&nbsp;',$msg);
				if (!empty($msg) || !empty($_FILES['image']['name'])) {					
					if (!empty($_FILES['image']['name'])) {
						//判断附件是否有问题
						if ($_FILES['image']['error']>0) {
						 	exit('附件异常有问题');
						 } 
						//① 附件的存储位置、附件的名字
						$path = "./images/";
						$name = $_FILES['image']['name'];	//原名字
						// 判断“.”的位置
						$end = strrchr($name,'.');
						if (!($end == '.png' || $end == '.jpg' ||  $end == '.jpeg' ||  $end == '.gif' || $end == '.webp')) {
					           echo "上传失败";
							   // 关闭预处理语句
							   mysqli_stmt_close($stmt);
							   //关闭连接
							   mysqli_close($link);
					           exit();
						}
						$truename = $path.$name;
					     /*
					     	判断图片格式
					      */     
					 		//附件临时路径
					        $file = $_FILES['image']['tmp_name'];
					        $check = exif_imagetype($file);
					        if ($check) {
					        	//② 把附件从临时路径 移动到真实位置move_uploaded_file()
								if(move_uploaded_file($file,$truename)){
									// echo "上传成功"."&nbsp;&nbsp;";
								}else{
									echo "上传失败";
								}
								$image = $truename;
					        } else {
					            echo "上传失败";
								// 关闭预处理语句
								mysqli_stmt_close($stmt);
								//关闭连接
								mysqli_close($link);
					            exit();
					        }					     					    
					}else{
						$image = null;
					}
					$sender = $_COOKIE['sender'];
					$userName = $_COOKIE['userName'];
					// 所有字符都转成HTML格式
					$userName = htmlentities($userName,ENT_QUOTES);
					$color = $_POST['color'];
					$biaoqing = $_POST['biaoqing'];					
					//编写预处理插入sql语句
					$sql = "insert into message values (null,?,?,?,?,?,?,?,now())";
					//预处理SQL模板
					$stmt = mysqli_prepare($link, $sql);
					// 参数绑定，并为已经绑定的变量赋值
					mysqli_stmt_bind_param($stmt, 'sssssss', $userName, $sender, $IP, $msg, $color, $biaoqing,$image);
					// 执行预处理
					$result = mysqli_stmt_execute($stmt);
					if ($result) {
					    echo "发送成功";
					}else{
						echo "发送失败";
					}
				}else{
					echo "消息为空";
				}			
		}else{
			echo "昵称为空";
		}
	}else{
		echo "消息重复";
	}     
}else{
	echo "预处理查询sql语句错误";
}
// 关闭预处理语句
mysqli_stmt_close($stmt);
//关闭连接
mysqli_close($link);
?>