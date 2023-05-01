<?php
session_start();
$_SESSION = json_decode(trim(file_get_contents("php://input")), true);
?>