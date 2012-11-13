<?php
	# loads all attributes

	include 'configuration.php';

	$class_name = $_GET['class'];
	$query = sprintf("SELECT id FROM classes WHERE name = '%s'", mysql_real_escape_string($class_name));
 	$result = mysql_query($query);
 	$row = mysql_fetch_array($result);
 	$class_id = $row[0];
 	
 	$query = sprintf("SELECT * FROM attributes WHERE class_id = '%d'", $class_id);
 	$result = mysql_query($query); 	
  	$array = array();
  	while($r = mysql_fetch_assoc($result)) {
    	$array[] = $r;
    }

 	echo json_encode($array);
?>