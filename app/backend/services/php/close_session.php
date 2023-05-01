<?php 
session_start(); 
$_SESSION = []; 
$_COOKIE = [];
session_unregister(); 
session_unset();
?>