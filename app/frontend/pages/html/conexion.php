<?php

$dbname = 'proyecto';
$dbuser = 'root';
$bdhost = 'localhost';
$dbpass = '';

$conexion = mysqli_connect($dbname, $dbuser, $bdhost, $dbpass);



$password = '';
$username = 'root';
$host = 'localhost';
$dbname = 'proyecto';

$LINK = new mysqli($host, $username, $password, $dbname);

?>