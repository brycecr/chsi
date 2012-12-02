<?php
	# loads data for attribute

	include 'configuration.php';
	$category = $_GET['category'];
	$attribute = $_GET['attribute'];
	$query = "SELECT State_FIPS_Code, County_FIPS_Code, ".$attribute." FROM " .$category;
 	$result = $db -> query($query);
  	$array = array();
  	while($r = $result -> fetch()) {
    	$array[] = $r;
    }

 	echo json_encode($array);
?>