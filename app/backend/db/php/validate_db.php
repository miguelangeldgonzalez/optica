<?php
$dbname = $_POSt['dbname'];

mysqli_query($connection, 'CREATE DATABASE IF NOT EXISTS '.$dbname);

?>