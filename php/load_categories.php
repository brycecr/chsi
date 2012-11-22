<?php
	# loads all categories

	include 'configuration.php';
 	$query = "SELECT * FROM Categories";
 	$result = mysql_query($query);
  	$array = array();
  	while($r = mysql_fetch_assoc($result)) {
    	$array[] = $r;
    }

 	echo json_encode($array);
?>