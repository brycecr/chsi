<?php
	# loads all attributes of a category

	include 'configuration.php';
	$category = $_GET['category'];
	$query = sprintf("SELECT * FROM DataElementDescription WHERE PAGE_NAME = '%s' AND COLUMN_NAME <> 'State_FIPS_Code' AND COLUMN_NAME <> 'County_FIPS_Code' AND COLUMN_NAME <> 'CHSI_County_Name' AND COLUMN_NAME <> 'CHSI_State_Name' AND COLUMN_NAME <> 'CHSI_State_Abbr' AND COLUMN_NAME <> 'Strata_ID_Number' AND COLUMN_NAME <> 'Strata_Determining_Factors'", mysql_real_escape_string($category));
 	$result = mysql_query($query);
  	$array = array();
  	while($r = mysql_fetch_assoc($result)) {
    	$array[] = $r;
    }

 	echo json_encode($array);
?>