<?php
	$user = "root";
	$password = "root";
	$host = "localhost";
	$database = "communityhealth";
	$con = mysql_connect($host, $user, $password)
		or die ("Couldn't connect to server.");
	$dbs = mysql_select_db($database, $con);
?>