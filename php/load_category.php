<?php
	# loads all attributes of a category

	include 'configuration.php';
	$category = $_GET['category'];
	$query = sprintf("SELECT * FROM DataElementDescription WHERE PAGE_NAME = '%s'", mysql_real_escape_string($category));
 	$result = mysql_query($query);
  	$array = array();
  	while($r = mysql_fetch_assoc($result)) {
    	$array[] = $r;
    }

 	echo json_encode($array);
?>