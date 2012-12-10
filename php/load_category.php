<?php
	# loads all attributes of a category

	include 'configuration.php';
	$category = $_GET['category'];
	$query = "SELECT * FROM DataElementDescription WHERE PAGE_NAME =
	'". $category . "' AND COLUMN_NAME <> 'State_FIPS_Code' AND
	COLUMN_NAME <> 'County_FIPS_Code' AND COLUMN_NAME <>
	'CHSI_County_Name' AND COLUMN_NAME <> 'CHSI_State_Name' AND
	COLUMN_NAME <> 'CHSI_State_Abbr' AND COLUMN_NAME <>
	'Strata_ID_Number' AND COLUMN_NAME <>
	'Strata_Determining_Factors' AND COLUMN_NAME NOT LIKE '%Max_%' AND COLUMN_NAME NOT LIKE '%Min_%'";
	$result = $db -> query($query);
  	$array = array();
  	while($r = $result -> fetch()) {
    	$array[] = $r;
    }

 	echo json_encode($array);
?>