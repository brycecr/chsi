<?php
	$user="root";
	$password="root";
	$host="localhost";
	$database="communityhealth";
	$dbc=mysqli_connect($host, $user, $password, $database)
		or die ("Couldn't connect to server.");	
?>