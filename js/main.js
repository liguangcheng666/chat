//通过ajax无刷新方式获得最新的聊天内容
var maxID = 0,minID = 0,max = 0;
// websocket
var ws = false, n = false,once = true,send = 'type=add&ming=',str,users;
var img_num,image,move,read_before,read_before_id,read_after,read_after_id;
// showmsg
var showmsg,visitorMsg;
// socket
function socket() {
	var url = 'ws://192.168.0.106:8000';
	//创建socket，注意URL的格式：ws://ip:端口
	ws = new WebSocket(url);
}
// msg
function msg(msg) {
	//string--->实体内容
	eval("var json_info=" + msg);
	//遍历json_info的数组，把内容的信息与页面内容做结合
	var s = "";
	for (var i = 0; i < json_info.length; i++) {
		s += "<p style='color:" + json_info[i].color + "'>";
		s += json_info[i].username + "&nbsp;";
		s += json_info[i].biaoqing + "&nbsp;:&nbsp;&nbsp;" + json_info[i].msg;
		if (json_info[i].image) {
			// 图片地址
			var img_url = encodeURI(json_info[i].image);
			s += "<img src='icons/load.png' data-src='" + img_url + "'>";
		}
		s += "</p>";
		s += "<p style='color:black;font-size: 30px;'>（" + json_info[i].add_time.substr(5, 16) + "）</p>";
		// 把已经获得记录的最小id值赋给minID
		minID = json_info[0].id;
		// 把已经获得记录的最大id值赋给maxID
		maxID = json_info[i].id;
	}
	showmsg = document.getElementById('show_msg');
	showmsg.innerHTML += s;
	//设置滚动条卷起高度
	//卷起高度等于div本身高度，就可以使得滚动条始终在最下边显示
	showmsg.scrollTop = showmsg.scrollHeight;
}
function showmessage() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var message = xhr.responseText;
			// console.log(message);
			if (message != 0) {
				msg(message);
                max = maxID;
                if (once) {
                	once = false;
					setTimeout(function(){
						lazyload();
						// 设置websocket参数
						n = document.getElementById("user").innerText.substring(0, 30);
						// 启动websocket				
						websocket();
					}, 500);
                }
			}
		}
	}
	xhr.open('get', './data.php?maxID=' + maxID);
	xhr.send(null);
}

// 插入方法
function insertAtCursor(myField, myValue) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
		sel.select();
	}
	//MOZILLA/NETSCAPE support 
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		// save scrollTop before insert www.keleyi.com
		var restoreTop = myField.scrollTop;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
		if (restoreTop > 0) {
			myField.scrollTop = restoreTop;
		}
		myField.focus();
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
	} else {
		myField.value += myValue;
		myField.focus();
	}
}

// 底部js
/*
生成用户cookie
	*/
function visitor() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			visitorMsg = xhr.responseText;
		}
	}
	xhr.open('get', './visitor.php');
	xhr.send(null);
}
/*
	写cookies方法
 */
function setCookie(name, value, time) {
	// 设置cookie
	var obj = new Date();
	obj.setTime(obj.getTime() + time * 1000); //过期时间
	document.cookie = name + "=" + value + ";expires=" + obj.toGMTString();
}
/*
    查询用户访问数
 */
function number() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var number = xhr.responseText;
			document.getElementById('number').innerText = number;
		}
	}
	xhr.open('get', './number.php');
	xhr.send(null);
}
/*
    显示查询网名
 */
function queryUser() {
	var sender = document.cookie.indexOf("sender");
	var userName = document.cookie.indexOf("userName");
	if (sender + 1) {
		if (!(userName + 1)) {
			var num = sender + 7;
			var user = decodeURIComponent(document.cookie.slice(num)).replace("&nbsp;", " ");
			var end = user.indexOf(";");
			if (end + 1) {
				var user = user.slice(0, end);
			}
			var userName = prompt("请输入您的昵称", user);
			if (userName) {
				// 限制网名长度
				userName = userName.substring(0, 30);
				// 设置cookie
				setCookie('userName', userName, 30 * 24 * 60 * 60);
				document.getElementById("user").innerHTML = userName;
			} else {
				var num = '';
				for (var i = 0; i < 3; i++) {
					num += Math.floor(Math.random() * 10);
				}
				var userName = "匿名者" + num;
				// 设置cookie
				setCookie('userName', userName, 24 * 60 * 60);
				document.getElementById("user").innerHTML = userName;
			}
		} else {
			var num = userName + 9;
			var user = decodeURIComponent(document.cookie.slice(num)).replace("&nbsp;", " ");
			var end = user.indexOf(";");
			if (end + 1) {
				var user = user.slice(0, end);
			}
			document.getElementById("user").innerHTML = user;
		}
		//停止
		clearInterval(queryUserFunc);
	}
}
/*
	修改网名
 */
var btn = document.getElementById('user');
btn.onclick = function () {
	var user = document.getElementById("user").innerText;
	var userName = prompt("修改您的昵称", user);
	if (userName) {
		// 限制网名长度
		userName = userName.substring(0, 30);
		// 设置cookie
		setCookie('userName', userName, 30 * 24 * 60 * 60);
		document.getElementById("user").innerHTML = userName;
	}
}
/*
    显示时间
 */
function myTimer() {
	var d = new Date();
	var ymd = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
	document.getElementById("ymd").innerHTML = ymd;
	var t = d.toTimeString().substr(0, 8);
	document.getElementById("myTimer").innerHTML = t;
}

/*
    发送消息
 */
function sendmsg() {
	if (!(document.cookie.indexOf("sendmsg") + 1)) {
		// 设置cookie
		setCookie('sendmsg', 'sendmsg', 2); //过期时间 2 秒
		var fm = document.getElementsByTagName('form')[0];
		var fd = new FormData(fm); //收集数据
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				// alert(xhr.responseText);
				document.getElementById('sendresult').innerHTML = xhr.responseText;
				//表单域信息归位
				var res = xhr.responseText;
				if (res.indexOf("发送成功") != -1 || res.indexOf("消息为空") != -1) {
					// document.getElementsByTagName('select')[0].value = "";//颜色
					document.getElementsByTagName('select')[1].value = ""; //表情
					document.getElementsByTagName('select')[2].value = ""; //心情
					document.getElementById('msg').value = ""; //消息
					document.getElementById('image').value = ""; //图片
				}
				if (res == '发送成功') {
					ws.send('nr=send&key=all');
				}
				//3s后使得发表留言的消息消失
				setTimeout("hideresult()", 3000);
			}
		}
		xhr.open('post', './send.php');
		xhr.send(fd);
	}
}
//使发表留言的标志信息消失
function hideresult() {
	document.getElementById('sendresult').innerHTML = "";
}
/*
    lazyload
 */
// 存储图片加载到的位置，避免每次都从第一张图片开始遍历
var n = 0;
showmsg = document.getElementById('show_msg');
function show(ID,before) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var message = xhr.responseText;
			if (message != 0) {
				showmsg.innerHTML = '';
				msg(message);
				if (before) showmsg.scrollTop = 0;
				if(minID <= 1) up_lost();
				if(maxID >= max) down_lost();
			}
		}
	}
	xhr.open('get', './move.php?maxID=' + ID +'&before='+before);
	xhr.send(null);
}

read_before_id = document.getElementById("read_before");
read_before = read_before_id.getAttribute("class");
read_after_id = document.getElementById("read_after");
read_after = read_after_id.getAttribute("class");
var up = null;

function up_now(move){
	if (move>20 && minID > 1) {
		if (read_before.indexOf('now') == -1) {
			read_before = read_before.concat(' now');
			read_before_id.setAttribute("class",read_before);
		}
	}
}
function down_now(move){
	if (move>20 && maxID < max) {
		if (read_after.indexOf('now') == -1) {
			read_after = read_after.concat(' now');
			read_after_id.setAttribute("class",read_after);
		}
	}
}
function up_lost(){
	if (read_before.indexOf('now') != -1) {
		read_before = read_before.replace('now','');
		read_before_id.setAttribute("class",read_before);
	}
}
function down_lost(){
	if (read_after.indexOf('now') != -1) {
		read_after = read_after.replace('now','');
		read_after_id.setAttribute("class",read_after);
	}
}
showmsg.onscroll = function () {
	lazyloadFun();
	up_now(move);
	down_now(move);
	if (up) clearTimeout(up);
	up = setTimeout(()=>{
		up_lost();down_lost();
	}, 15000);
	move <= 20 ? ++move : move=0;
}
function lazyloadFun() {
	n = 0;
	lazyload();
}
function lazyload() {
	img_num = document.getElementsByTagName('img').length;
	image = document.getElementsByTagName("img");
	for (var i = n; i < img_num; i++) {
		var top = image[i].getBoundingClientRect().top;
		if (top > 100) {
			if (image[i].getAttribute("src") == "icons/load.png") {
				image[i].src = image[i].getAttribute("data-src");
			}
		}
		n = i + 1;
	}
}
read_before_id.onclick = function(){
	if(minID > 1){
		show(minID,true);
	}
}
read_after_id.onclick = function(){
	if(maxID < max){
		show(maxID,false);
	}
}
/*
    WebSocket
 */
function websocket() {
	// 连接websocket
	socket();
	//握手监听函数
	ws.onopen = function () {
		//状态为1证明握手成功，然后把client自定义的名字发送过去
		if (ws.readyState == 1) {
			ws.send(send + n);
		}
	}
	//错误返回信息函数
	ws.onerror = function () {
		console.log("error");
	};
	//监听服务器端推送的消息
	ws.onmessage = function (msg) {
		// JSON.parse() 方法用于将一个 JSON 字符串转换为对象(数组)。
		str = JSON.parse(msg.data);
		if (typeof (str.users) != 'undefined') {
			users = str.users;
		}
		for (var i = 0; i < users.length; i++) {
			if (typeof (str.nrong) != 'undefined' && users[i]['code'] == str.nrong && users[i]['name'] != null) {
				//插入用户退出提示语
				var s = "<p style='color:#006400;font-size:35px;text-align:center;' class='flex'>" + users[i]['name'] + " 退出 " + str.time + "</p>";
				showmsg.innerHTML += s;
			}
		}
		if (typeof (str.name) != 'undefined') {
			//插入用户加入提示语
			var s = "<p style='color:#D2691E;font-size:35px;text-align:center;' class='flex'>欢迎 " + str.name + " 加入 " + str.time + "</p>";
			showmsg.innerHTML += s;
			var arr = { 'code': str.code, 'name': str.name };
			let tmp = true;
			for (let i = 0; i < users.length; i++) {
				if (users[i].code == str.code) {
					tmp = false;
				}
			}
			if (tmp) {
				users.push(arr);
			}
			if (visitorMsg != "已经记录") visitor();
			//显示用户数量
			setTimeout("number()", 50);
		}
		//数据库拉取消息
		if (str.nrong == 'send') {
			showmessage();
		}
		//卷起高度等于div本身高度，就可以使得滚动条始终在最下边显示
		showmsg.scrollTop = showmsg.scrollHeight;
		move = 0;
	}
	//断开WebSocket连接
	ws.onclose = function () {
		send = null, n = null;
		websocket();
	}
}
window.onload = function () {
	//获得最新聊天内容
	showmessage();
	//生成用户信息
	visitor();
	//显示时间
	setInterval("myTimer()", 1000);
	//显示用户名
	queryUserFunc = setInterval("queryUser()", 10);
}
// 按键 
var isEnter = false;
var isCtrl = false;
document.onkeydown = function (event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	var key = e.keyCode;
	if (key == 13) {
		isEnter = true;
	}
	if (key == 17) {
		isCtrl = true;
	}
	if (isEnter && isCtrl) {
		sendmsg();
	}
};
document.onkeyup = function (event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	var key = e.keyCode;
	if (key == 13) {
		isEnter = false;
	}
	if (key == 17) {
		isCtrl = false;
	}
};
// 执行插入 
var selectId = document.getElementById("biaoqing");//获取ID
selectId.onchange = function()//触发事件
{
    var result = selectId.options[selectId.selectedIndex].innerHTML;//获取选中文本
    // console.log(result);
    insertAtCursor(document.getElementById('msg'),result);
}