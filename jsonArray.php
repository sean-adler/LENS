<?php

    $dbconn = pg_connect("host=greenzone-db.private.atlassian.com dbname=greenzone user=sadler password=QVa8446PhDQ5")
    or die('Could not connect: ' . pg_last_error());

    // Performing SQL query
    $query = 'SELECT distinct(ship_city), country, date, product, license_type, sale_type 
      FROM sale WHERE date >= now() - interval \'1 day\'
      AND ship_city is not null';
    $result = pg_query($query) or die('Query failed: ' . pg_last_error());
    $numrows = pg_numrows($result);

    $phpSaleList = array();

    for ($i=0; $i<$numrows; $i++)
    {
      // Populate locations array
      $phpSaleList[$i]["address"] = pg_fetch_result($result, $i, 0) . ", " . pg_fetch_result($result, $i, 1);
      $phpSaleList[$i]["description"] = pg_fetch_result($result, $i, 3) . "<br>" . pg_fetch_result($result, $i, 4) . "<br>" . 
        pg_fetch_result($result, $i, 5) . "<br>" . pg_fetch_result($result, $i, 0) . ", " . 
        pg_fetch_result($result, $i, 1);
    }
    echo json_encode($phpSaleList);

    // Free resultset
    pg_free_result($result);
    // Closing connection
    pg_close($dbconn);

?>