<?php
	# loads all categories

	include 'configuration.php';
 	$query = "SELECT * FROM Categories";
 	$result = $db -> query($query);
  	$array = array();
  	while($r = $result -> fetch()) {
    	$array[] = $r;
    }

 	echo json_encode($array);
?>